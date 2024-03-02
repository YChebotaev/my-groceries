import { listGroceriesFind } from '@my-groceries/persistence'
import { getGrocery } from './getGrocery'

export const getListGroceries = async (listId: number) => {
  const groceries = await listGroceriesFind({ listId })

  return Promise.all(
    groceries.map(grocery => getGrocery(listId, grocery.id))
  )
}
