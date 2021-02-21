/**
import env from 'dotenv';
import { DatabaseSQ } from './base.repository';

beforeAll(async () => {
    env.config({
        path: '.env.tests'
    });
    DatabaseSQ.getSequelize();
});

describe('Check database connection', () => {


});

 */