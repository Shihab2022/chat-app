import mongoose from "mongoose";
import app from "./app"
import config from "./app/config"
import { Server } from "http"
async function main() {
    try {
        await mongoose.connect(config.database_url as string);
        const port = config.port
        const server: Server = app.listen(port, () => {
            console.log(`Chat app server is running on  ${port}`)
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
        console.log('error', error);
    }
}

main();