import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("listGroceries", (table) => {
    table.increments("id")

    table.integer('listId')

    table.string('name')

    table.foreign('listId')
      .references('id')
      .inTable('lists')

    table.index('listId')
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("listGroceries");
