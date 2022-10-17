import {Children, HTMLElementAttr, JsonValue, OneOrMany, Segment, SegmentType, SVGElementAttr} from 'types';
import {booleanToString, compact, isFunction, keys} from 'base/utils';

export const oneManyToArray = <T >(data: OneOrMany<T>): Array<T > => {
	return Array.isArray(data) ? data : [data];
};

export const createElementSVG = <K extends keyof SVGElementTagNameMap>(tagName: K, attr: SVGElementAttr): SVGElementTagNameMap[K] => {
	const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
	keys(attr).forEach(key => {
		const value = attr[key];
		if (value) {
			key === 'className' ? element.classList.add(value) : element.setAttributeNS(null, key, value);
		}
	});
	return element;
};

export const createElement = <K extends keyof HTMLElementTagNameMap>(tagName: K, attr?: HTMLElementAttr, children?: Children): HTMLElementTagNameMap[K] => {
	const element = document.createElement(tagName);

	compact(oneManyToArray(children)).forEach(child => {
		if (typeof child === 'string' || child instanceof Node) {
		// eslint-disable-next-line @typescript-eslint/unbound-method
			element && isFunction(element.appendChild) && element.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
		}
	});

	element.classList.add(...compact(oneManyToArray(attr?.className)));

	if (attr?.ariaExpanded !== undefined) {
		element.ariaExpanded = booleanToString(attr?.ariaExpanded);
	}
	if (attr?.dataType !== undefined) {
		element.dataset.type = attr.dataType;
	}

	if (typeof attr?.onClick === 'function') {
		element.addEventListener('click', attr?.onClick);
	}

	return element;
};

export function factoryElement<K extends keyof HTMLElementTagNameMap>(tagName: K, props?: HTMLElementAttr): (attr?: HTMLElementAttr, children?: Children) => HTMLElementTagNameMap[K] {
	return (attr?: HTMLElementAttr, children?: Children) => createElement(tagName, {...props, ...attr}, children);
}

export const map = <T, R>(data: T, callback: (value: T[keyof T], key: string, index: number, size: number) => R): R[] => {
	if (Array.isArray(data)) {
		return data.map((value: T[keyof T], index: number, arr) => {
			return callback(value, index.toString(), index, arr.length);
		});
	}
	if (data && typeof data === 'object') {
		return keys(data).map((key, index, arr) => {
			return callback(data[key as keyof T], key as string, index, arr.length);
		});
	}
	return [];
};

export function segmentToString<T >(value: T): string {
	switch (typeof value) {
		case 'string':
			return `"${value}"`;
		case 'undefined':
			return 'undefined';
		case 'object':
			if (value === null)
				return 'null';
			if (Array.isArray(value))
				return `Array[${value.length}] ${JSON.stringify(value)}`;
			if (value instanceof Date)
				return 'date';
			return `Object ${JSON.stringify(value)}`;
		default:
			return String(value);
	}
}

export function getSegmentType<T extends JsonValue>(value: T): SegmentType {
	switch (typeof value) {
		case 'string':
			return SegmentType.string;
		case 'number':
			return SegmentType.number;
		case 'boolean':
			return SegmentType.boolean;
		case 'object':
			return Array.isArray(value) ? SegmentType.array : SegmentType.object;
		default:
			return SegmentType.unknown;
	}
}

export function getSegmentInfo(value: JsonValue): Segment {
	const type = getSegmentType(value);
	const segment: Segment = {
		value,
		type,
		description: segmentToString(value),
		size: 0
	};
	if (type === SegmentType.array) {
		segment.size = (value as []).length;
		segment.bracket = {
			open: '[',
			close: ']'
		};
	} else if (type === SegmentType.object) {
		segment.size = keys(value).length;
		segment.bracket = {
			open: '{',
			close: '}'
		};
	}
	return segment;
}
