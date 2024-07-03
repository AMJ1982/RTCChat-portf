import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'
import { Message, MessageVars } from '../types'

// The model for representing individual messages in the database. connection_id as foreign key links the messages to related conversations.
export class Messages extends Model<Message, MessageVars/*, Omit<MessageVars, 'connection_id'>*/> {
    declare message_id: number
    declare message_text: string
    declare message_img: string
    declare time: string
    declare connection_id: string
    declare user_id: number
    declare reveiver: number
  }
  
  Messages.init({
    message_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    message_text: {
      type: DataTypes.TEXT
    },
    message_img: {
      type: DataTypes.TEXT
    },
    time: {
      type: DataTypes.TEXT
    },
    connection_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'connections', key: 'connection_id'},
      onDelete: 'CASCADE'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      //references: { model: 'users', key: 'user_id'}
    },
    receiver: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'messages'
  })