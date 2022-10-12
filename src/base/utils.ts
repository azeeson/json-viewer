export function isObject(data: any): data is object {
    return data === Object(data);
}

export function isNotNil<T>(data: T): data is Exclude<T, null | undefined> {
    return data !== null && data !== undefined;
}

export function keys<T, K extends keyof Exclude<T, undefined>>(data: T): K[] {
    return isObject(data) ? Object.keys(data) as K[] : [];
}

export function isStringTrue(str: string | null): boolean {
    return str === 'true';
}

export function booleanToString(bool: boolean): string {
    return bool ? 'true' : 'false';
}

export function compact<T>(array: Array<T>): Array<T extends null | undefined | false ? never : T> {
    return array.filter((el) => !!el) as Array<T extends null | undefined | false? never : T>;
}
