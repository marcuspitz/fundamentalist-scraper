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

});