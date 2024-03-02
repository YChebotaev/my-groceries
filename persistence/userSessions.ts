import { createCreateOperation, createGetOperation, createFindOperation, createDeleteOperation } from './lib'
import type { UserSession, UserSessionCreateProps, UserSessionFindProps } from './types'

const defaultUserSessionCreate = createCreateOperation<UserSessionCreateProps>('userSessions')

export const userSessionCreate = async (props: Omit<UserSessionCreateProps, 'revoked'>) =>
  defaultUserSessionCreate({ ...props, revoked: false })

export const userSessionGet = createGetOperation<UserSession>('userSessions')

export const userSessionsFind = createFindOperation<UserSession, UserSessionFindProps>('userSessions')

export const userSessionDelete = createDeleteOperation('userSessions')
