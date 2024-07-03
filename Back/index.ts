import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { WebSocketServer, WebSocket } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { Users } from './models'
import { TOKEN_SECRET } from './util/config'
import { UserObjForToken } from './types'
import { typeDefs } from './gql/schema'
import { resolvers } from './gql/resolvers'
import { connectToDb } from './util/db'
import helmet from 'helmet'
import jwt from 'jsonwebtoken'
import http from 'http'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
const helmet = require('helmet')
dotenv.config()

// Server is set to listen requests sent to '/' by using expressMiddleware. Since Express is now used,
// express.json() and cors are needed. GraphQL server has to be started when applied to expressMiddleware,
// so asynchronous function is used to enable waiting for the server to start.
const start = async () => {
  const app = express()

  app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
      scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
      frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
    },
  },
}));
  
  app.use(helmet())
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
    clientTracking: true
  })

  // Testing methods for keeping WS connection alive.
  wsServer.on('connection', (ws, req) => {

    // Receiving a ping from clients every 30 seconds.
    ws.on('message', (msg, isBinary) => {
      console.log('Ping from client')      
    })
  })
    
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)
  
  // Preparing the server.
  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            }
          }
        }
      }
    ]
  })

  await server.start()
  
  // Exposing folder for static content.
  app.use(express.static('../front-build'))
  app.use(
    '/',
    cors<cors.CorsRequest>(),
    express.json({ limit: '1.5MB'}),
    expressMiddleware(server, {

      // Separating authorization token from the request and setting an user to context.
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), TOKEN_SECRET) as UserObjForToken
          const currentUser = await Users.findByPk(decodedToken.user_id)
          return { currentUser }
        }
        return {}
      }
    })
  )

  await connectToDb()
  const PORT = 4000
  httpServer.listen(PORT, async () => {
    console.log(`Server is now running on ${PORT}, env: ${process.env.NODE_ENV}`)
    
    // If the database size >= the size limit, performing a database cleanup.
    try {
      const res = await resolvers.Mutation.runDbCleanup()
      console.log('DB cleanup performed: ', res)
    } catch (err) {
      console.log('Error during DB cleanup process: ', err)      
    }
  })
}

start()
