
/**
 * Fast concat
 * Better than concat (this function avoid big array errors)
 * @param left array that is going to receive all elements from right array
 * @param right array that is going to be pushed inside left
 */
export function fastConcat(left: any, right: any) {
    right.forEach((element: any) => {
        left.push(element);
    });
}

export function fastNoDuplicateConcat(left: any, right: any) {
    right.forEach((element: any) => {
        if (!left.find( (a: any) => a === element)) {
            left.push(element);
        }
    });
}
