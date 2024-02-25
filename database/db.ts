import 'dotenv/config'
import { DB } from 'kysely-codegen'
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

const dialect = new PostgresDialect({
  pool: new Pool({
    database: 'dvdrental',
    host: process.env.DB_HOST,
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    port: 5432,
  }),
})

export const db = new Kysely<DB>({
  dialect,
})
