import { sequelize } from '../util/db'
import { Op } from 'sequelize' 
import { Users, Connections, Messages, UnseenMessages, Subscriptions } from '../models'
import { User, UserVars, Credentials, MessageVars, UnseenMessageVars } from '../types'
import { GraphQLError } from 'graphql'
import { DB_NAME, DB_SIZE_LIMIT, TOKEN_SECRET, VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY, VAPID_SUBJECT } from '../util/config'
import { PubSub, withFilter } from 'graphql-subscriptions'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import webPush from 'web-push'
const pubsub = new PubSub()

// The keys for push subscriptions.
webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)


export const resolvers = {
    User: {
      connections: async (root: any) => {
        const connections = await sequelize.query(
          `WITH friends AS (
            SELECT connections.connection_id,
              CASE
              WHEN user_one = ${root.user_id} THEN user_two
              WHEN user_two = ${root.user_id} THEN user_one
              END AS user_id FROM connections
          )
          SELECT DISTINCT friends.connection_id, friends.user_id, users.name, users.img
          FROM friends JOIN users ON users.user_id = friends.user_id`
        )            
        return connections[0]
      }
    },    
    Query: {
      // To keep the server connection alive.
      wakeUpCall: () => {    
        return true
      },
      getVapidKeys: () => {
        return VAPID_PUBLIC_KEY
      },
      // Fetches the push subscription object from the DB. If not found, null is returned.
      // 
      getSub: async (_root: any, args: { sub: string, user_id: string }) => {        
        try {
          const existingSub = await Subscriptions.findOne({
            where: { 
              [Op.and]: [
                { user_id: args.user_id },
                { sub_obj: args.sub }
              ]
            }
          })
          
          return existingSub ? JSON.stringify(existingSub) : null
        } catch (e) {
          console.log('Error fetching subscription from DB', e)
          return null          
        }        
      },
      // Returns the current user from context. The user is set to context in index.ts by using the authorization token received from the client.
      me: (_root: any, _args: any, context: { currentUser: User }) => {
        //console.log('conteksti me:ssä', context)      
        return context.currentUser
      },
      allUsers: async () => {
        return await Users.findAll()
      },
      findUser: async (_root: any, args: { user_id: string }) => {
        return await Users.findOne({
          where: { user_id: args.user_id }
        })
      },
      // Returns messages linked to the pertinent connection_id. Only 10 most recent messages are returned by default.
      allMessages: async (_root: any, args: { first: number, before: string, connection_id: number }) => {        
        const messages = await Messages.findAll({
          limit: args.first,
          where: {
            [Op.and]: [
              { connection_id: args.connection_id },
              { time: { [Op.lt]: args.before ? args.before : Date.now().toString()} }
            ]
          },
          order: [['message_id', 'DESC']]
        })
        
        // Checking if there are more messages to fetch after the 10 most recent ones. This is determined by comparing the time stamp
        // of the oldest message of the previous set to the time stamps of remaining messages in DB.
        const hasPrev = messages.length > 0 
          ? (await Messages.count({
            where: { 
              [Op.and]: [
                { connection_id: args.connection_id },
                { time: { [Op.lt]: messages[messages.length - 1].time}}
              ]
            },
          })) > 0
          : false
        
        // Arranging the pagination info and messages to return to the client into an single object.
        return {
          pageInfo: {
            hasPreviousPage: hasPrev,
            endCursor: messages.length > 1 ? messages[messages.length - 1].time : null
          },
          edges: messages.map(m => {
            return {
              cursor: m.time,
              node: m.toJSON()
            }
          }).reverse()
        }        
      },
      // Checking if any of the users conversations contain unseen messages.
      getUnseenMsgs: async (_root: any, args: { user_id: number }, _context: { currentUser: User }) => {
        try {
          const unseenMsgs = await UnseenMessages.findAll({
            attributes: ['connection_id', 'unseen'],
            where: { user_id: args.user_id }
          })                    
          return JSON.stringify(unseenMsgs)
        } catch (err) {
          throw new GraphQLError(`Can't fetch unseen messages, server is busy.`)
        }
      }
    },
    Mutation: {
      addUser: async (_root: User, args: UserVars) => {
        if (!args.name || !args.pwd) {
          throw new GraphQLError('Missing username or password')
        }
        const pwdHash = await bcrypt.hash(args.pwd, 10)        
        return await Users.create({ ...args, pwd: pwdHash })
      },
      updateUser: async (_root: User, args: { user_id: string, img: string }, context: { currentUser: User }) => {          
        try {          
          const user = await Users.findByPk(context.currentUser.user_id)
          
          user?.set({          
          img: args.img
        })
        return await user?.save()
        } catch (err) {
          console.log('errori', err)
          throw new Error('Error saving profile picture.')         
        }
        
      },
      login: async (_root: User, args: Credentials) => {
        const user = await Users.findOne({ where: { name: args.name }})
        const authOk = !user ? false : await bcrypt.compare(args.pwd, user.pwd)
  
        if (!authOk) throw new GraphQLError('Wrong credentials')
        
        const userForToken = {
          name: user?.name,
          user_id: user?.user_id
        }
  
        return { 
          token: jwt.sign(userForToken, TOKEN_SECRET),
          user
        }
      },
      addContact: async (_root: any, args: { name: string }, context: { currentUser: User }) => {
        if (!context.currentUser) throw new GraphQLError(`User not authenticated`)
        const contact = await Users.findOne({ where: { name: args.name }})
        
        if (!contact) throw new GraphQLError(`User ${args.name} not found`)
  
        await Connections.create({
          user_one: context.currentUser.user_id,
          user_two: contact.user_id
        })
        
        const me = await Users.findOne({ where: { name: context.currentUser.name }})
        return me
      },
      createMessage: async (root: any, args: MessageVars, context: { currentUser: User }) => {
        if (!context.currentUser) throw new GraphQLError(`User not authenticated`)
        
        const message = await Messages.create({
          message_text: args.message_text,
          message_img: args.message_img,
          user_id: args.user_id,
          receiver: args.receiver,
          connection_id: args.connection_id,
          time: args.time
        })
                
        // Setting the 'unseen' flag for the relevant conversation to true for the receiver of the new message. Referring directly to unseenMsgs resolver.
        await resolvers.Mutation.setUnseenMsgs(root, { 
          unseen: true,
          connection_id: args.connection_id,
          user_id: Number(args.receiver)
        })
        // Publishing message using GraphQL subsciption.
        pubsub.publish('MESSAGE_ADDED', { newMessage: message })
        
        // The PushSubscription object from DB for notifications.
        const userSubs = await Subscriptions.findAll({ where: { user_id: args.receiver }})
        // Sending notification to each active subscription of the user. Iterating through all subscriptions, because the user may have subscriptions
        // enabled in multiple devices.
        userSubs.forEach(sub => {
                    
          if (sub.active) {
            webPush
              .sendNotification(JSON.parse(sub.sub_obj), JSON.stringify({
                title: context.currentUser.name,
                content: args.message_text,
                receiver: args.receiver,
                sender: context.currentUser.user_id.toString()
              }))
              // If sending the push notification fails, the subscription object is probably deprecated, and therefore removed from the database.
              .catch(async (err: any) => {
                console.log('Push-error: ', err, sub.sub_obj, typeof sub.sub_obj, err.statusCode)                
                if (err.statusCode === 410) {
                  await Subscriptions.destroy({
                    where: { sub_obj: sub.sub_obj }
                  })
                  console.log('Deprecated subscription removed from DB.')
                }
              })
          }
        })
        return message      
      },
      editMessage: async (root: any, args: { user_id: string, message_id: string, message_text: string }, context: { currentUser: User }) => {
        try {
          const updatedMsg = await Messages.update(
            { message_text: args.message_text },
            { where: { message_id: args.message_id }, returning: true },
          )
          // Using MESSAGE_ADDED subscription to update edited message in receivers history.
          // The older message with same id is automatically replaced on client.
          pubsub.publish('MESSAGE_ADDED', { newMessage: updatedMsg[1][0] })
          return true
        } catch (err) {
          throw new GraphQLError('Editing message failed.')
        }        
      },
      setUnseenMsgs: async (_root: any, args: UnseenMessageVars) => {
        try {
          const [unseenMsgRow] = await UnseenMessages.findOrCreate(
            { where: { 
                user_id: args.user_id,
                connection_id: args.connection_id
              }              
            }
          )
          
          unseenMsgRow.unseen = args.unseen
          await unseenMsgRow.save()
          return true
        } catch (err) {
          console.log('errori: ', err)
          throw new GraphQLError(`Error setting unseen messages to DB.`)
        }
      },
      // Registering a push subscription for user.
      registerSub: async (root: any, args: { sub: string, user_id: number }) => {
        try {     
          let pushSubscription = await Subscriptions.findOne({
            where: { 
              [Op.and]: [
                { user_id: args.user_id },
                /*sequelize.where(
                  sequelize.cast(sequelize.col('sub_obj'), 'varchar'),
                  {[Op.iLike]: `%${JSON.parse(args.sub).keys.auth}%`}
                )*/
                { sub_obj: args.sub }
              ]
            }
          })
          
          // If a subscription isn't found, creating a new one.
          if (!pushSubscription) {
            console.log('Saving the subscription object to DB.')
            pushSubscription = await Subscriptions.create({
              user_id: args.user_id,
              sub_obj: args.sub,
              active: true
            })
            console.log('Subscription saved.')            
            return JSON.stringify(pushSubscription)
          }
          // Updating subscription object to DB.
          pushSubscription.active = true
          await pushSubscription.save()   
          return JSON.stringify(pushSubscription)
          
        } catch (e) {
          return `Failed to save subscription data: ${e}`
          
        }        
      },
      // Setting subscription for push notifications inactive.
      removeSub: async (_root: any, args: { sub: string, user_id: number }) => {
        try {
          const pushSubscription = await Subscriptions.findOne({
            where: { 
              [Op.and]: [
                { user_id: args.user_id },
                sequelize.where(
                  sequelize.cast(sequelize.col('sub_obj'), 'varchar'),
                  {[Op.iLike]: `%${JSON.parse(args.sub).keys.auth}%`}
                )
              ]
            }
          })

          if (pushSubscription) {
            pushSubscription.active = false
            await pushSubscription.save()
          }
          
          /* For deleting subscription from DB.
          await Subscriptions.destroy({
            where: { user_id: args.user_id}
          })*/          
        } catch (err) {
          return 'Unsubscribing failed'
        }
        return 'Succesfully unsubscribed'
      },
      runDbCleanup: async () => {
        // Getting current database size in megabytes, max message_id of all messages,
        // and the total amount of messages. If the size exceeds the sizeLimit, all
        // messages in conversations not containing unseen messages are removed.
        // Called in index.ts.
        try {
          console.log('DB_NAME', DB_NAME)
          
          const { size }: any = (await sequelize.query(   
            `SELECT (PG_DATABASE_SIZE('${DB_NAME}') / 1024 / 1024 )::INTEGER as size`
          ))[0][0]
          
          console.log('DB size limit: ', DB_SIZE_LIMIT)
          console.log('Current DB size: ', size)        
          
          if (size >= DB_SIZE_LIMIT) {
            // Deleting messages only from conversations where all messages are seen by the participants.
            await sequelize.query(   
              `DELETE FROM messages
                WHERE connection_id NOT IN (
                SELECT connection_id FROM unseen_msgs
                WHERE unseen = true
              )`
            )
            return true
          }
          return false
        } catch (err) {
          throw new GraphQLError(`Error with cleanup process: ${err}`)
        }
      },
      clearTestDB: async (_root: any) => {
        try {
          await sequelize.truncate({ cascade: true, restartIdentity: true })
          return true
        } catch (err) {
          return false
        }
      },
      // For administrator only. Used to clear the conversation with user Visitor.
      clearVisitor: async (_root: any) => {
        try {
          // Fix this to run all the operations with one query.
          const user_id = (await Users.findOne({ where: { name: 'Visitor' }}))?.user_id
          const connection_id = (await Connections.findOne({
            where: {
              [Op.or]: [
                { user_one: user_id },
                { user_two: user_id }
              ]
            }
          }))?.connection_id
                    
          await sequelize.query(
            `DELETE FROM messages
             WHERE connection_id = ${connection_id}`
          )
          
          return true
        } catch (err) {
          return false
        }
      }        
    },    
    Subscription: {
      // Every subscriber is registered and saved into interator object called 'MESSAGE_ADDED'. When the server receives a 
      // new message, every subscribing client gets the message (in resolver function 'createMessage' above). Using 
      // function withFilter() to prevent events firing when not intended: the first parameter is the function to run 
      // when needed, the other returns a boolean which determines whether to run the former one.      
      newMessage: {
        subscribe: withFilter(
          () => {
            return pubsub.asyncIterator('MESSAGE_ADDED')
          },
          (payload, variables) => {
            return (Number(payload.newMessage.connection_id) === Number(variables.connection_id)) &&
                   (Number(payload.newMessage.receiver) === Number(variables.user_id))
          }
        )
      }
    }
  }