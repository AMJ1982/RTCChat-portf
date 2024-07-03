import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider, DefaultContext, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { setContext } from '@apollo/client/link/context'
import { clickHandler, isDecember } from './utils/helpers'
import './index.css'

// Click listener to document. Helper function clickHandler controls showing and dismissing drop menus.
document.addEventListener('click', clickHandler)
// Activating Christmas theme if the current month is December.
document.body.dataset.theme = isDecember() ? 'xmas': ''

// User token added to server requests in authorization header.
const authLink = setContext((_, { headers }): DefaultContext => {
  const storageItem = localStorage.getItem('RTCChatUser')

  if (!storageItem) return headers

  const token = JSON.parse(localStorage.getItem('RTCChatUser') as string).token
  
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null
    }    
  }
})

// HTTP connections.
const httpLink = new HttpLink({
  uri: BACKEND_URL,
  fetchOptions: {
    mode: 'cors',
    signal: (new AbortController()).signal,
  }
})

// WebSocket connections.
const wsLink = new GraphQLWsLink(createClient({
  url: BACKEND_WS,
  keepAlive: 30_000,
  on: {
    connected: () => console.log('Ws connected'),
    closed: () => console.log('Ws closed'),
    //pong: (received) => console.log('Pong received: ', received)
  },
}))

// HTTP and WS connections combined.
const splitLink = split(
  ({ query }) => {
  const definition = getMainDefinition(query)
  return (
    // If true, wsLink is returned.
    definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  )},
  wsLink,
  authLink.concat(httpLink)
)

// Registering service worker if supported.
if ('serviceWorker' in navigator && 'PushManager' in window) {
  addEventListener('load', async () => {
    const reg = await navigator.serviceWorker.register('/service-worker.js')
    reg.update()
    console.log('Registering service worker')
  })
}

// Creating Apollo Client instance. Shared to underlying components by using ApolloProvider initialized in root.render method.
const client = new ApolloClient({
  cache: new InMemoryCache({
    addTypename: true,
    // Merging new messages to the existing messages in cache.
    typePolicies: {      
      Query: {
        fields: {          
          allMessages: {
            // Reading the existing messages. Must be done to assign existing variable in merge.
            read: (existing) => {
              return existing
            },
            // Merging subsequently fetched older messages to all messages in cache.
            merge: (existing, incoming) => {
              if (existing && existing.edges.length > 0) {
                const isNewMsg = 
                  incoming.edges[incoming.edges.length - 1].cursor >
                  existing.edges[existing.edges.length - 1].cursor
                return {
                  ...existing,
                  pageInfo: incoming.pageInfo,
                  edges: isNewMsg
                    ? existing.edges.concat(incoming.edges)
                    : incoming.edges.concat(existing.edges)
                }
              }
              return incoming
            }
          }
        }
      },
      Message: {
        keyFields: ['message_id']
      }
    }
  }),
  link: splitLink
})

// Casting the root to HTMLElement, because getElementById returns HTMLElement | null
// and createRoot doesn't accept null.
const root = ReactDOM.createRoot(document.getElementById('container') as HTMLElement)
root.render(  
  <ApolloProvider client={client}>
    <Suspense fallback={<div className='loader-ring'></div>}>
      <RouterProvider router={router} />
    </Suspense>
  </ApolloProvider>  
)