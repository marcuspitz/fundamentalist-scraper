/* eslint-env jest */

import { getContentInsideTag, replaceLineBreaks, copyContent, copyAllContent, replaceSpaces } from "./html.utilities";

describe('Test HTML utilities', () => {

    it('Should copy the tag inside a HTML content', () => {
        expect(getContentInsideTag('span', '')).toEqual('');
        expect(getContentInsideTag(`span`, `<span>Company name:</span>`)).toEqual('Company name:');
        expect(getContentInsideTag(`div`, `<div><a href="#"><span>Company name:</span></a></div>`)).toEqual('<a href="#"><span>Company name:</span></a>');
    });

    it('Should remove the line breaks', () => {
        expect(replaceLineBreaks(`
This is a text.
With line breaks
.
`, '')).toEqual('This is a text.With line breaks.');
    });

    it('Should copy a content inside a HTML TAG', () => {
        expect(copyContent(
            `<i style="font-size:80%">`
            , `</i>`
            , `<div><i style="font-size:80%">(Posted Dec 17 2019)</i></div>`)).toEqual('(Posted Dec 17 2019)');
    });

    it('Should copy a content inside all HTML TAGS that match', () => {
        expect(copyAllContent(
            `<i style="font-size:80%">`
            , `</i>`
            , `<div><i style="font-size:80%">(Posted Dec 17 2019)</i><i style="font-size:80%">(Posted Dec 17 2020)</i></div>`))
            .toEqual(['(Posted Dec 17 2019)', '(Posted Dec 17 2020)']);
    });

    it('Should replace all HTML spaces', () => {
        expect(replaceSpaces(`<span>That is&nbsp;a&nbsp;test.&nbsp;</span>`)).toEqual(`<span>That is a test. </span>`);
    })

});