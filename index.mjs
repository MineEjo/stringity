/*
 * Copyright (c) 2022 MineEJo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/* Eval is optional, this function tries to fool anything from being strictly detected. */
function getValueVariable(variable) {
	return eval(variable);
}

const strings = {
	isUnReferenceStr: 'The method took an empty string argument or a reference to an empty element!',
	isUnReferenceScope: 'The method took an empty scope argument or a reference to an empty element!',
	isUnReferenceStart: 'The method took an empty start argument or a reference to an empty element!',
	isUnReferenceEnd: 'The method took an empty end argument or a reference to an empty element!',
	isUnReferenceArgs: 'The method took an empty args[] argument or a reference to an empty element!',
	isUnStringStr: 'The method accepts string of {string} type only!',
	isUnStringScope: 'The method accepts scope of {symbols|words} type only!',
	isUnObjectOptions: 'The method accepts options of {Object} type only!',
	isUnTypes: 'The method accepts start & end of {string|number} type only!',
	isInvalidRange: 'Invalid range, the value of the start cannot be greater than the end!'
};

/**
 * @namespace stringity
 * @description - Contains methods for the string.
 * @property {function} slice - The method cuts a range of words or characters.
 * @property {function} trimFull - The method removes extra spaces everywhere.
 * @property {function} getCount - The method returns the number of words or characters of the string.
 * @property {function} is - The method returns the type of string, characters or words.
 * @property {function} format - The method returns a formatted string.
 * @property {function} toUnicode - The method converts some characters as quotes to the unicode version.
 * @type {Object}
 */
export const stringity = {};

/**
 * @namespace stringity.symbols
 * @description - String characters.
 * @property {string} space - " ".
 * @property {string} void - "".
 * @type {Object}
 */
stringity.symbols = {
	space: ' ',
	void: ''
};

/**
 * @namespace stringity.slice
 * @description - The method cuts a range of words or characters.
 * @param {string} string
 * @param {"symbols"|"words"} scope - What will be cut out.
 * @param {number|string} start - The position of the word or the word itself.
 * @param {number|string} end - The position of the word or the word itself.
 * @param {Object} [options]
 * @param {boolean} [options.trim = true] - Remove deprivation spaces.
 * @param {boolean} [options.tags = true] - Shows the tags from which the cut occurs.
 * @param {boolean} [options.caseSensitivity = true]
 * @param {boolean} [options.strict = false] - If the endpoint is longer than the string length, undefined will be returned.
 * @param {string} [options.start = "first"] - The starting point of the word search, first or last.
 * @param {string} [options.end = "last"] - The starting point of the word search, first or last.
 * @param {string} [options.sep] - Separator, added to the end of the line.
 * @return {string|undefined}
 */
