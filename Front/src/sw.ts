export default null
declare var self: ServiceWorkerGlobalScope

// The service worker file of the application. Contains functionalities for cache, and push notification handling.

const channel = new BroadcastChannel('sw-messages')
const cacheVersion = 5
const STATIC_CACHE = `offline-content-v${cacheVersion}`
const DYNAMIC_CACHE = `dynamic-content-v${cacheVersion}`
// Precached content. The items are practically request URLs.
const CACHE_ASSETS = [
  '/index.html',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/main.js',
  '/manifest.json',
]

// Setting the correct application url; localhost for development mode.
const APP_URL = MODE === 'production'
		? 'https://rtcchat.fly.dev'
		: 'http://localhost:3000'

self.addEventListener('install', (e) => {
	console.log('SW install.')
  self.skipWaiting()

  // Precaching
	e.waitUntil(
    // Opening the cache. If it doesn't exist, it's created. Assets are fetched from the server if not found in cache.
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(CACHE_ASSETS)
    })    
	)
})

// This event is fired after succesful installation.
self.addEventListener('activate', (e) => {
  console.log('SW activated')
  // Remove unwanted cache. Looping through the caches, and if it's not the current cache, delete it.
  // Using Promise.all because waitUntil accepts one promise, and we possibly have to perform various 
  // asynchronous delete()-tasks. Promises returned by delete() are mapped into an array, because
  // Promise.all expects an array of promises.
  const cacheAllowList = [STATIC_CACHE, DYNAMIC_CACHE]
  e.waitUntil(
    caches.keys().then(keys => Promise.all([
      keys.map(key => {
        if (!cacheAllowList.includes(key)) {
          return caches.delete(key)
        }
        return       
      }),
      self.clients.claim()
    ]))
    )
})

// Requests are intercepted here. Implementing a cache first strategy to reduce loading times.
self.addEventListener('fetch', async (e) => {  
	const requestURL = new URL(e.request.url)

  e.respondWith((async () => {
    // Returning the response from cache if found.
    const cachedRes = await caches.match(e.request)    
    if (cachedRes) return cachedRes
    
    // Fetching the response from the network.
    const fetchRes = await fetch(e.request.clone())
    
    // Saving selected requests to dynamic cache.
    if (e.request.method === 'GET' && 
       (e.request.destination === 'image' || e.request.destination === 'script') &&
       !requestURL.href.includes('chrome-extension') &&
       !requestURL.href.includes('hot-update') &&
       !CACHE_ASSETS.includes(requestURL.pathname)
    ) {
      const cache = await caches.open(DYNAMIC_CACHE)
      await cache.put(e.request, fetchRes.clone())
    }
    return fetchRes
  })())  
})

// Setting the listener for push events. This is launched when user receives a notification from the registered push service.
self.addEventListener('push', (e: any) => {
	const payload = e.data?.text()
	const payloadObj = JSON.parse(payload)
  
  // Gathering all open browser windows.
	e.waitUntil(self.clients.matchAll({
		includeUncontrolled: true,
		type: 'window' 
	}).then(cs => {
      // Checking if the chat view with the sender of the message that fired this event is open, visible and focused.
			const activeChatClient = cs.find(c => c.url.match(`${APP_URL}/#/chat/${payloadObj.sender}`)
				&& c.visibilityState === 'visible'
				&& c.focused)
			
      // Using BroadcastChannel to launch refetch of unseen messages in Main component.
			channel.postMessage({ title: payloadObj.sender })
			
      // Showing a push notification of new message if a chat client with relevant sender isn't active.
			if (!activeChatClient) {
				return self.registration.showNotification(payloadObj.title, { 
					body: payloadObj.content ? payloadObj.content : `${payloadObj.title} sent an image.`,
					tag: payloadObj.sender,
					renotify: true
				})
			}
      return Promise.resolve()      
		})
	)
})

// Event listener for clicking a push notification dialog. Opens the conversation view with the sender of the message.
self.addEventListener('notificationclick', (e) => {
	const clickedNotification = e.notification
	
  e.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({
        includeUncontrolled: true,
				type: 'window'
      })

      let chatClient
      // Checking if a chat window is found.
      for (const client of allClients) {
        const clientUrl = new URL(client.url)
        
        // If conversation window is already open in background, set focus on the client.
        if (clientUrl.href.match(`${APP_URL}/#/chat/${clickedNotification.tag}`)) {
          client.focus()
          break
        }
        // If app is opened in some other page, navigating to conversation view with the sender.
        if (clientUrl.href.match(APP_URL)) {					
		  		client.navigate(`${APP_URL}/#/chat/${clickedNotification.tag}`)
          client.focus()					
          chatClient = client
          break
        }
      }
      // If not, a new window is opened.
      if (!chatClient) {
        chatClient = await self.clients
		  		.openWindow(`${APP_URL}/#/chat/${clickedNotification.tag}`)
      }
    })()
  )
})

// A function to limit caches keys to certain amount. Could be called in 'fetch' listener 
// when applying items to cache.
const limitCacheSize = (name: string, size: number) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(res => 
          limitCacheSize(name, size)
        )
      }
    })
  })
}