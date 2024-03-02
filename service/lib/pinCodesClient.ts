import { createClient } from "./pin-codes";

export const pinCodesClient = createClient(
  process.env['PINCODES_URL']!,
  process.env['PINCODES_TOKEN']!
)
