import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { Server as SocketIOServer } from 'socket.io'
import { logger } from '../logger'
import {
  addGrocery,
  asNumberGuard,
  authorizationGuard,
  createList,
  deleteGrocery,
  deleteShortage,
  getGrocery,
  getList,
  getListGroceries,
  getListShortages,
  getMyLists,
  groceryFromShortage,
  groceryToShortage,
  initializeSession,
  joinToListByPin,
  listAccessGuard,
  renameGrocery,
  renameList,
  userIdFromTokenGuard,
} from './handlers'
import { userSessionsFind } from '@my-groceries/persistence'

export const createService = async () => {
  const app = fastify({ logger })

  // #region WebSockets

  const io = new SocketIOServer(app.server, {
    serveClient: false,
    cors: {
      origin: '*'
    }
  })

  io.on('connection', async (socket) => {
    try {
      const { token } = socket.handshake.auth as { token: string }

      if (!token) {
        socket.disconnect(true)

        throw new Error('Token not provided in socket auth')
      }

      const [userSession] = await userSessionsFind({ token })

      if (!userSession) {
        socket.disconnect(true)

        throw new Error('Cannot find user session by token in socket auth')
      }

      await socket.join(`user-${userSession.userId}`)

      socket.on('disconnect', async () => {
        try {
          await socket.leave(`user-${userSession.userId}`)
        } catch (e) {
          logger.error(e)
        }
      })
    } catch (e) {
      logger.error(e)
    }
  })

  // #endregion

  app.register(fastifyCors, { origin: true })

  await app.register(fastifySwagger, {
    swagger: {
      info: {
        title: "My groceries service",
        description: "",
        version: '0.1.0'
      },
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        }
      }
    }
  })

  app.get('/my/lists', async ({ headers }) => {
    const userId = userIdFromTokenGuard(headers)

    return getMyLists(userId)
  })

  app.post<{
    Body: {
      code: string
    }
  }>('/lists/joinByPin', {
    schema: {
      description: "Join to list by pin-code",
      body: {
        type: 'object',
        required: ['code'],
        additionalProperties: false,
        properties: {
          code: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            listId: { type: 'number' }
          }
        }
      }
    }
  }, async ({ headers, body: { code } }) => {
    const { sub } = authorizationGuard(headers)
    const userId = asNumberGuard(sub)

    return joinToListByPin(userId, code)
  })

  app.post('/lists', async ({ headers }) => {
    const { sub } = authorizationGuard(headers)
    const userId = asNumberGuard(sub)

    return createList(userId)
  })

  app.get<{
    Params: { listId: string },
  }>('/lists/:listId', async ({ headers, params: { listId: listIdStr } }) => {
    const userId = userIdFromTokenGuard(headers)
    const listId = asNumberGuard(listIdStr)

    await listAccessGuard(userId, listId)

    return getList(userId, listId)
  })

  app.post<{
    Params: { listId: string },
    Body: { name: string }
  }>('/lists/:listId', {
    schema: {
      description: 'Rename list',
      body: {
        type: 'object',
        required: ['name'],
        additionalProperties: false,
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 255 }
        }
      }
    }
  }, async ({ headers, params: { listId: listIdStr }, body: { name } }) => {
    const userId = userIdFromTokenGuard(headers)
    const listId = asNumberGuard(listIdStr)

    await listAccessGuard(userId, listId)

    await renameList(listId, name)

    io.in(`list-${listId}`).emit('list-renamed')
  })

  app.get<{
    Params: { listId: string }
  }>('/lists/:listId/groceries', async ({ headers, params: { listId: listIdStr } }) => {
    const userId = userIdFromTokenGuard(headers)
    const listId = asNumberGuard(listIdStr)

    await listAccessGuard(userId, listId)

    return getListGroceries(listId)
  })

  app.post<{
    Params: { listId: string }
  }>('/lists/:listId/socket/subscribe', async ({ headers, params: { listId: listIdStr } }) => {
    const userId = userIdFromTokenGuard(headers)
    const listId = asNumberGuard(listIdStr)

    await listAccessGuard(userId, listId)

    for (const socket of io.of(`user-${userId}`).sockets.values()) {
      await socket.join(`list-${listId}`)
    }
  })

  app.post<{
    Params: { listId: string }
  }>('/lists/:listId/socket/unsubscribe', async ({ headers, params: { listId: listIdStr } }) => {
    const userId = userIdFromTokenGuard(headers)
    const listId = asNumberGuard(listIdStr)

    await listAccessGuard(userId, listId)

    for (const socket of io.of(`user-${userId}`).sockets.values()) {
      await socket.leave(`list-${listId}`)
    }
  })

  app.post<{
    Params: { listId: string },
    Body: { name: string }
  }>('/lists/:listId/groceries', {
    schema: {
      description: 'Add grocery to list',
      body: {
        type: 'object',
        required: ['name'],
        additionalProperties: false,
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 255 }
        }
      }
    }
  }, async ({ headers, params: { listId: listIdStr }, body: { name } }) => {
    const userId = userIdFromTokenGuard(headers)
    const listId = asNumberGuard(listIdStr)

    await listAccessGuard(userId, listId)

    await addGrocery(listId, name)

    io.in(`list-${listId}`).emit('grocery-added')
  })

  app.post<{
    Params: { listId: string, groceryId: string },
    Body: { name: string }
  }>('/lists/:listId/groceries/:groceryId', {
    schema: {
      description: 'Rename grocery in list',
      body: {
        type: 'object',
        required: ['name'],
        additionalProperties: false,
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 255 }
        }
      }
    }
  }, async ({ headers, params: { listId: listIdStr, groceryId: groceryIdStr }, body: { name } }) => {
    const userId = userIdFromTokenGuard(headers)
    const listId = asNumberGuard(listIdStr)
    const groceryId = asNumberGuard(groceryIdStr)

    await listAccessGuard(userId, listId)

    await renameGrocery(groceryId, name)

    io.in(`list-${listId}`).emit('grocery-renamed')
  })

  app.get<{
    Params: { listId: string, groceryId: string },
  }>('/lists/:listId/groceries/:groceryId', async ({ headers, params: { listId: listIdStr, groceryId: groceryIdStr } }) => {
    const userId = userIdFromTokenGuard(headers)
    const listId = asNumberGuard(listIdStr)
    const groceryId = asNumberGuard(groceryIdStr)

    await listAccessGuard(userId, listId)

    return getGrocery(listId, groceryId)
  })

  app.delete<{
    Params: { listId: string, groceryId: string }
  }>('/lists/:listId/groceries/:groceryId', async ({ headers, params: { listId: listIdStr, groceryId: groceryIdStr } }) => {
    const userId = userIdFromTokenGuard(headers)
    const listId = asNumberGuard(listIdStr)
    const groceryId = asNumberGuard(groceryIdStr)

    await listAccessGuard(userId, listId)

    await deleteGrocery(groceryId)

    io.in(`list-${listId}`).emit('grocery-deleted')
  })

  app.post<{
    Params: { listId: string, groceryId: string }
  }>('/lists/:listId/groceries/:groceryId/to_shortages', async ({ headers, params: { listId: listIdStr, groceryId: groceryIdStr } }) => {
    const userId = userIdFromTokenGuard(headers)
    const listId = asNumberGuard(listIdStr)
    const groceryId = asNumberGuard(groceryIdStr)

    await listAccessGuard(userId, listId)

    await groceryToShortage(listId, groceryId)

    io.in(`list-${listId}`).emit('grocery-shortaged')
  })

  app.post<{
    Params: { listId: string, groceryId: string }
  }>('/lists/:listId/groceries/:groceryId/from_shortages', async ({ headers, params: { listId: listIdStr, groceryId: groceryIdStr } }) => {
    const userId = userIdFromTokenGuard(headers)
    const listId = asNumberGuard(listIdStr)
    const groceryId = asNumberGuard(groceryIdStr)

    await listAccessGuard(userId, listId)

    await groceryFromShortage(listId, groceryId)

    io.in(`list-${listId}`).emit('grocery-abundanced')
  })

  app.get<{
    Params: { listId: string }
  }>('/lists/:listId/shortages', async ({ headers, params: { listId: listIdStr } }) => {
    const userId = userIdFromTokenGuard(headers)
    const listId = asNumberGuard(listIdStr)

    await listAccessGuard(userId, listId)

    return getListShortages(listId)
  })

  app.delete<{
    Params: { listId: string, shortageId: string }
  }>('/lists/:listId/shortages/:shortageId', async ({ headers, params: { listId: listIdStr, shortageId: shortageIdStr } }) => {
    const userId = userIdFromTokenGuard(headers)
    const listId = asNumberGuard(listIdStr)
    const shortageId = asNumberGuard(shortageIdStr)

    await listAccessGuard(userId, listId)

    await deleteShortage(shortageId)

    io.in(`list-${listId}`).emit('grocery-abundanced')
  })

  app.post('/users/session', {
    schema: {
      description: 'Create user and it\'s session',
      response: {
        200: {
          type: 'object',
          required: ['token'],
          properties: {
            token: { type: 'string', minLenght: 1 }
          },
        }
      }
    }
  }, async () => {
    return initializeSession()
  })

  await app.register(fastifySwaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: "full",
      deepLinking: true
    }
  })

  return app
}
