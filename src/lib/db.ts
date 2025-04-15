import {Pool} from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Supabase and most cloud Postgres
    },
}

)

export default pool
