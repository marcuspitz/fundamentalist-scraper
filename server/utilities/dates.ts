type DateConstructorInput = Date | string | number;

export function countFullMonthsSince(from: Date) {
    const today = new Date();
    return (today.getUTCFullYear() * 12 + today.getUTCMonth()) -
        (from.getUTCFullYear() * 12 + from.getUTCMonth()) -
        (from.getUTCDate() > today.getUTCDate() ? 1 : 0);
}

export function countDaysSince(from: Date, reference = new Date()) {
    const timeDiff = Math.abs(reference.getTime() - from.getTime());
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.ceil(timeDiff / oneDay);
}

/**
 * Gets the string representation for today in yyyy-MM-dd format.
 * @returns {string}
 */
export function localDate() {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().substring(0, 10);
}

export function oldestTimestamp(): ISOTimestamp {
    return new Date(0).toISOString() as ISOTimestamp;
}

export type ISODate10 = string & { $brand: 'ISODate10' };
export type ISOTimestamp = string & { $brand: 'ISOTimestamp' };

/**
 * Parses and converts dates to yyyy-MM-dd format.
 *
 * @param {string} date A date in ISO or en-US short format.
 * @returns {string|null} returns the date in yyyy-MM-dd format when valid, null otherwise
 */
export function getDateISOString(date: DateConstructorInput): ISODate10 | null {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        return null;
    }
    return dateObj.toISOString().substr(0, 10) as ISODate10;
}

/**
 * Returns current time in ISO format.
 * @returns {string}
 */
export function currentTimestamp(): ISOTimestamp {
    return new Date().toISOString() as ISOTimestamp;
}

/**
 * Returns the seconds elapsed since 12:00:00 AM January 1st, 1970 UTC
 * @param {*} date
 */
export function getUnixEpoch(date: Date) {
    return Math.trunc(date.getTime() / 1000);
}

/**
 * Verifies whether a given month/year is past the current date.
 * @param {number} year
 * @param {number} month
 */
export function isExpired(year: number, month: number) {
    const today = new Date();
    if (today.getUTCFullYear() > year) {
        return true;
    }
    if (today.getUTCFullYear() === year && today.getUTCMonth() + 1 > month) {
        return true;
    }
    return false;
}

/**
 * Moves a date forward or backward a number of years
 * It also sets the time to midnight
 * @param {Date|string|number} date a date
 * @param {number} count numbers of years to add or substract
 * @returns {Date} the new date object
 */
export function addYear(date: DateConstructorInput, count = 1) {
    const newDate = new Date(date);
    newDate.setUTCFullYear(newDate.getUTCFullYear() + count);
    newDate.setUTCHours(0, 0, 0, 0);

    return newDate;
}

/**
 * Moves a date forward or backward a number of months
 * It also sets the time to midnight
 * @param {Date|string|number} date a date
 * @param {number} count numbers of months to add or substract
 * @returns {Date} the new date object
 */
export function addMonth(date: DateConstructorInput, count = 1) {
    const newDate = new Date(date);
    newDate.setUTCMonth(newDate.getUTCMonth() + count);
    newDate.setUTCHours(0, 0, 0, 0);

    return newDate;
}

/**
 * Moves a date forward or backward a number of days
 * It also sets the time to midnight
 * @param {Date|string|number} date a date
 * @param {number} count numbers of days to add or substract
 * @returns {Date} the new date object
 */
export function addDays(date: DateConstructorInput, count = 1) {
    const newDate = new Date(date);
    newDate.setUTCDate(newDate.getUTCDate() + count);
    newDate.setUTCHours(0, 0, 0, 0);

    return newDate;
}

/**
 * Moves a date forward or backward a number of minutes
 * @param {Date|string|number} date a date
 * @param {number} count numbers of minutes to add or substract
 * @returns {Date} the new date object
 */
export function addMinutes(date: DateConstructorInput, count = 0) {
    const newDate = new Date(date);
    newDate.setUTCMinutes(newDate.getUTCMinutes() + count);

    return newDate;
}

/**
 * Converts a date into a number of seconds
 * @param {Date} date the date
 */
export function toSeconds(date: Date | number) {
    if (typeof date === 'number') {
        return date;
    }
    return Math.trunc(date.getTime() / 1000);
}

export function formatMTTime(date: ISOTimestamp) {
    const d = new Date(date);
    return d.toLocaleString('en-US', { timeZone: 'America/Denver' });
}

export function formatMTTimeShort(date: ISOTimestamp) {
    const d = new Date(date);
    return d.toLocaleString('en-US', { timeZone: 'America/Denver' }).split(',')[0];
}

export function diffDays(dateLeft: Date, dateRight: Date): number {
    const days = (new Date(dateLeft.getUTCFullYear(), dateLeft.getUTCMonth()
    , dateLeft.getUTCDate()).getTime() - new Date(dateRight.getUTCFullYear(), dateRight.getUTCMonth()
    , dateRight.getUTCDate()).getTime()) / (1000 * 3600 * 24);
    return Math.floor(days);
}

export function isExpiredDate(date: Date | undefined) {
    if (date) {
        const today = new Date();    
        return diffDays(today, date) > 0;
    }
    return true;
}

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
export function getMonthName(date: Date): string {
    return monthNames[date.getMonth()];
}

export function getOrdinalDate(date: Date): string {
    const day = date.getDate();
    let suffix = '';
    if (day > 3 && day < 21) 
        suffix = 'th';
    switch (day % 10) {
        case 1:  
            suffix = "st";
        break;
        case 2:  
            suffix = "nd";
        break;
        case 3:  
            suffix = "rd";
        break;
        default: 
            suffix = "th";
    }
    return `${day}${suffix}`;
}
