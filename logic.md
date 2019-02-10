###Logic 1
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

###Logic 2
search all roots and affixes whenever input is registered 
- check if there is an exact match in the root list
	- if exact match exists, check if it is contained within a longer root
		- if yes, show the longer roots as predictions
	- if partial match exists, show longer roots as predictions
	- if no match, "root not found"
- if exact root match has been found
	- search for additional material in the affix list
		- recursively search until all additional material is matched

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