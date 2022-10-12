
interface InsertOptions {
    target?: DocumentFragment | HTMLElement
}

type Classes = { [key: string]: string };

interface LazyStyle {
    locals: Classes,
    use: (insertOptions?: InsertOptions) => void;
    unuse: () => void;
}

declare module '*.scss' {
	const styles: LazyStyle;
	export default styles;
}
