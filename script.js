document.addEventListener("DOMContentLoaded", function() {
  startTime = null;
	timer = document.querySelector('#timeDisplay');
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
				downloadBlob(roots);
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
	  timer.innerHTML = performance.now() - startTime;
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

function trimIt(ar) {
  for (let i = 0; i < ar.length; i++) {
    ar[i] = ar[i].trim();
  }
  return ar;
}