stringity.slice = function (string, scope, start, end, options = {}) {
	/* It checks if the arguments are empty. */
	if (!string) throw new ReferenceError(strings.isUnReferenceStr);
	if (typeof string !== 'string') throw new TypeError(strings.isUnStringStr);

	if (!scope) throw new ReferenceError(strings.isUnReferenceScope);
	if (scope !== 'symbols' && scope !== 'words') throw new TypeError(strings.isUnStringScope);

	/* It checks if the arguments are empty. */
	if (!string) throw new ReferenceError(strings.isUnReferenceStart);
	if (!end) throw new ReferenceError(strings.isUnReferenceEnd);

	let valid = false;

	/* Is an optional argument, must be a JSON object. */
	if (options && typeof options !== 'object') throw new TypeError(strings.isUnObjectOptions);

	/* It's a constant that contains the values of the options.start & options.end arguments. */
	const thisStrings = ['first', 'last'];
	const percentVariable = {
		regex: /!\[\d*.*%]/,
		start: '![',
		end: '%]'
	};

	/* Sets the default values if they are not set by the user. */
	if (!options.tags && options.tags !== false) options.tags = true; // Shows the tags from which the cut occurs.
	if (!options.trim && options.trim !== false) options.trim = true; // Remove deprivation spaces.
	if (!options.caseSensitivity && options.caseSensitivity !== false) options.caseSensitivity = true; // Remove deprivation spaces.
	if (!options.strict) options.strict = false; // If the endpoint is longer than the string length, undefined will be returned.
	if (!options.start) options.start = thisStrings[0]; // The starting point of the word search, first or last.
	if (!options.end) options.end = thisStrings[1]; // The starting point of the word search, first or last.

	let ignoreCaseWords = '';
	if (!options.caseSensitivity) ignoreCaseWords = string.toLowerCase();

	/* It's a variable that contains the separator. */
	let scopeSep = '';
	let slicedSep = ' ';

	switch (scope) {
		case 'symbols':
			scopeSep = stringity.symbols.void;
			slicedSep = '';

			if (options.sep) {
				end = end - options.sep.length;
			}
			break;
		case 'words':
			scopeSep = stringity.symbols.space;
			slicedSep = ' ';
			break;
	}

	if (options.trim) {
		string = stringity.trimFull(string);
	}

	let words = string.split(scopeSep);

	/* It removes the deprivation spaces. */
	if (options.trim) {
		string = string.replace(/^ +| +$|( ) +/mg, ' ');
	}

	if (typeof start === 'string' && start.match(percentVariable.regex)) {
		let percent = start.replace(percentVariable.start, '').replace(percentVariable.end, '');
		start = Math.round(words.length / 100 * parseInt(percent));
	}

	if (typeof end === 'string' && end.match(percentVariable.regex)) {
		let percent = end.replace(percentVariable.start, '').replace(percentVariable.end, '');
		end = Math.round(words.length / 100 * parseInt(percent));
	}

	/* Both arguments must be of type string or number. */
	if (typeof start === 'number' && typeof end === 'number') {
		/* Range Check. */
		if (start > end) throw new RangeError(strings.isInvalidRange);
		valid = true;
	} else if (typeof start === 'string' && typeof end === 'string') valid = true;
	else if (typeof start === 'string' || typeof start === 'number' && typeof end === 'string' || typeof end === 'number') {
		valid = true;
	}

	if (!valid) throw new TypeError(strings.isUnTypes);

	/*
	 * If a word is passed as an argument,
	 * it is searched in the array and then works as a number if it had been specified by the user.
	 */
	if (start && typeof start === 'string') {
		if (options.start === thisStrings[0]) {
			if (!options.caseSensitivity) start = ignoreCaseWords.indexOf(start.toLowerCase());
			else start = words.indexOf(start);
		}
		/* A unit is added to get the word searched for. */
		else if (options.start === thisStrings[1]) {
			if (!options.caseSensitivity) start = words.lastIndexOf(start.toLowerCase()) + 1;
			else start = words.lastIndexOf(start) + 1;
		}
	}

	/*
	 * If a word is passed as an argument,
	 * it is searched in the array and then works as a number if it had been specified by the user.
	 */
	if (end && typeof end === 'string') {
		if (options.end === thisStrings[0]) {
			if (!options.caseSensitivity) end = words.indexOf(end.toLowerCase());
			else end = words.indexOf(end);
		}
		/* A unit is added to get the word searched for. */
		else if (options.end === thisStrings[1]) {
			if (!options.caseSensitivity) end = words.lastIndexOf(end.toLowerCase()) + 1;
			else end = words.lastIndexOf(end) + 1;
		}
	}

	if (options.start === thisStrings[1]) {
		if (!words[start - 1]) return undefined;
	} else if (options.start === thisStrings[0]) {
		if (!words[start]) return undefined;
	}

	/* It checks if the end value is greater than the length of the string or words array. */
	if ((scope === 'symbols' && end > string.length || scope === 'words' && end > words.length) && !options.strict) {
		end = words.length;
	}

	if (options.end === thisStrings[1]) {
		if (!words[end - 1]) return undefined;
	} else if (options.end === thisStrings[0]) {
		if (!words[end]) return undefined;
	}

	/* If the user has specified a negative value, then the method returns undefined. */
	if (start < 0 || end < 0) return undefined;

	/* If the user has not specified the tags, then the tags are not cut. */
	if (!options.tags) {
		start++;
		end--;
	}

	/* It's a loop that adds words to the sliced variable. */
	let sliced = '';
	for (let index = start; index < end; index++) {
		sliced += slicedSep + words[index];
	}

	/* If the string is empty, then the method returns undefined. */
	if (sliced.length <= 0) return undefined;

	sliced = sliced.trim();

	/* If the user has specified the separator, it is added to the end of the line. */
	if (options.sep) sliced += options.sep;

	return sliced;
};

/**
 * @namespace stringity.trimFull
 * @description - The method removes extra spaces everywhere.
 * @param {string} string
 * @return {string}
 */
stringity.trimFull = function (string) {
	/* It checks if the arguments are empty. */
	if (!string) throw new ReferenceError(strings.isUnReferenceStr);
	if (typeof string !== 'string') throw new TypeError(strings.isUnStringStr);

	return string.replace(/^ +| +$|( ) +/mg, ' ');
};

/**
 * @namespace stringity.getCount
 * @description - The method returns the number of words or characters of the string.
 * @param {string} string
 * @param {"symbols"|"words"} scope - What will be cut out.
 * @param {Object} [options]
 * @param {boolean} [options.trim = true] - Remove deprivation spaces.
 * @return {number} - Number of words or characters.
 */
