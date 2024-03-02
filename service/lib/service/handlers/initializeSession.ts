import jwt from 'jsonwebtoken'
import { generate } from 'generate-password'
import { userCreate, userSessionCreate } from '@my-groceries/persistence'

export const initializeSession = async () => {
  const rawPassword = generate({
    length: 8,
    symbols: false
  })
  const userId = await userCreate({ rawPassword })
  const jwtSecret = process.env['JWT_SECRET']

  if (!jwtSecret) {
    throw new Error('JWT_SECRET not provided')
  }

  const token = jwt.sign({}, jwtSecret, { subject: String(userId) })

  await userSessionCreate({ userId, token })

  return { token }
}
