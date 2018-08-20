document.addEventListener("DOMContentLoaded", function() {
  startTime = null;
	timer = document.querySelector('#timeDisplay');
	rowField = document.querySelector('#rowField');
});

var roots = [];
var affixes = [];

function handleFiles(files, mode) {
  trackPerformance();
	var numRows = rowField.innerText;
	var i = 0;
	var target = files.length;
	doFile(files[i]);

	//Recusive function that goes through each file in succession
	function doFile(file) {
		let reader = new FileReader();
		reader.onload = function(e) {
			let doc = e.target.result;
			//var re = /\s\n/;
			var line = doc.split('\n');
			//Get rid of space at the end of each word
			for (let i = 0; i < line.length; i++) {
				roots.push(line[i].split('\t').trim());
			}
			line.forEach(function(currentValue, index, array) {
				array[index] = currentValue.trim();
			});
			roots = roots.concat(line);
			if (i < target - 1) {
				i++;
				doFile(files[i]);
			}
			else if (i == target - 1) {
			  trackPerformance();
				downloadBlob(roots);
			}
		};
		reader.readAsText(file);
	}

}

function downloadBlob(data) {
	let blob = new Blob([data], {type: 'text/csv'});
	let url = URL.createObjectURL(blob);
	let elem = window.document.createElement('a');
	elem.href = url;
	elem.download = 'lemma.txt';
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
	}
}


/* Doesn't work because function finishes before loops (reading files takes too long)
function handleFiles(files) {
	t1 = performance.now();
	for (let i = 0; i < files.length; i++) {
		(function(file) {
			let reader = new FileReader();

			//set up handler for reading completion
			reader.onload = function(e) {
				let piece = e.target.result;
				content = content.concat(piece.split('\n'));
				if (i == files.length - 1) {
					moreWork();
				}
			};

			reader.readAsText(file);
		 })(files[i]);
	}
}
*/
//handler.then(downloadBlob(content));
