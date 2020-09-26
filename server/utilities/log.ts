
export function infoLog(value: string) {
    console.log(value);
}

export function errorLog(msg: string, err: any) {
    console.error(
        `Error message: ${msg}
Object error: ${err}`);
}

export function debugErrorLog(msg: string) {
    console.error(`Error message: ${msg}`);
}
