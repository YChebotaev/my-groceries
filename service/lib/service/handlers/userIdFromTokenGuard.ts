import { asNumberGuard } from "./asNumberGuard"
import { authorizationGuard } from "./authorizationGuard"

export const userIdFromTokenGuard = (headers: { authorization?: string }) => {
  const { sub } = authorizationGuard(headers)
  const userId = asNumberGuard(sub)

  return userId
}
