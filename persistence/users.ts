import { randomBytes, createHash } from 'node:crypto'
import { createCreateOperation, createGetOperation, createFindOperation, createDeleteOperation } from './lib'
import type { User, UserCreateProps, UserFindProps } from './types'

const defaultUserCreate = createCreateOperation<UserCreateProps>('users')

export const userCreate = async ({ rawPassword, ...props }:
  & Omit<UserCreateProps, 'passwordHash' | 'passwordSalt'>
  & { rawPassword: string }) => {
  const passwordSalt = randomBytes(20).toString('hex')
  const passwordPepper = process.env['PASSWORD_PEPPER']

  if (!passwordPepper) {
    throw new Error('PASSWORD_PEPPER not provided')
  }

  const passwordHash = createHash('sha256')
    .update(passwordSalt)
    .update(passwordPepper)
    .update(rawPassword)
    .digest('hex')

  return defaultUserCreate({
    ...props,
    passwordHash,
    passwordSalt
  })
}

export const userGet = createGetOperation<User>('users')

export const usersFind = createFindOperation<User, UserFindProps>('users')

export const userDelete = createDeleteOperation('users')
