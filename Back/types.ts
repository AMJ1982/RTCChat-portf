import { Optional } from 'sequelize'

export type User = { name: string, pwd: string, user_id: number, img?: string }
export type UserVars = Optional<User, 'user_id'>
export type NewUser = Omit<User, 'user_id'>

export type Credentials = { name: string, pwd: string }
export type UserObjForToken = { name: string, user_id: string }

export type Connection = { connection_id: number, user_one: number, user_two: number }
export type ConnectionVars = Omit<Connection, 'connection_id'>

export type PushSubscription = { sub_id: number, user_id: number, sub_obj: string, active: boolean }
export type PushSubscriptionVars = Omit<PushSubscription, 'sub_id'>

export type Message = { 
	message_id: number,
	message_text: string,
	message_img: string,
	time: string,
	connection_id: number,
	user_id: number,
	receiver: number
}
export type MessageVars = Omit<Message, 'message_id'>

export type UnseenMessage = {
	id: number,
	unseen: boolean,
	connection_id: number,
	user_id: number
}
export type UnseenMessageVars =  Omit<UnseenMessage, 'id'>

export type PageInfo = {
	hasPreviousPage: boolean		
	hasNextPage: boolean
	startCursor: string
	endCursor: string
}