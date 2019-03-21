### Logic 1
as each input event is triggered
- go through roots
	- display top 30 matches, in order of length
	- if an exact match is found
		- the user will start inputting an affix OR
		- the user will continue inputting a longer root
			- append the list of possible affixes to the list of possible roots
	- if no roots are found
		- the root does not exist in the system
		- the user has begun inputting an affix
			- isolate the affix from the last root entered and search in the affixes
			- output the possible matches

### Logic 2
search all roots and affixes whenever input is registered
- check if there is an exact match in the root list
	- if exact match exists, check if it is contained within a longer root
		- if yes, show the longer roots as predictions
	- if partial match exists, show longer roots as predictions
	- if no match, "root not found"
- if exact root match has been found
	- search for additional material in the affix list
		- recursively search until all additional material is matched

### Logic 3
First, find similarly-starting root
Determine "word" mode or "letter" mode
In "word" mode, root is contained within the input; in "letter" mode, root expands input
1. In "word" mode, match the longest root
  - Search remaining string for affixes using recursive affix-matching function
	- If affixes don't match exactly, continue with next root to use as base
2. In "letter" mode, find up to 30 predictions
	- If no predictions are found at end of crawl, start matching affixes using lastMatch as base
	  - If unable to find an affix match, try a shorter base (length >= 3)
If there is a space in the input, separate by space, work on each in turn

### Mode switching ("letter" and "word")
0: Default mode is "word"
1: If input length is 3, switch to "letter"
2: In "letter", if input field is cleared, switch to "word"
- If user is typing letter by letter, when input equals 3 letters, go to 1

### Meeting notes
gatotakuna
misikuna
misikuni is not real word
ML and muysken
gatokunatami
ya
yo
try 1
mishkishi should be mishki-shi
mishilla
solve compounds
lliki is not in dictionary
space
verbs
- not all words ending in na are verbs -- have to manually mark
ar er ir spanish to na in Quichua
if any of those endings, and -na, mark as verb
shina is not verb
anything is verbal attach to verb -- morphemes

### Promise-Aware Generator
```javascript
function foo(x, y) { //ajax caller
	ajax {
		"http://some.url.1/?x=" + x + "&y=" + y,
		function(err, data) {
			if (err) {
				it.throw(err);
			}
			if (data) {
				it.next(data);
			}
		}
	}
}
```

Simple generator
```javascript
function *main() {
	try {
		var text = yield foo(11, 31);
		console.log(text);
	}
	catch (err) {
		console.log(err);
	}
}

var it = main(); //initialize iterator

it.next(); //run iterator
```

Generator as a producer of values
```javascript
function *valueGen() {
	var nextVal;
	while (true) {
		if (nextVal === undefined) {
			nextVal = 1;
		}
		else {
			nextVal = nextVal * 3 + 6;
		}
		yield nextVal;
	}
}

// for..of loop iterates over an iterable
// gen() returns an iterator,
for (var v of valueGen()) {
	console.log(v);
	if (v >= 300) { //truncate at 300
		break;
	}
}
```
