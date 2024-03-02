import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("lists", (table) => {
    table.increments("id");

    table.string('name')
    table.string('code')

    table.index('code')
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("lists");
