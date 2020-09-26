/* eslint-env jest */
import request from 'supertest';
import env from 'dotenv';
env.config({
    path: '.env.tests'
});
import app from '../app.mock';
import { Company } from '../models/company.model';
import { DatabaseSQ } from '../repositories/base.repository';
import { CompanyLogin } from '../models/company.login.model';
import { ForgotPasswordRequest } from '../models/forgot-password-request.model';
import { getRecoveryPasswordToken } from '../services/auth.service';
import { Job } from '../models/job.model';
import { JobIssues } from '../models/job.issues.model';
import { OriginTypes } from '../enums/origin.enum';
import { JobIssuesEnum } from '../enums/jobs.issue.enum';
import { JobPostingSession } from '../models/job-posting-session.model';

beforeAll(async () => {
    DatabaseSQ.getSequelize();
    await Job.sync();
    await Company.sync();
    await CompanyLogin.sync();
    await ForgotPasswordRequest.sync();
    await JobIssues.sync();
    await JobPostingSession.sync();
    //create Company
    await Company.create({
        id: 1,
        guid: 'company-1',
        name: 'Company 1'
    });
    //create job
    await Job.create({
        id: 1,
        guid: '1',
        companyId: 1,
        title: 'Job 01',
        pubDate: new Date(),
        content: 'Job 01 content',
        originURI: '127.0.0.1',
        origin: OriginTypes.APP,
        mainCategoryId: 1,
        mainCategoryNormalized: 'java'
    });
});

describe('Check Index Routes', () => {

    it('Should return home page', function(done) {
        request(app)
        .get('/')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200, done);
    });

    it('Should return login page', function(done) {
        request(app)
        .get('/account')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200, done);
    });

    it('Should return forgot password page', function(done) {
        request(app)
        .get('/forgot-password')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200, done);
    });

    it('Should return contact us page', function(done) {
        request(app)
        .get('/contact-us')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200, done);
    });

    it('Should return about us page', function(done) {
        request(app)
        .get('/contact-us')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200, done);
    });

    it('Should return method not allowed for reset password page', function(done) {
        request(app)
        .get('/reset-password')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(405, done);
    });

    it('Should return reset password page', async function(done) {
        await ForgotPasswordRequest.create({
            id: 1,
            loginId: 1,
            email: 'test@remotetechjobs.com',
            recoveryExpireDate: new Date(),
            recovered: 0
        });
        const token =  getRecoveryPasswordToken({
            requestId: 1,
            email: 'test@remotetechjobs.com',
        });
        request(app)
        .get(`/reset-password?t=${token}`)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200, done);
    });

    it('Should return sign out page', function(done) {
        request(app)
        .get('/signout')
        .expect('Content-Type', 'text/plain; charset=utf-8')
        .expect(302)
        .expect('Location', '/account?signedIn=false')
        .expect('set-cookie', new RegExp('gtagSignedOut=true'))
        .end(done);
    });

    it('Should return all issue from Job 1', async function(done) {       
        //add issues
        await JobIssues.create({
            id: 1,
            jobId: 1,
            issueType: JobIssuesEnum.INCORRECT_CATEGORY,
            dateCreated: new Date(),
            remoteAddress: '::ffff:127.0.0.1'
        });
        await JobIssues.create({
            id: 2,
            jobId: 1,
            issueType: JobIssuesEnum.NOT_AVAILABLE,
            dateCreated: new Date(),
            remoteAddress: '::ffff:127.0.0.1'
        });
        await JobIssues.create({
            id: 3,
            jobId: 1,
            issueType: JobIssuesEnum.NOT_REMOTE,
            dateCreated: new Date(),
            remoteAddress: '::ffff:127.0.0.1'
        });

        request(app)
        .get('/report/issues/1')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, `["${JobIssuesEnum.INCORRECT_CATEGORY}","${JobIssuesEnum.NOT_AVAILABLE}","${JobIssuesEnum.NOT_REMOTE}"]`, done); //redirect to login
    });

    it('Should redirect to the posting', async function(done) {
        await JobPostingSession.create({
            id: '1',
            jobTitle: 'job 01',
            jobId: 1,
            postValidated: 1,
            dateCreated: new Date()
        });
        request(app)
        .get('/posting/1')
        .expect('Content-Type', 'text/plain; charset=utf-8')
        .expect(302)
        .expect('Location', '/java/1/job-01')
        .end(done);
    });

    it('Should redirect to the job page', async function(done) {
        request(app)
        .get('/wrongCategory/1') //:normalizedCategory/:jobId
        .expect('Content-Type', 'text/plain; charset=utf-8')
        .expect(302)
        .expect('Location', '/java/1/job-01')
        .end(done);
    });

});
