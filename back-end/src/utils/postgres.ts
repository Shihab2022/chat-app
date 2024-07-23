
import Pool from "pg";
import config from "../app/config";

const pool = new Pool({
    user: config.pg_info.pg_db_user,
    host: config.pg_info.pg_db_host,
    database: config.pg_info.pg_db_url,
    password: config.pg_info.pg_db_pass,
    port: config.pg_info.pg_db_port,
});


export const pgRequest = async (query: any) => {
    const response = await pool
        .query(query)
        .then((res: any) => ({ data: res?.rows[0], err: null, success: true }))
        // .then((res: any) => ({ data: res, err: null }))
        .catch((e: any) => {
            return { error: e, success: false };
        });
    return response
}

