import { gql } from '@apollo/client'

// GraphQL functionality.

// Fragments
const USER_DETAILS = gql`
  fragment UserDetails on User {
    name
    user_id
    img
  }
`

const MESSAGE_DETAILS = gql`
  fragment MessageDetails on Message {    
    message_id
    message_text
    message_img
    time
    user_id    
  }
`

// Queries
export const USER_COUNT = gql`
  {
    userCount
  }
`

export const ALL_MESSAGES = gql`
  query allMessages($connection_id: ID, $first: Int, $before: String) {
    allMessages(connection_id: $connection_id, first: $first, before: $before) {
      pageInfo {
        endCursor
        hasPreviousPage
        startCursor
      }
      edges {
        cursor
        node {
          time
          ...MessageDetails
        }
      }
    }
  }
  ${MESSAGE_DETAILS}
`

export const ME = gql`
  {
    me {
      ...UserDetails
      connections {
        name
        img
        user_id
        connection_id
      }
    }
  }
  ${USER_DETAILS}
`

export const USER = gql`
  query findUserByName($user_id: ID!) {
    findUser(user_id: $user_id) {
      ...UserDetails
        connections {
          name
          user_id
          img
          connection_id
        }
    }
  }
  ${USER_DETAILS}
`

export const GET_UNSEEN_MSGS = gql`
  query getUnseenMsgs(
    $user_id: ID!
  ) {
    getUnseenMsgs(
      user_id: $user_id
    )
  }
`

// Mutations
export const ADD_USER = gql`
  mutation createUser(
    $name: String!
    $pwd: String!
    $img: String
  ) {
    addUser(
      name: $name
      pwd: $pwd
      img: $img
    ) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`

export const UPDATE_USER = gql`
  mutation updateUser(
    $img: String
    $user_id: ID!
  ) {
    updateUser(
      img: $img
      user_id: $user_id
    ) {
      ...UserDetails
      connections {
        name
        user_id
        img
        connection_id
      }
    }
  }
  ${USER_DETAILS}
`

export const LOGIN = gql`
  mutation login(
    $name: String!
    $pwd: String!
  ) {
    login(
      name: $name
      pwd: $pwd
    ) {
      token
      user {
        ...UserDetails
        connections {
          name
          user_id
          img
          connection_id
        }
      }
    }
  }
  ${USER_DETAILS}
`

export const ADD_CONTACT = gql`
  mutation addContact(
    $name: String!
  ) {
    addContact(name: $name) {
      ...UserDetails
      connections {
        user_id
        name
        connection_id
      }
    }
  }
  ${USER_DETAILS}
`

export const CREATE_MESSAGE = gql`
  mutation createMessage(
    $connection_id: ID!
    $user_id: ID!
    $receiver: ID
    $message_text: String
    $message_img: String
    $time: String
  ) {
    createMessage(
      connection_id: $connection_id
      user_id: $user_id
      receiver: $receiver
      message_text: $message_text
      message_img: $message_img
      time: $time
      ) {
      ...MessageDetails
    }
  }
  ${MESSAGE_DETAILS}
`

export const EDIT_MESSAGE = gql`
  mutation editMessage(
    $user_id: ID!
    $message_id: ID!
    $message_text: String!
  ) {
    editMessage(
      user_id: $user_id
      message_id: $message_id
      message_text: $message_text
    )
  }
`

export const UPDATE_UNSEEN_MSGS = gql`
  mutation setUnseenMsgs(
    $unseen: Boolean!
    $connection_id: ID!
    $user_id: ID!
  ) {
    setUnseenMsgs(
      unseen: $unseen
      connection_id: $connection_id
      user_id: $user_id
    )
  }
`

export const CLEAR_VISITOR = gql`
  mutation clearVisitor {
    clearVisitor
  }
`

export const MESSAGE_ADDED = gql`
  subscription newMessage(
    $connection_id: ID
    $user_id: ID
  ) {
    newMessage(
      connection_id: $connection_id
      user_id: $user_id
    ) {
      time
      ...MessageDetails
    }
  }
  ${MESSAGE_DETAILS}
`