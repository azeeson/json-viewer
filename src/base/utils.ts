export function isObject(data: any): data is object {
	return data === Object(data);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(fn: unknown): fn is Function {
	return typeof fn === 'function';
}

export function isNotNil<T >(data: T): data is Exclude<T, null | undefined> {
	return data !== null && data !== undefined;
}

export function keys<T, K extends keyof Exclude<T, undefined> >(data: T): K[] {
	return isObject(data) ? Object.keys(data) as K[] : [];
}

export function isStringTrue(str: string | null): boolean {
	return str === 'true';
}

export function booleanToString(bool: boolean): string {
	return bool ? 'true' : 'false';
}

export function compact<T >(array: Array<T >): Array< T extends false | null | undefined ? never : T > {
	return array.filter((el) => !!el) as Array<T extends false | null | undefined ? never : T>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function cloneObject<T extends Object>(obj: T): T {
	if (obj === null || typeof obj !== 'object')
		return obj;

	// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
	const temp: T = obj.constructor();

	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			temp[key] = cloneObject(obj[key]);
		}
	}

	return temp;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function mergeObject<T extends Object>(destination: T, source: T): T {
	const cloneDestination = cloneObject(destination);
	for (const property in source) {
		const value = source[property];
		if (value === null || typeof value !== 'object') {
			cloneDestination[property] = value;
		} else {
			cloneDestination[property] = mergeObject(cloneDestination[property], value);
		}
	}
	return cloneDestination;
}
