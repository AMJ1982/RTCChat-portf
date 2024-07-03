import { Users } from './users'
import { Connections } from './connections'
import { Messages } from './messages'
import { Subscriptions } from './subscriptions'
import { UnseenMessages } from './unseen_msgs'

Subscriptions.sync({ alter: true })
Users.sync({ alter: true })
Connections.sync({ alter: true })
Messages.sync({ alter: true })
UnseenMessages.sync({ alter: true })

export { 
  Users,
  Connections,
  Messages,
  Subscriptions,
  UnseenMessages
}