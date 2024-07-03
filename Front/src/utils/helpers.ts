import { LoggedUser } from '../types'

// This file contains general helper functions used all-around the app.

// Checks the type of error message.
export const getErrorMessage = (err: unknown) => {  
  if (err instanceof Error) {
    if (err.message.indexOf('Received status code 413') > 0) {
      return 'File size is limited to 2MB'
    }
    return err.message
  }
  return null
}

// Setting logged user to local storage
export const updateStorage = (user: LoggedUser, token: string | null) => {
  
  if (token === null) {
    token = JSON.parse(localStorage.getItem('RTCChatUser') as string).token
  }
  localStorage.setItem('RTCChatUser', JSON.stringify({
    token,
    user
  }))
}

// If a dropdown activator (an element with data-dropdown attribute) is clicked, the dropdown menu under that activator is shown.
export const clickHandler = (e: MouseEvent) => {
  
  if (!e.target) return

  const target = e.target as HTMLDivElement    
  const isDropdownBtn = target.matches('[data-dropdown]')     
  const currentDropdown = target.closest('[data-dropdown]')   // Detects if the clicked element is a child element of dropdown activator.
  const isLink = target.matches('.link')
  
  // If a dropdown activator (user icon) is clicked, the dropdown menu controlled by the activator 
  // is shown or hidden depending of its current state. Clicking a link inside dropdown menu closes the menu,
  // otherwise the dropdown is kept visible, hence isLink && currentDropdown.
  if (isDropdownBtn || isLink && currentDropdown) {
    currentDropdown?.classList.toggle('active')
  }

  // Iterating through all active dropdowns, and closing all except the one that triggered this event.
  // At the moment this is redundant since there's only one dropdown activator element.
  document.querySelectorAll('[data-dropdown].active')
    .forEach(d => {
      if (d !== currentDropdown) d.classList.remove('active')
    })
}

// Formatting Date object to string.
export const formatDate = (date: string) => {
  const dateMillis = Number(date)  
  
  const formatter = new Intl.DateTimeFormat('fi-FI', { 
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
 })
  return isNaN(dateMillis) ? date : formatter.format(new Date(dateMillis))
}

// On "swedish day" - the 6th of November - characters 'o' and 'O' in message text area are converted to 'å' and 'Å'.
export const svenskaDagen = (textArea: HTMLTextAreaElement): void => {  
  const date = new Date()
  if (textArea && date.getMonth() === 10 && date.getDate() === 6) {
    textArea.value = textArea.value.replaceAll('o', 'å')
    textArea.value = textArea.value.replaceAll('O', 'Å')
  }  
}

// Testing if the send file is an image. If so, the image data is returned as a Base64 string. The image is 
// resized by creating an Image object, which is set as the source to a canvas element. The Base64 of the image 
// is created by using Canvas.toDataUrl() method. Parameter maxSize defines the maximum width of height of the
// image.
export const imgReader = async (files: FileList, maxSize: number) => {
  if (files.length < 1 || !files[0].type.match(/image/)) return null
  const type = files[0].type
  
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = (readerEvent) => {
      let canv = document.createElement('canvas')
      let img = new Image()
      img.onload = () => {
        let width = img.width
        let height = img.height
        
        // If the width is greater than the allowed max size, the height is set relative to max width
        // to keep the correct aspect ratio. The width is then set to max size.
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width
            width = maxSize
          }          
        }

        // Other way around.
        if (height > width) {
          if (height > maxSize) {
            width *= maxSize / height
            height = maxSize
          }
        }
        // If the image is a perfect square, no multiplications for resizing are needed.
        if (height === width) {
          width = maxSize
          height = maxSize
        }

        // The resized image is now drawn into the canvas element, which is then converted into Base64 format.
        canv.width = width
        canv.height = height
        canv.getContext('2d')?.drawImage(img, 0, 0, width, height)
        
        resolve(canv.toDataURL(type))
      }
      img.src = readerEvent.target?.result as string
    }
    fr.onerror = (err) => reject(err)
    fr.readAsDataURL(files[0])
  })
}

// Converting a Base64 string to Uint8Array.
export const base64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')
 
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length);
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray
}

// Opening an image attached to a message in a new tab.
export const imgInNewTab = (base64URL: string) => {
  const win = window.open();
  //win?.document.write(`<iframe src='${base64URL}' frameborder='0' style='border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;' allowfullscreen></iframe>`);
  const img = new Image()//document.createElement('img')  
  img.src = base64URL
  win?.document.body.appendChild(img)
}

