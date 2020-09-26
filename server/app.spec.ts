import request from 'supertest';

import env from 'dotenv';
env.config({
    path: '.env.tests'
});
import app from './app.mock';

it('Should succeed', () => {
    expect(true).toBe(true);
});

describe('Check app status', () => {

    it('Should respond ok', function(done) {
        request(app)
        .get('/health')
        //.set('Accept', 'application/json')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200, 'Application running', done);
    });

});
