import { AxiosInstance } from "axios";
import type { CreateResult, LookupResult, RedeemResult } from './types'

export class PinCodesClient {
  constructor(private axios: AxiosInstance) { }

  async create<Payload>(payload: Payload) {
    const { data } = await this.axios.post<CreateResult>('/create', { payload })

    return data
  }

  async lookup<Payload>(code: string) {
    const { data } = await this.axios.get<LookupResult<Payload>>('/lookup', { params: { code } })

    return data
  }

  async redeem<Payload>(code: string) {
    const { data } = await this.axios.post<RedeemResult<Payload>>('/redeem', { code })

    return data
  }
}
