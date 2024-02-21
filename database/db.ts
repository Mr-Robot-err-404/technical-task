import 'dotenv/config'
import { DB } from 'kysely-codegen'
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

const dialect = new PostgresDialect({
    pool: new Pool({
        database: "dvdrental", 
        host: "localhost", 
        user: "postgres", 
        password: process.env.PASSWORD, 
        port: 8989
    })
})

export const db = new Kysely<DB>({
    dialect
})