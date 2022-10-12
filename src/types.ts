
export type JsonPrimitive =
    | string
    | number
    | boolean
    | null;

export type JsonValue =
    | JsonPrimitive
    | JsonValue[]
    | {[key: string]: JsonValue};

export type Json = {[key: string]: JsonValue} | JsonValue[];

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

export interface Segment {
    value: JsonValue;
    type: SegmentType;
    description: null | string;
    size: number;
}

export type Children = OneOrMany<HTMLElement | SVGElement | string | false | null>;
