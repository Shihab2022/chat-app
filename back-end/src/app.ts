import express, { json } from 'express';
import cors from 'cors';
// import cookieParser from 'cookie-parser'
import { rootRouter } from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandllers';
import { notFound, testingRoute } from './constant/route';
import { corsAllowOrigin } from './constant';
import { app, server } from './utils/socket';
import config from './app/config';
import { connectDB } from './utils/db';
import { runMigrations } from './utils/migrate';

app.use(json());
app.use(cors(corsAllowOrigin));
// app.use(cookieParser())
app.get('/', testingRoute);
app.use('/', rootRouter);
app.use(globalErrorHandler);
app.use(notFound);

async function startServer() {
  //  Run migrations first
  // await runMigrations();

  server.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
  });
}

startServer();

// server.listen(config.port, () => {
//   console.log(`App listening on port ${config.port}`);
//   connectDB();
// });
// export default app;