stringity.getCount = function (string, scope, options = {}) {
	/* It checks if the arguments are empty. */
	if (!string) throw new ReferenceError(strings.isUnReferenceStr);
	if (typeof string !== 'string') throw new TypeError(strings.isUnStringStr);

	if (!scope) throw new ReferenceError(strings.isUnReferenceScope);
	if (scope !== 'symbols' && scope !== 'words') throw new TypeError(strings.isUnStringScope);

	/* Is an optional argument, must be a JSON object. */
	if (options && typeof options !== 'object') throw new TypeError(strings.isUnObjectOptions);

	/* Sets the default values if they are not set by the user. */
	if (!options.trim) options.trim = false; // Remove deprivation spaces.

	if (options.trim) {
		string = stringity.trimFull(string);
	}

	/* It's a switch statement that checks the scope argument and returns the number of characters or words. */
	switch (scope) {
		case 'symbols':
			return string.length;
		case 'words':
			return string.split(' ').length;
	}
};

/**
 * @namespace stringity.is
 * @description - The method returns the type of string, characters or words.
 * @param {string} string
 * @return {"symbols"|"words"}
 */
stringity.is = function (string) {
	/* It checks if the arguments are empty. */
	if (!string) throw new ReferenceError(strings.isUnReferenceStr);
	if (typeof string !== 'string') throw new TypeError(strings.isUnStringStr);

	/* It's a method that checks if the string contains spaces. */
	if (!string.includes(' ')) return 'symbols';
	else return 'words';
};

/**
 * @namespace stringity.format
 * @description - The method returns a formatted string.
 * @param {string} string
 * @param {Object|array} [vars]
 * @param {{regex: RegExp, start: string, end: string}} [options]
 * @param {boolean} [options.regex = /\${.\S*}/gm] - Standard construction.
 * @param {boolean} [options.start = "${"] - Standard construction.
 * @param {boolean} [options.end = "}"] - Standard construction.
 * @return {string}
 */
stringity.format = function (string, vars, options = {}) {
	/* It checks if the arguments are empty. */
	if (!string) throw new ReferenceError(strings.isUnReferenceStr);
	if (typeof string !== 'string') throw new TypeError(strings.isUnStringStr);

	/* Is an optional argument, must be a JSON object. */
	if (options && typeof options !== 'object') throw new TypeError(strings.isUnObjectOptions);

	/* Sets the default values if they are not set by the user. */
	if (!options.regex) options.regex = /\${.\S*}/gm;
	if (!options.start) options.start = '${';
	if (!options.end) options.end = '}';

	const variables = string.match(options.regex);
	if (!variables || variables.length <= 0) return string;

	/* Automatic, but not safe method */
	if (!vars) {
		/* Replacing the variables in the string with their values. */
		for (const stringVar of variables) {
			const thisVar = stringVar.replace(options.start, '').replace(options.end, '');
			if (!thisVar) continue;
			string = string.replace(stringVar, getValueVariable(thisVar));
		}
	}

	if (vars && typeof vars === 'object' && !Array.isArray(vars)) {
		/* Replacing the variables in the string with their values. */
		for (const stringVar of variables) {
			const thisVar = stringVar.replace(options.start, '').replace(options.end, '');
			if (!thisVar) continue;

			try {
				string = string.replace(stringVar, vars[thisVar]);
			} catch (ignored) {
				// Ignored.
			}
		}
	}

	if (vars && Array.isArray(vars)) {
		/* Replacing the variables in the string with their values. */
		for (let index = 0; index < variables.length; index++) {
			let thisVar = vars[index];
			if (!thisVar) continue;

			string = string.replace(variables[index], thisVar);
		}
	}

	return string;
};

/**
 * @namespace stringity.toUnicode
 * @description - The method converts some characters as quotes to the unicode version.
 * @param {string} string
 * @param {Object} options
 * @param {boolean} [options.ellipses = true]
 * @param {boolean} [options.quotes = true]
 * @return {string}
 */
stringity.toUnicode = function (string, options = {}) {
	/* It checks if the arguments are empty. */
	if (!string) throw new ReferenceError(strings.isUnReferenceStr);
	if (typeof string !== 'string') throw new TypeError(strings.isUnStringStr);

	/* Is an optional argument, must be a JSON object. */
	if (options && typeof options !== 'object') throw new TypeError(strings.isUnObjectOptions);

	/* Sets the default values if they are not set by the user. */
	if (!options.ellipses && options.ellipses !== false) options.ellipses = true;
	if (!options.quotes && options.quotes !== false) options.quotes = true;

	if (options.ellipses) string = string.replace(/\.\.\./gm, '…');
	if (options.quotes) {
		string = string.replace(/"/gm, '”');
	}

	return string;
};
