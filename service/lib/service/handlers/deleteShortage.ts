import { listShortageDelete } from '@my-groceries/persistence'

export const deleteShortage = async (shortageId: number) => {
  await listShortageDelete(shortageId)
}
