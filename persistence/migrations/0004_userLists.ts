import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("userLists", (table) => {
    table.increments("id");

    table.integer('userId')
    table.integer('listId')

    table.boolean('isOwner')

    table.foreign('userId')
      .references('id')
      .inTable('users')
    table.foreign('listId')
      .references('id')
      .inTable('lists')

    table.index('userId')
    table.index('listId')
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("userLists");
