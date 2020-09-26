import { parameterAsInteger, parameterAsBoolean, parameterAsFloat, parameterAsString } from "./parameters";
import env from 'dotenv';

beforeAll(() => {
    env.config({
        path: '.env.tests'
    });
});

describe('Parameter functionalities', () => {

    it('Should test the integer parameters', () => {
        const value = parameterAsInteger('POOL_MAX', 0);
        expect(value).toEqual(10);
    });

    it('Should test the boolean parameters', () => {
        const value = parameterAsBoolean('CATEGORY_SCORE_ENABLED');
        expect(value).toBeTruthy();
    });

    it('Should test the decimal/float parameters', () => {
        const value = parameterAsFloat('MINIMUM_SCORE', 0);
        expect(value).toEqual(2);
    });

    it('Should test the string parameters', () => {
        const value = parameterAsString('RTJ_SUPPORT_EMAIL', '');
        expect(value).toEqual('Remote Tech Jobs Support Team <support@remotetechjobs.com>');
    });

});