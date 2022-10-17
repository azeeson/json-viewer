import {createElement} from 'utils';
import styles from 'style/style.scss';// assert {type: "css"};

const template = createElement('template');
styles.use({target: template.content});

export const css = styles.locals;
export function getStyleNode(): Node {
	return template.content.cloneNode(true);
}

