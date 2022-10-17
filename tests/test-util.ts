export const getShadowRoot = (tagName: string): ShadowRoot => {
	return document.body.getElementsByTagName(tagName)[0].shadowRoot;
};

export function nodeListToArray<T extends Node>(nodes: NodeListOf<T>): T[] {
	return nodes ? Array.from(nodes) : [];
}

interface NodeInfo {
	name: string;
	type: number;
	value: string | null;
	children: NodeInfo[];
}

export function getNodeListInfo<T extends Node>(nodes: NodeListOf<T>): NodeInfo[] {
	return nodeListToArray(nodes).map((node) => {
		return {
			name: node.nodeName,
			type: node.nodeType,
			value: node.nodeValue,
			children: getNodeListInfo(node.childNodes)
		};
	}, []);
}

export function cleanStyleContent(nodes: NodeInfo[], style = false): NodeInfo[] {
	return nodes.map(node => {
		const {name, value, children} = node;
		return {
			...node,
			value: style && name === '#text' ? null : value,
			children: cleanStyleContent(children, name === 'STYLE')
		};

	});
}

// export function removeObjectPath<T>(obj: T, ): T {
// 	const cloneObj = cloneObject(obj);

// 	return cloneObj;
// }
