/* eslint-env jest */

import { countDaysSince, isExpired, isExpiredDate, diffDays } from "./dates";

describe('Test date functionalities', () => {

    it('Should count days between two dates', () => {
        const from = new Date(2020, 2, 1); //Sun Mar 01 2020
        const to = new Date(2020, 3, 7); //Tue Apr 07 2020
        expect(countDaysSince(from, to)).toEqual(37); //37 days
    });

    it('Shoud check if the date is expired', () => {
        expect(isExpired(2020,1)).toBeTruthy();
        expect(isExpiredDate(new Date(2020,1,1))).toBeTruthy();
    });

    it('Should check the days between two dates', () => {
        const right = new Date(2020, 2, 1); //Sun Mar 01 2020
        const left = new Date(2020, 3, 7); //Tue Apr 07 2020
        expect(diffDays(left, right)).toEqual(37); //37 days
    });

});