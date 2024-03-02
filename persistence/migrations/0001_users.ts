import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("users", (table) => {
    table.increments("id");

    table.string('passwordHash')
    table.string('passwordSalt')
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("users");
