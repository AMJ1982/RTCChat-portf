import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'
import { Connection, ConnectionVars } from '../types'

// A model representing connections between users.
export class Connections extends Model<Connection, ConnectionVars> {
    declare connection_id: number
    declare user_one: number
    declare user_two: number
  }
  
  Connections.init({
    connection_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_one: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'user_id'},
      onDelete: 'CASCADE'
    },
    user_two: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'user_id'},
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'connections'
  })