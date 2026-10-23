import express, { json } from 'express';
import cors from 'cors';
// import cookieParser from 'cookie-parser'
import { rootRouter } from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandllers';
import { notFound, testingRoute } from './constant/route';
import { corsAllowOrigin } from './constant';
import { app, server } from './utils/socket';
import config from './app/config';
import { runMigrations } from './utils/migrate';

app.use(json());
app.use(cors(corsAllowOrigin));
// app.use(cookieParser())
app.get('/', testingRoute);
app.use('/', rootRouter);
app.use(globalErrorHandler);
app.use(notFound);

async function startServer() {
  try {
    // if (process.env.NODE_ENV !== 'production') {
    //   // await runMigrations();
    // }
    const port = Number(config.port) || 5000;
    server.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exitCode = 1;
  }
}

startServer();

export default app;
