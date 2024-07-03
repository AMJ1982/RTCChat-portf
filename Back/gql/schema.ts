import { gql } from 'apollo-server'

export const typeDefs = gql`
	type User {
		name: String!
		user_id: ID!
		pwd: String!
		img: String
		connections: [Connection]
	}

	type Connection {
		name: String!
		user_id: ID!
		img: String
		connection_id: ID!
	}

	type StrippedUser {
		name: String!
		user_id: ID!
		img: String
	}

	type Message {
		message_id: ID
		message_text: String
		message_img: String
		time: String
		connection_id: ID
		user_id: ID!
		receiver: ID
	}

	type MessageEdge {
		node: Message
		cursor: String
	}

	type PageInfo {
		hasPreviousPage: Boolean		
		hasNextPage: Boolean
		startCursor: String
		endCursor: String
	}

	type MessageConnection {
		totalCount: Int!
		pageInfo: PageInfo
		edges: [MessageEdge]
	}

	type VapidKeys {
		publicKey: String,
		privateKey: String
	}

	type PushSubscription {
		sub_id: Int
    	user_id: Int
    	sub_obj: String
	}

	type Query {
		wakeUpCall: Boolean!
		getVapidKeys: String		
		allUsers: [User]
		findUser(user_id: ID!): User
		me: User
		allMessages(
			first: Int
			before: String
			connection_id: ID
		): MessageConnection
		getUnseenMsgs(
			user_id: ID!
		): String
		getSub(
			sub: String!
			user_id: ID!
		): String
	}

	type Token {
		token: String!
		user: User!
	}

	type Mutation {
		addUser(
			name: String!
			pwd: String!
			img: String
		): User!
		updateUser(
			img: String
			user_id: ID!
		): User!
		login(
			name: String!
			pwd: String!
		): Token
		addContact(
			name: String!
		): User!
		createMessage(
			message_text: String
			message_img: String
			time: String
			connection_id: ID!
			user_id: ID!
			receiver: ID
		): Message
		editMessage(
			user_id: ID!
			message_id: ID!
			message_text: String!
		): Boolean
		setUnseenMsgs(
			unseen: Boolean!
			connection_id: ID!
			user_id: ID!
		): Boolean
		registerSub(
			sub: String!
			user_id: ID!
		): String
		removeSub(
			sub: String!
			user_id: ID!
		): String
		runDbCleanup: Boolean!
		clearTestDB: Boolean!
		clearVisitor: Boolean!
	}

	type Subscription {
		newMessage(
			connection_id: ID
			user_id: ID
		): Message!
	}
`