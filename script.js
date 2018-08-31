document.addEventListener("DOMContentLoaded", function() {
  startTime = null;
	var inputField = document.querySelector(".inputField");
	inputField.addEventListener("input", function(e) {
	  cLog("input registered");
	  let input = inputField.innerHTML;
	  if (input.length >= 3) {
	    processInput(input);
	  }
	});
});

var roots = [];
var affixes = [];
var outsideResolve;

function handleFiles(files, mode) {
  trackPerformance();
  var pusher = pPush();
  if (mode == 'roots') {
    pusher = pusher.pRoots;
  } else if (mode == 'affixes') {
    pusher = pusher.pAffixes;
  }
	var i = 0;
	var numFiles = files.length;
	doFile(files[i]);

	//Recusive function that goes through each file in succession
	function doFile(file) {
	  var promise = new Promise((resolve, reject) => {
	    outsideResolve = resolve;
  		let reader = new FileReader();
  		reader.onload = function(e) {
  			let doc = e.target.result;
  			pusher(doc);
  		};
  		reader.readAsText(file);
	  }).then((msg) => {
			if (i < numFiles - 1) {
				i++;
				doFile(files[i]);
			}
			else if (i == numFiles - 1) {
			  trackPerformance();
				//downloadBlob(roots);
			}
	  });
	}
	
}

function downloadBlob(data) {
	let blob = new Blob([data], {type: 'text/csv'});
	let url = URL.createObjectURL(blob);
	let elem = window.document.createElement('a');
	elem.href = url;
	elem.download = 'roots.txt';
	elem.innerHTML = "Download";
	document.body.appendChild(elem);
	console.log(roots);
}

function trackPerformance() {
	if (!startTime) {
	  startTime = performance.now();
	}
	else {
	  let perf = performance.now() - startTime;
	  cLog("Performance: " + perf + "ms");
		startTime = null;
	}
}

function pPush(m) {
  var target;
  function setTarget(target) {
    target = m;
  }
  function pushRoots(d) {
		let line = d.split('\n');
    roots = roots.concat(line);
    //roots = trimIt(roots);
    outsideResolve();
  }
  function pushAffixes(d) {
		let line = d.split('\n');
		for (let i = 0; i < line.length; i++) {
			let lineSplit = line[i].split('\t');
			affixes.push(lineSplit);
		}
		outsideResolve();
  }
  var api = {
    set: setTarget,
    pRoots: pushRoots,
    pAffixes: pushAffixes
  };
  return api;
}

function downloadList(ele) {
	console.log(ele.href);
	let value = ele.innerHTML;
	var blob = (value == "Download Roots")
	  ? new Blob([roots], {type: 'text/csv'})
	  :	new Blob([affixes], {type: 'text/csv'});
	let url = URL.createObjectURL(blob);
	ele.href = url;
	ele.download = "wordlist.txt";
}

function trimIt(ar) {
  /*
  for (let i = 0; i < ar.length; i++) {
    ar[i] = ar[i].trim();
  }
  return ar;
  */
  for (let i = 0; i < roots.length; i++) {
    roots[i] = roots[i].trim();
  }
}

function uniq(ar) {
  //return [...new Set(ar)];
  roots = [...new Set(roots)];
}

function sortIt(ar) {
  roots = roots.sort((a, b) => b.length - a.length);
}

function lowerCaseIt() {
  roots = roots.map(x => x.toLowerCase());
}

function printCharCodes (str) {
  for (let i = 0; i < str.length; i++) {
    console.log(i + ": " + str.codePointAt(i));
  }
}

function processInput(str) {
  
}

function cLog(str) {
  var console = document.querySelector(".console");
  let oldText = console.innerHTML;
  console.innerHTML = str + "\n" + oldText;
}