import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("listShortages", (table) => {
    table.increments("id")

    table.integer('listId')
    table.integer('listGroceryId')

    table.foreign('listId')
      .references('id')
      .inTable('lists')
    table.foreign('listGroceryId')
      .references('id')
      .inTable('listGroceries')

    table.index('listId')
    table.index('listGroceryId')
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("listShortages");
