/* eslint-env jest */
import request from 'supertest';
import env from 'dotenv';
env.config({
    path: '.env.tests'
});
import app from '../app.mock';
import { DatabaseSQ } from '../repositories/base.repository';

beforeAll(async () => {
    DatabaseSQ.getSequelize();
});

describe('Check Index Routes', () => {

    it('Should return home page', function(done) {
        request(app)
        .get('/')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200, done);
    });   

});
