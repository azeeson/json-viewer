
interface JSONViewerActions {
    filter: string;
    counter: boolean;
    forceUpdate(): void;
}

declare class JSONViewer extends HTMLElement implements JSONViewerActions {
    get filter(): string;
    set filter(filter: string);
    get counter(): boolean;
    set counter(counter: boolean);

    forceUpdate(): void;
}

declare global {
    interface HTMLElementTagNameMap {
        'json-viewer': JSONViewer;
    }
}

export default JSONViewer;
export {JSONViewer};