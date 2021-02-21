import * as core from "express-serve-static-core";
import env from 'dotenv';
import { DatabaseSQ } from "./repositories/base.repository";
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import bodyParser from 'body-parser';
import express from 'express';

export function startupConfig(app: core.Express) {
    env.config();
    DatabaseSQ.getSequelize();
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public'), {
        maxAge: '1d'
    }));
    app.use(bodyParser.json() );
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(async function(req, res, next) {
        res.set('Cache-Control', `public, max-age=${process.env.HTTP_CACHE_CONTROL_TIME || '600'}`);
        next();
     });
}