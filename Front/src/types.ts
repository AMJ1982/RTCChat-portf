import { ReactNode, Dispatch } from 'react'

// Type definitions.

export type AuthProviderProps = { children: ReactNode }

export type NotificationProviderProps = { children: ReactNode }

export type Credentials = { name: string, pwd: string }

export type Connection = {
  name: string
  user_id: string
  img: string
  connection_id: string
}

export interface User {
  user_id: number,
  name: string,
  pwd: string,
  img: string,
  connections: [Connection]
}

export interface LoggedUser {
  user_id: number,
  name: string,
  img: string,
  pushNotifications: boolean,
  connections: [Connection]
}

export type NewUser = Omit<User, 'user_id' | 'connections'>

export type PageInfo = {
  endCursor: string,
  hasPreviousPage: boolean,
  startCursor: string
}

export type MessageObject = {
  user_id: string,
  message_text: string,
  message_img: string | null,
  time: string
  message_id: number
}

export type MessageEdge = {
  cursor: string,
  node: MessageObject
}

export type MessageConnection = {
  edges: [MessageEdge],
  pageInfo: PageInfo
}

export type NotificationContext = (text: string, type: string) => void
export type ShowMessageHandle = (text: string, type: string) => void

export type FullScreenCardProps = { children: ReactNode }

export interface CardBodyProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode
}

export type UnseenMsgIdentifier = {
  connection_id: number,
  unseen: boolean
}

export interface ImgPreviewProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  attachment: string
  setAttachment: React.Dispatch<React.SetStateAction<string>>
}

export interface DialogHookProps {
  setShowConfirmation: Dispatch<React.SetStateAction<boolean>>
}

export interface ConfirmProps {
  onConfirm: () => void,
  onCancel: () => void,
}

export type AuthContext = {
  user: LoggedUser | undefined,
  setUser: React.Dispatch<React.SetStateAction<LoggedUser | undefined>>
  userLogin: (credentials: Credentials, form: HTMLFormElement) => void,
  handleLogout: () => void,
  createUser: (user: NewUser) => Promise<User>,
  editUser: (user_id: number, attachment: string) => void,
  addFriend: (name: string) => void
  clearVisitor: () => void
}
