import styles from 'style/style.scss';// assert {type: "css"};
import {bracket} from "consts";
import {Json, JsonValue} from "types";
import {createElementSVG, createElement, factoryElement, map,  getSegmentInfo} from "utils";
import {booleanToString, isStringTrue} from 'base/utils';

interface JSONViewerActions {
    filter: string;
    counter: boolean;
    forceUpdate(): void;
}

const template = createElement('template');
styles.use({target: template.content});


export const getTogglerIcon = () => {
    const element = createElementSVG('svg', {className: styles.locals.toggler, viewBox: '0 0 1792 1792', width: '20', height: '20'});
    element.appendChild(createElementSVG('path', {
        className: styles.locals.minus,
        d: 'M1344 800v64q0 14-9 23t-23 9h-832q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h832q14 0 23 9t9 23zm128 448v-832q0-66-47-113t-113-47h-832q-66 0-113 47t-47 113v832q0 66 47 113t113 47h832q66 0 113-47t47-113zm128-832v832q0 119-84.5 203.5t-203.5 84.5h-832q-119 0-203.5-84.5t-84.5-203.5v-832q0-119 84.5-203.5t203.5-84.5h832q119 0 203.5 84.5t84.5 203.5z'
    }));
    element.appendChild(createElementSVG('path', {
        className: styles.locals.plus,
        d: 'M1344 800v64q0 14-9 23t-23 9h-352v352q0 14-9 23t-23 9h-64q-14 0-23-9t-9-23v-352h-352q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h352v-352q0-14 9-23t23-9h64q14 0 23 9t9 23v352h352q14 0 23 9t9 23zm128 448v-832q0-66-47-113t-113-47h-832q-66 0-113 47t-47 113v832q0 66 47 113t113 47h832q66 0 113-47t47-113zm128-832v832q0 119-84.5 203.5t-203.5 84.5h-832q-119 0-203.5-84.5t-84.5-203.5v-832q0-119 84.5-203.5t203.5-84.5h832q119 0 203.5 84.5t84.5 203.5z'
    }));
    return element;
};


/**
 *
 * @cssproperty [--main-bg-color] - Main background color.
 * @cssproperty [--main-color] - Main text color.
 */
export class JSONViewer extends HTMLElement implements JSONViewerActions {

    static get observedAttributes() { return ['counter', 'filter']; }

    get filter() {
        return this.getAttribute('filter') || '';
    }

    set filter(filter: string) {
        this.setAttribute('filter', filter);
    }

    get counter() {
        const counter = this.getAttribute('counter');
        return isStringTrue(counter) || counter === "";
    }

    set counter(counter: boolean) {
        this.setAttribute('counter', booleanToString(counter));
    }

    connectedCallback(): void {
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.append(template.content.cloneNode(true));
        shadowRoot.append(this.render());
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (name === 'counter' && oldValue !== newValue) {
            this.forceUpdate();
        }
    }

    forceUpdate(): void {
        if (this.shadowRoot) {
            while (this.shadowRoot.firstChild) {
                this.shadowRoot.removeChild(this.shadowRoot.firstChild);
            }
            this.shadowRoot.append(template.content.cloneNode(true));
            this.shadowRoot.append(this.render());
        }
    }

    private line = factoryElement('div',  {className: styles.locals.line});
    private toggler = factoryElement('span',  {className: styles.locals.toggler});
    private key = factoryElement('span',  {className: styles.locals.key});
    private separator = factoryElement('span',  {className: styles.locals.separator});
    private size = factoryElement('span',  {className: styles.locals.size});
    private value = factoryElement('span',  {className: styles.locals.value});
    private segment = factoryElement('section',  {className: styles.locals.segment});
    private expanded = factoryElement('section',  {className: styles.locals.children});
    private bracket = factoryElement('span',  {className: styles.locals.bracket});

    /**
     * Handler toggle expanded.
     * @param event Event.
     */
    private handlerToggleExpanded = (event: Event) => {
        event.stopPropagation();
        const parent = (event.currentTarget as HTMLElement)?.parentElement;
        if (parent) {
            parent.ariaExpanded = booleanToString(!isStringTrue(parent.ariaExpanded));
        }
    };

    /**
     * Render a section of json.
     *
     * @param json Json.
     * @param path Key of path.
     * @param last Is the last.
     */
    private renderSegment = (json: JsonValue, path: string, last: boolean): HTMLElement => {
        const {type, value, description, size} = getSegmentInfo(json);
        const comma = !last && ",";

        if (type === 'array' || type === 'object') {
            return this.segment({ariaExpanded: true}, [
                this.line({onClick: this.handlerToggleExpanded}, [
                    getTogglerIcon(),
                    !!path && this.key({}, `"${path}"`),
                    !!path && this.separator({}, ':'),
                    this.value({dataType: type}, description ?? ''),
                    this.bracket({}, bracket[type].open) ,
                    this.counter && this.size({}, `${size || 0} items`),
                ]),
                this.expanded({dataType: type}, map(value, (value, key: string, index: number, size: number) => {
                    return this.renderSegment(value as JsonValue, key, size - 1 === index);
                })),
                this.line({onClick: this.handlerToggleExpanded}, [this.bracket({}, bracket[type].close) , comma])
            ]);
        }

        return  this.line({}, [
            this.key({}, `"${path}"`),
            this.separator({}, ':'),
            this.value({dataType: type}, description),
            comma
        ]);
    };

    private render() {
        try {
            const content = this.textContent?.trim() ?? '';
            const json = JSON.parse(content) as Json;
            return this.renderSegment(json, '', true);
        } catch (error) {
            return this.segment({}, error as string);
        }
    }
}
