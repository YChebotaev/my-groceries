import { createCreateOperation, createGetOperation, createFindOperation, createDeleteOperation } from './lib'
import type { ListShortage, ListShortageCreateProps, ListShortageFindProps } from './types'

export const listShortageCreate = createCreateOperation<ListShortageCreateProps>('listShortages')

export const listShortageGet = createGetOperation<ListShortage>('listShortages')

export const listShortagesFind = createFindOperation<ListShortage, ListShortageFindProps>('listShortages')

export const listShortageDelete = createDeleteOperation('listShortages')