// Asking a permission for push notifications. Used in UserMenu component.
export const askNotificationPermission = () => {
  return new Promise((resolve, reject) => {
    const permission = Notification.requestPermission(result => {
      resolve(result)
    })
    // If permission is null, reject is called.
    if (permission) {
      permission.then(resolve, reject)
    }
  })
}

// Pinging the server periodically to prevent the virtual machines running the server to shut down.
export const wakeUpCall = async () => {
  try {    
    const query = async () => {
      return await fetch(`${BACKEND_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: ` 
            query { wakeUpCall }
          `
        })
      }
    )
  }
  
  setInterval(async () => {
    const { data } = await (await query()).json()
    console.log('Wake up call', data.wakeUpCall)
  }, 120000)
  } catch (err) {
    console.log('Error fetching wake up call from the server.')    
  }
}

// Query template for handling PushNotification settings. The query type and name are determined by 'operation' parameter.
// This is utilized in helper functions below.
const subOperation = async (operation: string, user_id: string, sub: string) => {
  return await fetch(`${BACKEND_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: ` 
        ${operation}(
          $sub: String!
          $user_id: ID!
        ) {
          ${operation.split(' ')[1]}(
            sub: $sub
            user_id: $user_id
          )
        }
      `,
      variables: {
        sub,
        user_id
      }
    })
  })
}

// Getting ServiceWorkerRegsitration and possible PushSubscription registration.
export const getRegistrationAndSub = async () => {
  let reg = await navigator.serviceWorker.ready
  let sub = await reg.pushManager.getSubscription()
  
  return { reg, registeredSub: sub ? JSON.stringify(sub): null }
}

// Get saved PushSubscription from server by user_id. Called in AuthContext when user is logging in.
export const getSubFromDB = async (user_id: number): Promise<string | null> => {
  let { registeredSub } = await getRegistrationAndSub()
  
  // If a subscription for push notifications is registered in client browser, attempting to fetch the subscription object
  // from the database via server.
  if (registeredSub) {
    const res = await subOperation('query getSub', user_id.toString(), registeredSub)
    const { data } = await res.json()    
    return data.getSub
  }  
  return null
}

// Enabling push notifications. A registered PushSubscription is sent to server.
export const enableSub = async (user_id: number) => {  
  
  try {    
    let { reg, registeredSub } = await getRegistrationAndSub()
    // Registering to push notification service if a registration isn't found in the browser.
    if (!registeredSub) {
      console.log('Registering sub to browser')
        
      // Getting the public key needed for registration from the server.
      const response = await fetch(`${BACKEND_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: '{ getVapidKeys }'
        })
      })
      const { data } = await response.json()
      
      // Creating PushSubscription object
      registeredSub = JSON.stringify(await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64ToUint8Array(data.getVapidKeys)
      }))
    }
    // Sending the subscription object to server to be stored into database.
    const res = await subOperation('mutation registerSub', user_id.toString(), registeredSub)
    const { data } = await res.json()
    console.log('Push subscriptions enabled.')    
    return data.registerSub
  } catch (err) {
    return null
  }
}

// Disabling push notifications.
export const disableSub = async (user_id: number) => {
  
  try {
    let { registeredSub } = await getRegistrationAndSub()
    
    if (registeredSub) {
      await subOperation('mutation removeSub', user_id.toString(), registeredSub)
      console.log('Push subscriptions disabled.')
    }
    // Remove registered subscription from browser.
    //await sub.unsubscribe()
  } catch (err) {
    throw new Error(`Bad response from server: ${err}`)
  }
}

// Clearing notifications of the contact linked with opened conversation.
// Called in MessageView.
export const dismissPushNotification = async (user_id: string) => {
  const { reg } = await getRegistrationAndSub()
  const notifications = await reg.getNotifications({ tag: user_id })
  
  notifications.forEach(notification => {
    notification.close()
  })
}

// Detecting possible urls from the message text. If urls are found, splitting the 
// text and links into an array. The array is iterated in MessageView.
export const detectUrls = (text: string) => { 
  if (!text) return
  const urlRegex = /(https?:\/\/[^\s]+)/g
	const links = text.match(urlRegex)
	
  if (!links) return [text]

	const textAsArr = links.reduce((result, link, index) => {
		const split = result.text.split(link)
    
    // If the message starts with a link, split[1] containing the text is pushed as the last element.
    split[0] === '' && links.length === 1
      ? result.arr.push(split[0], links[index], split[1]) 
      : result.arr.push(split[0], links[index])
		return { text: split[1], arr: result.arr }
	}, { text , arr: [] as string[] })

	return textAsArr.arr
}

// Checking if the current month is December.
export const isDecember = () => {
  const date = new Date()  
  return date.getMonth() === 11
}