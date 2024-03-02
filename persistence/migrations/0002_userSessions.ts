import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("userSessions", (table) => {
    table.increments("id");

    table.integer('userId')
    table.string('token')
    table.boolean('revoked')

    table.foreign('userId')
      .references('id')
      .inTable('users')

    table.index('userId')
    table.index('token')
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("userSessions");
