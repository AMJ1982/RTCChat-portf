import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'
import { UnseenMessage, UnseenMessageVars } from '../types'

// The model for controlling unseen messages in conversations.
export class UnseenMessages extends Model<UnseenMessage, UnseenMessageVars> {
    declare id: number
    declare unseen: boolean
    declare connection_id: number
    declare user_id: number
  }
  
  UnseenMessages.init({
    id: {
			type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    unseen: {
      type: DataTypes.BOOLEAN,
    },
    connection_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'connections', key: 'connection_id'},
      onDelete: 'CASCADE'
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'user_id'},
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'unseen_msgs'
  })