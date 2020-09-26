
export function getContentInsideTag(tag: string, content: string): string {
    const opening = `<${tag}`;
    const closing = `</${tag}>`;
    const openingIdx = content.indexOf(opening);
    if (openingIdx > -1) {
        const start = openingIdx + opening.length;
        const result = content.substring(start, content.indexOf(closing, start));
        return result.substring(result.indexOf(">") + 1);
    }
    return '';
}

export function replaceLineBreaks(text: string, replacement: string = '') {
    return text.replace(/(\r\n|\n|\r)/gm, replacement);
}

/**
 * Copy the content inside a range/tag and so on:
 * 
 * E.g: *Content* <i style="font-size:80%">(Posted Dec 17 2019)</i>
 * 
 * *tagStarts* will be "<i style="font-size:80%">"
 * 
 * *tagEnds* will be the next one after the *tagStarts*, so: "</i>"
 * @param tagStarts what the algorithm will take a look to get the first occurence
 * @param tagEnds the next tag after *tagStarts*
 * @param content Where the content is in
 */
export function copyContent(tagStarts: string, tagEnds: string, content: string): string {
    let idxStart = content.indexOf(tagStarts);
    if (idxStart > -1) {
        idxStart += tagStarts.length;
        return content.substring(idxStart, content.indexOf(tagEnds, idxStart)).trim();
    }
    return '';
}

export function copyAllContent(tagStarts: string, tagEnds: string, content: string): string[] {
    const contents: string[] = [];
    let idxStart = content.indexOf(tagStarts);
    while (idxStart !== -1) {
        const idxEnd = content.indexOf(tagEnds, idxStart + tagStarts.length);
        contents.push(content.substring(idxStart + tagStarts.length, idxEnd));
        idxStart = content.indexOf(tagStarts, idxEnd);
    }
    return contents;
}

export function replaceSpaces(text: string, replacement: string = ' '): string {
    return text.replace(/&nbsp;/g, replacement);
}
