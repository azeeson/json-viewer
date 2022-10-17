import {JSONViewer} from 'viewer';

declare global {
	interface HTMLElementTagNameMap {
		'json-viewer': JSONViewer;
	}
}

if (customElements && !customElements.get('json-viewer')) {
	customElements.define('json-viewer', JSONViewer);
}

export default JSONViewer;
export {JSONViewer};
