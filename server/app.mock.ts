import { startupConfig } from './app.config';
import express from 'express';
import { routesSetup } from './app.routes';

const app = express();

startupConfig(app);
routesSetup(app);

export default app;
