import {JSONViewer} from 'viewer';

declare global {
    interface HTMLElementTagNameMap {
        'json-viewer': JSONViewer;
    }
}

customElements.define('json-viewer', JSONViewer);
