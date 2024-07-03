import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'
import { User, UserVars } from '../types'

// The model for storing users.
export class Users extends Model<User, UserVars> {
  declare user_id: number
  declare name: string
  declare pwd: string
  declare img: string
}

Users.init({
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    onDelete: 'CASCADE'
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  pwd: {
    type: DataTypes.STRING(70),
    allowNull: false
  },
  img: {
    type: DataTypes.TEXT
  }
}, {
  sequelize,
  timestamps: false,
  underscored: true,
  modelName: 'users',
  indexes: [{
    unique: true,
    fields: ['name']
  }]
})