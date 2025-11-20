import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('wb_tariffs', (table) => {
    table.increments('id').primary();
    table.date('date').notNullable();
    table.integer('nm_id');
    table.decimal('price', 10, 2);
    table.decimal('discount', 5, 2);
    table.decimal('final_price', 10, 2);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.unique(['date', 'nm_id']);
    table.index(['date']);
    table.index(['nm_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('wb_tariffs');
}