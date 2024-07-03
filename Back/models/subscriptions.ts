import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'
import { PushSubscription, PushSubscriptionVars } from '../types'

// A model storing push subscriptions for users.
export class Subscriptions extends Model<PushSubscription, PushSubscriptionVars> {
  declare sub_id: number
  declare user_id: number
  declare sub_obj: string
  declare active: boolean
}

Subscriptions.init({
  sub_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'user_id'},
    onDelete: 'CASCADE'
  },
  sub_obj: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  timestamps: false,
  underscored: true,
  modelName: 'subscriptions'
})
