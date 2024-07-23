import config from "../app/config";
import { pool } from "./postgres";
import path from "path";

export const runPgMigrations = async () => {
    // Code to run migrations
    const Postgrator = await import("postgrator");
    const postgrator = new Postgrator.default({
        migrationPattern: path.join(__dirname, "/migrations/*"),
        driver: "pg",
        database: config.pg_info.pg_db_url,
        schemaTable: "schemaversion",
        execQuery: (query: any) => pool.query(query),
    });
    postgrator.on("migration-started", (migration: any) =>
        console.log({ Starting: migration })
    );
    postgrator.on("migration-finished", (migration: any) =>
        console.log({ Completed: migration })
    );
    await postgrator.migrate();
    const cuurentDbVersion = await postgrator.getDatabaseVersion();
    const allMigrations = await postgrator.getMigrations();
    await postgrator.runMigrations(allMigrations.slice(cuurentDbVersion));

    console.log("All migration run successfully!!!!!!! ");
}