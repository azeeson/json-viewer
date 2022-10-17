/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-undef */

const stylelint = require('stylelint');

const {report, ruleMessages, validateOptions} = stylelint.utils;

const ruleName = 'azeeson/color-no-rgb';

const messages = ruleMessages(ruleName, {
	expected: (unfixed, fixed) => `Expected "${unfixed}" to be "${fixed}"`,
});

const REGEXP_RGB = /rgb\((\d+)[,\s](\d+)[,\s](\d+)\)/;

function rgbToHex(r, g, b) {
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function compactColor(color) {
	if (color[0] === '#' && color[1] === color[2] && color[3] === color[4] && color[5] === color[6]) {
		return `#${color[1]}${color[3]}${color[5]}`;
	}
	return color;
}

module.exports = stylelint.createPlugin(ruleName, (enabled, _, context) => {
	if (!enabled) {
		return;
	}

	return function(postcssRoot, result) {
		const validOptions = validateOptions(result, ruleName, {
			//No options for now...
		});

		if (!validOptions) {
			return;
		}

		const isAutoFixing = Boolean(context.fix);
		postcssRoot.walkDecls(decl => { //Iterate CSS declarations
			if (!REGEXP_RGB.test(decl.value)) {
				return;
			}

			const old_value = decl.value;
			const new_value	= compactColor(old_value.replace(REGEXP_RGB, (_, r, g, b) => rgbToHex(+r, +g, +b)));

			if (isAutoFixing) { //We are in “fix” mode
				if (decl.raws.value) {
					decl.raws.value.raw = new_value;
				} else {
					decl.value = new_value;
				}
			} else { //We are in “report only” mode
				report({ruleName, result, message: messages.expected(old_value, new_value), node: decl, word: old_value});
			}

		});
	};
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
