import env from 'dotenv';
import { DatabaseSQ } from './base.repository';
import { JobsAlert } from '../models/jobsalert.model';

beforeAll(async () => {
    env.config({
        path: '.env.tests'
    });
    DatabaseSQ.getSequelize();
    await JobsAlert.sync();
});

describe('Check database connection', () => {

    it('Should test if a record was persisted', async () => {
        expect(await JobsAlert.create({
            id: 1,
            email: 'test@remotetechjobs.com',
            matches: 1,
            dateCreated: new Date(2020,1,1)
        })).not.toBeNull();

        const alert = await JobsAlert.findByPk(1);
        expect(alert).toMatchObject({
            id: 1,
            email: 'test@remotetechjobs.com',
            matches: "1",
            dateCreated: new Date(2020,1,1)
        });

        const count = await JobsAlert.count();
        expect(count).toEqual(1);
    });

});