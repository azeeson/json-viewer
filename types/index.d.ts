
interface JSONViewerActions {
    filter: string;
    counter: boolean;
    forceUpdate(): void;
}

type TagName <T extends string> = T;

declare class JSONViewer extends HTMLElement implements JSONViewerActions {
	static tagName: TagName<'json-viewer'>;

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
