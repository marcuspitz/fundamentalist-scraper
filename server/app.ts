import { startupConfig } from './app.config';
import express from 'express';
import { routesSetup } from './app.routes';

const app = express();

const port = process.env.PORT ? +process.env.PORT : 8080;
const host = process.env.HOST || '0.0.0.0';
app.listen(port, host);

startupConfig(app);
routesSetup(app);

export default app;
