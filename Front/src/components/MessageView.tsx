import React, { useState, useRef, useEffect, lazy } from 'react'
import { ApolloError, useMutation, useSubscription, useLazyQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { Button } from './Button'
import { useLocation, Navigate, Link } from 'react-router-dom'
import { MessageConnection, MessageObject, MessageEdge } from '../types'
import { CREATE_MESSAGE, MESSAGE_ADDED, UPDATE_UNSEEN_MSGS, ALL_MESSAGES } from '../graphql/queries'
import { useAuth } from '../context/AuthContext'
import { imgReader, formatDate, getErrorMessage, detectUrls, imgInNewTab, svenskaDagen, dismissPushNotification } from '../utils/helpers' // TÄLLE LAZY IMPORT
import { useNotification } from '../context/NotificationContext'
const ImgPreview = lazy(() => import('./ImgPreview'))
const Dropdown = lazy(() => import('./Dropdown'))

// The component used for sending and receiving messages with the current contact.
const MessageView = (): JSX.Element => {
  // The user_id of the other participant of this conversation is separated from URL.
  // This is used to find the matching connection of the user, and if found, the 
  // connection is set as friend. If not found, the user is redirected to main page.
  const location = useLocation()
  const { user } = useAuth()
  const friend = user?.connections.find(friend => 
    friend.user_id === location.pathname.split('/')[2])
    
  if (!friend) return <Navigate to='/'/>
  
  const showNotification = useNotification()
  const [attachment, setAttachment] = useState<string>('')  
  const messagesRef = useRef<HTMLDivElement>(null)
  const prevHeight = useRef<number | null>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  
  // Apollo queries, mutations and subscription.

  // The main query returning the 10 latest messages with the current friend. The query is performed after the component mounts.
  const [getMessages, { data, called, loading, fetchMore, client }] = useLazyQuery(ALL_MESSAGES, {
    variables: {
      connection_id: friend.connection_id,
      first: 10,
      before: null
    },
    onError: (err: ApolloError) => console.log(err.message)
  })
  
  const [createMessage] = useMutation(CREATE_MESSAGE, {
    onError: (err: ApolloError) => {
      console.log(err)
      showNotification(getErrorMessage(err) as string, 'error')
    }
  })

  const [updateUnseenMsgs] = useMutation(UPDATE_UNSEEN_MSGS, {
    onError: (err: ApolloError) => {
      showNotification(getErrorMessage(err) as string, 'error')
      console.log('updateUnseenMsgs:', err)
    }
  })
  // GraphQL subscription. Receives new messages.
  useSubscription(MESSAGE_ADDED, {
    variables: {
      connection_id: friend.connection_id,
      user_id: user?.user_id
    },
    onData: ({ data }) => {
      updateCache(data.data.newMessage)
      setMessagesSeen()
    },
    fetchPolicy: 'network-only'
  })
  
  // Appending messages in Apollo cache with the new message received in GQL-subscription.
  const updateCache = (message: MessageObject) => {
    const msgs: { allMessages: MessageConnection} | null = client.readQuery({ query: ALL_MESSAGES })
    client.writeQuery({
      query: ALL_MESSAGES,
      data: {
        allMessages: {
          edges: [
            {
              __typename: 'MessageEdge',
              cursor: message.time,
              node: message
            } as MessageEdge
          ],
          pageInfo: msgs?.allMessages.pageInfo
        }         
      }
    })
  }  

  // Loading messages and removing notifications of current connection when component mounts.
  // Also adding onFocus-listener to remove notifications when user focuses on the component.
  // The listener is removed when component unmounts along with resetting the Apollo cache.
  useEffect(() => {
    getMessages()
    handleRemoveNotifications()
    window.addEventListener('focus', handleRemoveNotifications)
    setMessagesSeen()
    return () => {
      client.resetStore()
      window.removeEventListener('focus', handleRemoveNotifications)
    }
  }, [friend])
  
  // Calculating the correct scroll height.
  useEffect(() => {
    if (!data) return    
    let difference = null
    
    // If previous height is set, more messages are fetched.
    if (prevHeight.current && messagesRef.current) {
      difference = messagesRef.current.scrollHeight - prevHeight.current
      prevHeight.current = null
    }
    
    scrollToBottom(difference)     
  }, [data, messagesRef.current])
  
  // Scrolls the message view to bottom after sending or receiving a message (difference ==== null).
  // On case of fetching messages from history, sets scrolling to correct height.
  const scrollToBottom = (difference: number | null): void => {
    if (!messagesRef.current) return    
    
    messagesRef.current.scrollTop = difference 
      ? difference
      : messagesRef.current.scrollHeight
  }  

  // Controlling the height of the text area by its contents.
  const resizeTextArea = () => {
    if (textAreaRef.current) {
      let area = textAreaRef.current
      area.style.height = '27px'
      area.style.height = area.scrollHeight + 'px'
    }
  }

  // Fetches previous set of messages from conversation history, and saving the height of 
  // messages div before appending older messages to state.
  const moreMessages = async () => {
    if (!data.allMessages.pageInfo.hasPreviousPage) return
    prevHeight.current = messagesRef.current?.scrollHeight as number
    fetchMore({
      variables: {
        first: 10,
        before: data.allMessages.pageInfo.endCursor
      }    
    })
  }

  //Setting unseen messages of the conversation in DB to false.
  const setMessagesSeen = async () => {
    updateUnseenMsgs({
      variables: {
        unseen: false,
        connection_id: friend.connection_id,
        user_id: user?.user_id,
      }
    })
  }
  
  // Handler methods.

  // Removing the push notifications concerning this conversation when MessageView is opened.
  const handleRemoveNotifications = () => {
    dismissPushNotification(friend.user_id)
  }

  // When message view is scrolled to top, 10 previous messages are fetched from the server.
  const handleScroll = (): void => {
    if (messagesRef.current?.scrollTop === 0) moreMessages()
  }

  // Called when user is sending a new message.
  const handleSend = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    
    try {
      // Separating a possible attachment from the file input of the form.
      const form = e.target as HTMLFormElement
      const files = (form.elements[2] as HTMLInputElement).files as FileList
      const text = textAreaRef.current && (textAreaRef.current.value !== '')
        ? textAreaRef.current.value
        : null
      
      // Sending the FileList to imgReader. The resized image is returned in Base64 format.
      const img = await imgReader(files, 600)

      // Preventing sending if there's neither text content nor image attachment.
      if (!text && !img) return

      // Creating a message object.
      const message = {
        connection_id: friend.connection_id,
        user_id: user?.user_id,
        receiver: friend.user_id,
        message_text: text,
        message_img: img,
        time: Date.now().toString()
      }
      // Clearing the form and attachment. The message text area is then resized to its default height.
      form.reset()
      setAttachment('')
      resizeTextArea()

      // The new message to server.
      const sentMessage = await createMessage({
        variables: message
      })

      // Appending the sent message to Apollo cache.
      updateCache(sentMessage.data.createMessage)
    } catch (err) {
      showNotification(getErrorMessage(err) as string, 'error')
    }    
  }
  
  // Called when a character is typed into the text field. On "Swedish day" the relevant letters are converted to their Swedish form.
  const handleTextFieldChange = (): void => {
    if (textAreaRef.current) svenskaDagen(textAreaRef.current)
    resizeTextArea()
  }

  // Showing loading animation if the content is still loading.
  if (loading || !called) return <div className='loader-ring'></div>
   
  return (
    <>
      <div id='messages' ref={messagesRef} onScroll={handleScroll}>
        {data.allMessages.edges.length > 0 ? data.allMessages.edges.map((edge: MessageEdge, i: number) => {
          const { node } = edge
          // Running the text content through helper method to separate possible links.
          const textAsArr = detectUrls(node.message_text)
          return (
            // Forming message bubbles of the messages. The styling of the bubbles is defined by the sender of the message:
            // own messages are aligned to the right side of the view, friends messages to the left.
            <div 
              className={`message-bubble 
                ${Number(node.user_id) === Number(user?.user_id) 
                  ? 'me'
                  : 'friend'}`
              }
              key={i}
            >
              <div className='edit icon-div dropdown' data-dropdown>
                <FontAwesomeIcon className={`icon`} icon={faEllipsisV}/>
                {/* A Dropdown menu providing a link to message editing view. If the class name of this bubble is 'friend', this menu isn't shown. */}
                <Dropdown style={{ padding: '0' }}>
                  <Link className='link tight' to={'/edit-msg'} state={{ node }}>Edit message</Link>
                  {/*<div className='link tight'>Delete message</div>*/}
                </Dropdown>
              </div>  
              {node.message_img &&
                <img 
                  className='message-bubble-img'
                  src={node.message_img}
                  onClick={() => imgInNewTab(node.message_img as string)}                    
                />
              }
              <p className='text'>{
                // Iterating the array containing the message text and possible links. Odd rows are text 
                // nodes, even rows links.
                textAsArr?.map((row, i) => {
                  return i % 2 === 0
                    ? row
                    : <a href={row} key={i + row}>{row}</a>
                })
              }</p>
              {node.time &&
                <p className='time'>
                  <span id='sender-name'>{`${friend.name}, `}</span>
                  {formatDate(node.time)}
                </p>
              }
            </div>
          )})
          : <div className='no-messages'>
              <p>{`No messages. Write something to start a conversation with ${friend.name}.`}</p>
            </div>
      }
      </div>
      <div id='message-tool-bar'>
        {attachment &&
          // If an image file is attached, it's shown in a preview component.
          <ImgPreview 
            attachment={ attachment }
            setAttachment={ setAttachment }
          />
        }
        <form id='message-tools' onSubmit={(e) => handleSend(e)}>          
          <textarea 
            id='message-text-input'
            ref={textAreaRef}
            rows={1}
            autoFocus
            onChange={handleTextFieldChange}
            onKeyDown={(e) => {
              // If enter is pressed, the submit of this form is called.
              if(e.key === 'Enter' && e.shiftKey == false) {
                e.preventDefault()
                textAreaRef?.current?.form?.requestSubmit()
              }
            }}
          />
          <div style={{ display: 'flex', gap: '0.5em' }}> 
            <Button 
              text='Send'
              className={`button-send`}
            />
            <label htmlFor='input-file'>
              <div className='icon-div'>
                <FontAwesomeIcon className={`icon`} icon={faPaperclip}/>
              </div>
            </label>              
            <input
              type='file'
              id='input-file'
              onChange={async ({ target }) => {
                if (target.files) {
                  const img = await imgReader(target.files, 50)
                  setAttachment(img as string)
                }
              }
            }/>
          </div>  
        </form>
      </div>       
    </>
  )
}

export default MessageView