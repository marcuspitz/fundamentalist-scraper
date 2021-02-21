/* eslint-env jest */

import { normalizeText, normalizeTechText, textToGuidDashBased, removeStringEscapes
    , replaceWrongDash, removeCorporationSuffix, extracEmails, validURL, validMaxLength, countOccurencesArray, textIsEmpty, checkLatinCharacters, retrieveWords, countWords, extractHost, doCapitalLetters } from "./text.parsers";

describe('Test text parsers utilities', () => {

    it('Should normalize text', () => {
        expect(normalizeText(`That  iS á t~est.`)).toEqual(`that is a test`);
        expect(normalizeText(`Thât  #.iS      á t~ést.`)).toEqual(`that is a test`);
    });

    it('Should normalize tech text', () => {
        expect(normalizeTechText(`That  iS
a~test.`)).toEqual(`that is a test `);
        expect(normalizeTechText(`Thât  #.iS      á t~ést.`)).toEqual(`thât # is á t ést `);
    });

    it('Should normalized and transform a text into a guid', () => {
        expect(textToGuidDashBased('Sr. Full Stack Javascript / C# Engineer')).toEqual('sr-full-stack-javascript-c-engineer');
    });

    it('Should remove string escapes', () => {
        expect(removeStringEscapes(`"text "with" escapes"`)).toEqual('text with escapes');
    });

    it('Should replace wrong dashes for appropriate HTML dashes', () => {
        expect(replaceWrongDash(`Tech―Text―Finally`)).toEqual('Tech&mdash;Text&mdash;Finally');
    });

    it(`Should remove coporation's suffix`, () => {
        expect(removeCorporationSuffix(`Company Inc.`)).toEqual('Company');
        expect(removeCorporationSuffix(`Company, LLC`)).toEqual('Company');
        expect(removeCorporationSuffix(`Company B.V.`)).toEqual('Company');
        expect(removeCorporationSuffix(`Company S.A.`)).toEqual('Company');
        expect(removeCorporationSuffix(`Company Ltd.`)).toEqual('Company');
        expect(removeCorporationSuffix(`Company, Ltd.`)).toEqual('Company');
        expect(removeCorporationSuffix(`Company Corp.`)).toEqual('Company');
    });

    //extracEmails
    it('Should extract email adresses', () => {
        let content = `
        Please send your application documents with your salary expectation in English as a PDF to:

jobs@wbscodingschool.com

WBS Gruppe • Mr. Tim-Alexander Leuthold • CODING SCHOOL • Weiskopffstraße 16-17 • 12459 Berlin
        `;
        expect(extracEmails(content)).toEqual(['jobs@wbscodingschool.com']);

        content = `
        If you'd like to learn more or set up a no-commitment exploratory call, feel free to apply here or reach out to dylan@g2i.co. Thanks!

        Start: Immediately or as soon as possible


        Selection: Selection is ongoing


        Contact: application@nxtedition.com

        Das Passwort zu dem Link lautet: tr8srq

        Contact: application@wrongMail

        Die Lösung senden Sie bitte an hackathon@wbstraining.de.

        Contact: application@mail.com.br

        Falls Sie das Puzzle nicht lösen können, ist das kein Problem, viel wichtiger ist für uns die Herangehensweise an unsere Aufgabe.
        `;

        expect(extracEmails(content)).toEqual(['dylan@g2i.co', 'application@nxtedition.com', 'hackathon@wbstraining.de', 'application@mail.com.br']);
    });

    it('Should validate the URLs given', () => {
        expect(validURL('test.com.')).not.toBeTruthy();
        expect(validURL('https://www.wbs-gruppe.de/')).toBeTruthy();
        expect(validURL('https://dev.test.com/')).toBeTruthy();
        expect(validURL('http://dev.test.com/')).toBeTruthy();
        expect(validURL('dev.test.com/')).toBeTruthy();
        expect(validURL('test.com/')).toBeTruthy();
        expect(validURL('www.dev.test.com/')).toBeTruthy();
        expect(validURL('www.test.com/')).toBeTruthy();
    });

    it('Should validate the max length', () => {
        expect(validMaxLength('', 10)).toBeTruthy();
        expect(validMaxLength('one', 1)).not.toBeTruthy();
        expect(validMaxLength('Lorem ipsum dolor sit amet.', 10)).not.toBeTruthy();
        expect(validMaxLength('Lorem ipsum dolor sit amet.', 27)).toBeTruthy();
    });

    it('Should count occurrences in a sentence', () => {
        const sentence =
        `
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam euismod diam eu metus consequat ultricies. In scelerisque fringilla turpis in sodales. Phasellus enim augue, egestas tincidunt tellus ut, pharetra congue nunc. Ut fringilla aliquet justo id rhoncus. Vestibulum quis massa massa. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla facilisi.

Etiam non ex aliquam, eleifend est et, vulputate ipsum. Proin vel felis justo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam at auctor arcu, at vestibulum nisl. Vestibulum volutpat porttitor consectetur. Nulla dapibus molestie erat vel malesuada. Sed aliquam justo et leo molestie, cursus commodo ex condimentum. Sed quis justo accumsan, scelerisque elit at, sagittis velit. Duis tempor pulvinar urna, ut posuere velit fringilla non.
            `;
        expect(countOccurencesArray(sentence, ['est'])).toEqual(8);
        expect(countOccurencesArray(sentence, ['est', 'sed'])).toEqual(10);
        expect(countOccurencesArray(sentence, ['est', 'sed', 'at'])).toEqual(19);
    });

    it('Should check if the text is empty', () => {
        expect(textIsEmpty('')).toBeTruthy();
        expect(textIsEmpty(' ')).toBeTruthy();
        expect(textIsEmpty(null)).toBeTruthy();
        expect(textIsEmpty(undefined)).toBeTruthy();
        expect(textIsEmpty('Something')).not.toBeTruthy();
    });

    it('Should check latin characters', () => {
        expect(checkLatinCharacters('')).toBeTruthy();
        expect(checkLatinCharacters('tést')).not.toBeTruthy();
        expect(checkLatinCharacters('Should check latin characters')).toBeTruthy();
    });

    it('Should retrieve and test words', () => {
        expect(retrieveWords('Should check latin characters')).toEqual(['Should', 'check', 'latin', 'characters']);
    });

    it('Should count words', () => {
        expect(countWords('Should check latin characters')).toEqual(4);
    });

    it('Should extract host from sentences', () => {
        expect(extractHost('https://www.wbs-gruppe.de/')).toEqual('wbs-gruppe.de');
        expect(extractHost('https://dev.test.com/companies/2345/wbs-gruppe')).toEqual('dev.test.com');
    });

    it('Should transform each first letter of a word in upper case', () => {
        //one letter word wont be transformed        
        expect(doCapitalLetters('should transform Each first letter of a word in upper case')).toEqual('Should Transform Each First Letter Of a Word In Upper Case');
    });

});