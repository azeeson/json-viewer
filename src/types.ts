
export type JsonPrimitive =
    boolean | number | string | null;

export type JsonValue =
    | JsonPrimitive
    | JsonValue[]
    | {[key: string]: JsonValue};

export type Json = JsonValue[] | {[key: string]: JsonValue};

export type OneOrMany<T> = T | T[];

export interface HTMLElementAttr {
	className?: OneOrMany<string | false>;
	ariaExpanded?: boolean;
	dataType?: string;
	onClick?: (event: Event) => void;
}

export interface SVGElementAttr {
	className?: string;
	viewBox?: string;
	width?: string;
	height?: string;
	d?: string;
}

export enum SegmentType {
	object = 'object',
	array = 'array',
	string = 'string',
	number = 'number',
	boolean = 'boolean',
	unknown = 'unknown',
}

interface Bracket {
	open: string;
	close: string;
}

export interface Segment {
	value: JsonValue;
	type: SegmentType;
	description: string | null;
	size: number;
	bracket?: Bracket;
}

export type Children = OneOrMany<HTMLElement | SVGElement | string | false | null>;
