import axios from 'axios'
import { PinCodesClient } from './PinCodesClient'

export const createClient = (baseURL: string, token: string) => {
  const client = axios.create({ baseURL })

  client.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${token}`

    return config
  })

  return new PinCodesClient(client)
}
