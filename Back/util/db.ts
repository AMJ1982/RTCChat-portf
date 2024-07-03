import { Options, Sequelize } from 'sequelize'
import { FLY_DB_PWD, DEV_DB_PWD } from './config'
import { Umzug, SequelizeStorage } from 'umzug'

// Connection objects for different modes determined by NODE_ENV.
const getConnObject = (): Options => {
  switch (process.env.NODE_ENV) {
    case 'development' :
      return {
        database: 'rtcchat',
        username: 'postgres',
        password: DEV_DB_PWD,
        host: 'localhost',
        port: 5432,
        dialect: 'postgres',
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    case 'test' :
      return {
        database: 'rtcchat_test',
        username: 'postgres',
        password: DEV_DB_PWD,
        host: 'localhost',
        port: 5432,
        dialect: 'postgres',
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    default:
      return {
        database: 'rtcchat',
        username: 'postgres',
        password: FLY_DB_PWD,
        host: 'rtcchat-db.internal',
        port: 5432,
        dialect: 'postgres'
      }     
  }
}

export const sequelize = new Sequelize(getConnObject())

const runMigrations = async () => {
  console.log('runMigrations');
  
  const migrator = new Umzug({
    migrations: {
      glob: 'migrations/*.js'
    },
    storage: new SequelizeStorage({
      sequelize,
      tableName: 'migrations'
    }),
    context: sequelize.getQueryInterface(),
    logger: console
  })
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map(mig => mig.name)
  })  
}

export const connectToDb = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations() // highlight-line
    console.log('Connected to database')    
  } catch (err) {
    console.log('Database connection failed')
    console.log('Error: ', err)
    process.exit(1)
  }
  return null
}