/* eslint-env jest */
import { fastConcat, fastNoDuplicateConcat } from "./arrays";

describe('Concat arrays strategies', () => {
    it('Should concat arrays of numbers', () => {
        const arrayLeft = [
            1,2,3,4,4,5,1
        ];
        const arrayRight = [
            2,9,1
        ];
        fastConcat(arrayLeft, arrayRight)
        expect(arrayLeft).toEqual([1,2,3,4,4,5,1,2,9,1]);
    });
    
    it('Should concat arrays without repeat them', () => {
        const arrayLeft = [
            1,2,3,4,4,5,1
        ];
        const arrayRight = [
            2,9,1
        ];
        fastNoDuplicateConcat(arrayLeft, arrayRight)
        expect(arrayLeft).toEqual([1,2,3,4,4,5,1,9]);
    });
});
