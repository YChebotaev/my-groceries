import { knex } from './knex'
import { createCreateOperation, createGetOperation, createFindOperation, createDeleteOperation } from './lib'
import type { List, ListCreateProps, ListFindProps } from './types'

export const listCreate = createCreateOperation<ListCreateProps>('lists')

export const listGet = createGetOperation<List>('lists')

export const listsFind = createFindOperation<List, ListFindProps>('lists')

export const listDelete = createDeleteOperation('lists')

export const listSetCode = async (id: number, code: string) => {
  await knex('lists')
    .update('code', code)
    .where('id', id)
}

export const listRename = async (id: number, name: string) => {
  await knex('lists')
    .update('name', name)
    .where('id', id)
}
