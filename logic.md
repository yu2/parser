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

First, find similarly-starting root
Determine whether root is contained within the input, or expands the input
1. If root is contained within input, search for affixes using recursive affix-matching function
	- If affixes don't match exactly, search for a different root to use as base
2. If root expands input, find up to 30 predictions
	- If no matches, go to 1
If there is a space in the input, separate by space, work on each in turn

### Type Mode
1. If the input is three letters or fewer, search through roots to find roots that begin with the input
	- These are predictions
	- Exit this mode when exact root match can no longer be found

### Long input
search through roots to find a root that the input starts with, and contains

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
