import { IncomingHttpHeaders } from 'node:http'
import jwt from 'jsonwebtoken'

export const authorizationGuard = (headers: IncomingHttpHeaders) => {
  const token = headers.authorization?.slice(7) ?? null

  console.log('token =', token)

  const jwtSecret = process.env['JWT_SECRET']

  if (token == null) {
    throw new Error('Can\'t find token in Authorization header')
  }

  if (!jwtSecret) {
    throw new Error('JWT_SECRET not provided')
  }

  if (!jwt.verify(token, jwtSecret)) {
    throw new Error('Token not valid')
  }

  const payload = jwt.decode(token, { json: true })

  return payload as NonNullable<typeof payload>
}
