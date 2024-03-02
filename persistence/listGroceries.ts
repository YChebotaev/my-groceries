import { knex } from './knex'
import { createCreateOperation, createGetOperation, createFindOperation, createDeleteOperation } from './lib'
import type { ListGrocery, ListGroceryCreateProps, ListGroceryFindProps } from './types'
import { listShortagesFind } from './listShortages'

export const listGroceryCreate = createCreateOperation<ListGroceryCreateProps>('listGroceries')

export const listGroceryGet = createGetOperation<ListGrocery>('listGroceries')

export const listGroceriesFind = createFindOperation<ListGrocery, ListGroceryFindProps>('listGroceries')

export const listGroceryDelete = createDeleteOperation('listGroceries')

export const listGroceryIsShortage = async (id: number) => {
  const shortages = await listShortagesFind({ listGroceryId: id })

  return shortages.length > 0
}

export const listGroceryRename = async (id: number, name: string) => {
  await knex('listGroceries')
    .update('name', name)
    .where('id', id)
}
