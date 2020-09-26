
export function parameterAsBoolean(param: string): boolean {
    return (process.env[param] || '0') === '1';
}

export function parameterAsString(param: string, defaultValue: string = ''): string {
    return (process.env[param] || defaultValue);
}

export function parameterAsInteger(param: string, defaultValue: number = 0): number {
    return parseInt(process.env[param] || '' + defaultValue);
}

export function parameterAsFloat(param: string, defaultValue: number = 0): number {
    return parseFloat(process.env[param] || '' + defaultValue);
}
