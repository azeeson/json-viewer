import {screen} from '@testing-library/dom';
// eslint-disable-next-line import/no-unresolved
import {JSONViewer} from '../';

function appendElement(TEST_ID: string, content: string) {
	const viewer = document.createElement(JSONViewer.tagName as string) as JSONViewer;
	viewer.dataset.testid = TEST_ID;
	viewer.textContent = content;
	document.body.appendChild(viewer);
}

describe('json-viewer', () => {

	it('should be registered', () => {
		expect(customElements.get(JSONViewer.tagName as string)).toBeDefined();
	});

	it('should be match object content', () => {
		const TEST_ID = 'test-object-content';

		appendElement(TEST_ID, '{"string": "this is a test ...", "integer": 42, "array": [1, 2, 3, "NaN"], "float": 3.141, "undefined": "undefined", "object": {"first-child": true, "second-child": false, "last-child": "null"}, "string_number": "1234"}');

		expect(screen.getByTestId(TEST_ID)).toBeDefined();
		expect(screen.getByTestId(TEST_ID).shadowRoot.childNodes).toMatchSnapshot();
	});

	it('should be match array content', () => {
		const TEST_ID = 'test-array-content';

		appendElement(TEST_ID, '[{"string": "this is a test ...", "integer": 42, "array": [1, 2, 3, "NaN"], "float": 3.141, "undefined": "undefined", "object": {"first-child": true, "second-child": false, "last-child": "null"}, "string_number": "1234"}, {"string": "this is a test ...", "integer": 42, "array": [1, 2, 3, "NaN"], "float": 3.141, "undefined": "undefined", "object": {"first-child": true, "second-child": false, "last-child": "null"}, "string_number": "1234"}]');

		expect(screen.getByTestId(TEST_ID)).toBeDefined();
		expect(screen.getByTestId(TEST_ID).shadowRoot.childNodes).toMatchSnapshot();
	});
});
