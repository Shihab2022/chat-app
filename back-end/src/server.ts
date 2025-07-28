import mongoose from "mongoose";
import app from "./app"
import config from "./app/config"
import { Server } from "http"
import { appName } from "./constant";
import { runPgMigrations } from "./utils/runPgMIigrations";
import { pool } from "./utils/postgres";
async function main() {
    try {
        // await mongoose.connect(config.database_url as string);
        //!---->This function is only call when we need to create and run new migration ...<----!//
        // await runPgMigrations()
        const client = await pool.connect();
        await client.release();
        const port = config.port
        const server: Server = app.listen(port, () => {
            console.log(`${appName} server is running on  ${port}`)
        })
        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    console.info("Server closed!")
                })
            }
            process.exit(1);
        };
        process.on('uncaughtException', (error) => {
            console.log(error);
            exitHandler();
        });

        process.on('unhandledRejection', (error) => {
            console.log(error);
            exitHandler();
        })
    } catch (error) {
        console.log({ error });
    }
}

main();