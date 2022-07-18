# Stringity v0.0.1

A simple and convenient package for working with the string.<br>
Exported as Node.js modules.

## Installation

### Using npm|yarn:

```bash
$ npm i --save stringity
$ yarn add stringity
```

### In Node.js:

```javascript
import stringity from 'stringity';
```

### slice()

The method cuts a range of words or characters.

```javascript
const example = 'Lorem        Ipsum is simply         dummy text.'

const options = {
	trim: true, // Remove deprivation spaces. [Default]
	tags: true, // Shows the tags from which the cut occurs. [Default]
	caseSensitivity: true, // [Default]
	strict: false, // If the endpoint is longer than the string length, undefined will be returned. [Default]
	start: 'first', // The starting point of the word search, first or last. [Default]
	end: 'last', // The starting point of the word search, first or last. [Default]
	sep: '', // Separator, added to the end of the line.
}

/* Words */
stringity.slice(string, 'words', 0, 4); // Lorem Ipsum is simply
stringity.slice(string, 'words', 0, 'simply'); // Lorem Ipsum is simply
stringity.slice(string, 'words', '![10%]', '![50]%'); // Ipsum is 
stringity.slice(string, 'words', 0, '![90%]'); // Lorem Ipsum is simply dummy
stringity.slice(string, 'words', 0, '![90.99%]'); // Lorem Ipsum is simply dummy
stringity.slice(string, 'words', 'Lorem', 'simply', options); // Lorem Ipsum is simply

/* Symbols */
stringity.slice(string, 'symbols', 0, 4); // Lore
stringity.slice(string, 'symbols', 0, 's'); // Lorem Ips
stringity.slice(string, 'symbols', '![10%]', '![50%]'); // em Ipsum is si
stringity.slice(string, 'symbols', 0, '![90%]'); // Lorem Ipsum is simply dummy te
stringity.slice(string, 'symbols', 0, '![90.99%]'); // Lorem Ipsum is simply dummy te
stringity.slice(string, 'symbols', 'L', 's', options); // Lorem Ipsum is s
```

### trimFull()

The method removes extra spaces everywhere.

```javascript
stringity.trimFull('Lorem        Ipsum is simply         dummy text.'); // Lorem Ipsum is simply dummy text.
```

### getCount()

The method returns the number of words or characters of the string.

```javascript
const example = 'Lorem        Ipsum is simply         dummy text.'

const options = {
	trim: false, // Remove deprivation spaces. [Default]
}

stringity.getCount(example, 'symbols'); // 48
stringity.getCount(example, 'words'); // 21

stringity.getCount(example, 'symbols', {trim: true}); // 33
stringity.getCount(example, 'words', {trim: true}); // 6
```

### is()

The method returns the type of string, characters or words.

```javascript
stringity.is('sdhk243DWJ-212daWD-d23sdDDS'); // symbols
stringity.is('Hello world!'); // words
```

### format()

The method returns a formatted string.

```javascript
const word = 'world';

const options = {
	regex: /\${.\S*}/gm, // Standard construction. [Default]
	start: '${', // Standard construction. [Default]
	end: '}' // Standard construction. [Default]
}

/* Automatic, but not safe method */
stringity.format('Hello ${word}!'); // Hello world!

/* Replaces the value by JSON keys. */
stringity.format('Hello ${varName}!', {varName: word}); // Hello world!

/* Replaces the value by an index. */
stringity.format('Hello ${nameIgnored}!', [word]); // Hello world!
```

### toUnicode()

The method converts some characters as quotes to the unicode version.

```javascript
const example = 'Simple "String"...';

const options = {
	ellipses: true, // [Default]
	quotes: true, // [Default]
}

stringity.toUnicode(example); // Simple ”String”…
```

See the [package source](https://github.com/MineEjo/stringity) for more details.
