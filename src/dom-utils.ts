import {isFunction} from 'base/utils';

export function removeChildren(node: Node): void {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	if (node && node.firstChild && isFunction(node.removeChild)) {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	}
}

export function nodeListToArray<T extends Node>(nodes: NodeListOf<T>): T[] {
	return Array.from(nodes);
}
