
export function normalizeText(value: string): string {
    return removeMultipleSpacesInRow(
        removeAccents(
            removeSpecialCharacters(value.trim())
        )
    ).toLowerCase();
}

export function normalizeTechText(value: string): string {
    return replaceNewLines(
        removeMultipleSpacesInRow(
            removeSpecialNonTechCharacters(value.trim())
        )
    , ' ');
}

export function replaceNewLines(value: string, replacement: string): string {
    return value.replace(/\n/g, replacement).replace(/\n\r/g, replacement).replace(/\r\n/g, replacement);
}

export function prepareNewLinesBreak(value: string): string {
    return value
    .replace(/\\n/g, '-LINE_FEED-')
    .replace(/\\r/g, '-CARRIAGE_RETURN-');
}

export function replaceNewLinesBreak(value: string, replacement: string): string {
    return value
    .replace(/-CARRIAGE_RETURN--LINE_FEED-/g, replacement)
    .replace(/-CARRIAGE_RETURN-/g, replacement)
    .replace(/-LINE_FEED-/g, replacement);
}
export function replaceSlash(value: string, replacement: string): string {
    return value.replace(/\\/g, replacement);
}

export function replaceSlashEscape(value: string, replacement: string): string {
    return value.replace(/\\"/g, replacement);
}

/**
 * It is necessary when converting a string with double backslash (that means one) to JSON
 * E.G: JSON.parse("Senior Advanced SAS Programmer \\ Developer (Insurance Claims Analyst)") 
 * --> Senior Advanced SAS Programmer / Developer (Insurance Claims Analyst)
 */
export function replaceBackSlashToForward(value: string): string {
    return value.replace(/\\/g, '/');
}

export function textToGuidDashBased(value: string): string {
    return normalizeText(value).replace(/ /g, "-");
}

export function removeAccents(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

export function removeSpecialCharacters(value: string): string {
    return value.replace(/[&\/\\#,+()$~%.'":*?<>{};!¨-]/g, '');
}

export function removeSpecialNonTechCharacters(value: string): string {
    return value.replace(/[&\/\\,()$~%.'":*?<>{};!¨-]/g, ' ');
}

export function removeStringEscapes(value: string): string {
    return value.replace(/["]/g, '');
}

export function convertJsonStringEscapes(value: string): string {
    return value.replace(/["]/g, '\"');
}

export function replaceWrongDash(value: string): string {
    return value.replace(/[―]/g, '&mdash;');
}


/**
 * Remove multiple spaces in sequence and replace for only one space
 */
export function removeMultipleSpacesInRow(value: string): string {
    return value.replace(/  +/g, ' ');
}

/**
 * How to add a new suffix: Add | suffix + $. For instance: "|, Ltda.$", where ", Ltda" is the suffix
 */
export function removeCorporationSuffix(value: string): string {
    return value.replace(/, Inc.®$|, Inc.$|, Inc$| Inc.$| Inc$| P.C.$|, LLC$|L.L.C.$| LLC$| B.V.$|, BV$| S.A.$|, SA$|, Ltd.$| Ltd.$| LTD.$| Ltd$| GmbH$| A.G.$|, AG$| Corp.$| CORP.$|, Corp$|, LP$| LP$| PTE.$/g, "")
}

/**
 * @param value Source
 * @returns Array of extracted emails
 */
export function extracEmails(value: string | undefined | null): string[] {
    if (value) {
        const matches = value.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi) || [];
        matches.forEach((m, i) => {
            m = m.trim();
            if (m.substring(m.length-1) === '.') {
                matches[i] = m.substring(0, m.length - 1);
            }
        });
        return matches;
    }
    return [];
}

export function validEmail(value: string): boolean {
    return extracEmails(value).length === 1;
}

export function validURL(value: string): boolean {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(value);
}

export function validMaxLength(value: string, maxLength: number): boolean {
    return value.length <= maxLength;
}

export function countOccurencesArray(value: string, subStrings: string[]): number {
    let counter = 0;
    subStrings.forEach(sbstr => counter += countOccurences(value, sbstr));
    return counter;
}

export function countOccurences(value: string, subString: string): number {
    value = value.toLowerCase() || "";
    subString = subString || "";

    let counter = 0;
    let pos = 0;
    const step = subString.length;

    while (true) {
        pos = value.indexOf(subString, pos);
        if (pos >= 0) {
            ++counter;
            pos += step;
        } else break;
    }
    return counter;
}

export function textIsEmpty(text: string | null | undefined): boolean {
    return !(text && text != null && text.trim().length > 0);
}

export function checkLatinCharacters(value: string): boolean {
    const exp = /[^\u0000-\u007f]/;
    return !exp.test(value);
}

export function retrieveWords(text: string): string[] {
    return text.trim().split(/\s+/);
}

export function countWords(text: string): number {
    return retrieveWords(text).length;
}

export function extractHost(value: string): string {
    let host = value;
    if (host.indexOf("//") > -1) {
        host = host.substring(host.indexOf("//") + 2);
    }
    if (host.indexOf('?') > -1) {
        host = host.substring(0, host.indexOf('?'));
    }
    if (host.indexOf('/') > -1) {
        host = host.substring(0, host.indexOf('/'));
    }
    host = host.replace('www.', '');
    return host;
}

export function doCapitalLetters(sentence: string | null | undefined): string | null | undefined {
    if (!textIsEmpty(sentence)) {
        // @ts-ignore
        const args = sentence.split(' ');
        args.forEach((arg, index) => {
            if (arg.length > 1) {
                args[index] = arg.substr(0,1).toUpperCase() + arg.substr(1)
            }
        });
        return args.join(' ');
    }
    return sentence;
}

export function normalizeNumericArrayIntoString(arr: string[]): string {
    return arr.map(t => parseInt(t)).sort()
        .map(t => t.toString()).join(';');
}

export function joinStr(args: string[], delimiter: string, lastDelimeter?: string): string {
    if (!lastDelimeter) {
        lastDelimeter = delimiter;
    }
    if (args && args.length > 0) {
        if (args.length > 2) {
            const term1 = args.slice(0, args.length - 1).join(delimiter);
            return [term1, args[args.length - 1]].join(lastDelimeter);
        } else {
            return args.join(lastDelimeter);
        }
    }
    return '';
}
