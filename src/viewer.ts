import {Json, JsonValue} from 'types';
import {booleanToString, isStringTrue} from 'base/utils';
import {factoryElement, getSegmentInfo, map} from 'utils';
import {getStyleNode} from 'style';
import {getTogglerIcon} from 'icon';
import {removeChildren} from 'dom-utils';
import styles from 'style/style.scss';// assert {type: 'css'};

interface JSONViewerActions {
	filter: string;
	counter: boolean;
	forceUpdate(): void;
}

/**
 *
 * @cssproperty [--main-bg-color] - Main background color.
 * @cssproperty [--main-color] - Main text color.
 */
export class JSONViewer extends HTMLElement implements JSONViewerActions {
	static get tagName() {
		return 'json-viewer';
	}

	static get observedAttributes() {
		return ['counter', 'filter'];
	}

	get filter() {
		return this.getAttribute('filter') || '';
	}

	set filter(filter: string) {
		this.setAttribute('filter', filter);
	}

	get counter() {
		const counter = this.getAttribute('counter');
		return isStringTrue(counter) || counter === '';
	}

	set counter(counter: boolean) {
		this.setAttribute('counter', booleanToString(counter));
	}

	connectedCallback(): void {
		const shadowRoot = this.shadowRoot ?? this.attachShadow({mode: 'open'});
		this.internalUpdate(shadowRoot);
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		if (name === 'counter' && oldValue !== newValue) {
			this.forceUpdate();
		}
	}

	private internalUpdate(root: ShadowRoot) {
		if (root) {
			removeChildren(root);
			root.append(getStyleNode(), this.render());
		}
	}

	forceUpdate(): void {
		this.internalUpdate(this.shadowRoot);
	}

	private line = factoryElement('div', {className: styles.locals.line});

	private key = factoryElement('span', {className: styles.locals.key});

	private separator = factoryElement('span', {className: styles.locals.separator});

	private size = factoryElement('span', {className: styles.locals.size});

	private value = factoryElement('span', {className: styles.locals.value});

	private segment = factoryElement('section', {className: styles.locals.segment});

	private expanded = factoryElement('section', {className: styles.locals.children});

	private bracket = factoryElement('span', {className: styles.locals.bracket});

	/**
     * Handler toggle expanded.
     * @param {Event} event Event.
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
     * @param {JsonValue} json Json.
     * @param {string} path Key of path.
     * @param {boolean} last Is the last.
	 *
	 * @return {HTMLElement} ...
     */
	private renderSegment = (json: JsonValue, path: string, last: boolean): HTMLElement => {
		const {type, value, description, bracket, size} = getSegmentInfo(json);
		const comma = !last && ',';

		if (type === 'array' || type === 'object') {
			return this.segment({ariaExpanded: true}, [
				this.line({onClick: this.handlerToggleExpanded}, [
					getTogglerIcon(),
					!!path && this.key({}, `"${path}"`),
					!!path && this.separator({}, ':'),
					this.value({dataType: type}, description ?? ''),
					this.bracket({}, bracket.open),
					this.counter && this.size({}, `${size || 0} items`)
				]),
				this.expanded({dataType: type}, map(value, (value, key: string, index: number, size: number) => {
					return this.renderSegment(value as JsonValue, key, size - 1 === index);
				})),
				this.line({onClick: this.handlerToggleExpanded}, [this.bracket({}, bracket.close), comma])
			]);
		}

		return this.line({}, [
			this.key({}, `"${path}"`),
			this.separator({}, ':'),
			this.value({dataType: type}, description),
			comma
		]);
	};

	/**
	 * @returns Sds.
	 */
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
