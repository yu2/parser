document.addEventListener("DOMContentLoaded", function() {	
	timer = document.querySelector('#timeDisplay');
});

//var handler = doWork();
//handler.then(moreWork());
function moreWork() {
	const t2 = performance.now();
	updatePerformance(t1, t2);
	downloadBlob(content);
}

var content = [];
function handleLemma(files) {
	t1 = performance.now();
	var i = 0;
	var target = files.length;
	doFile(files[i]);

	//Recusive function that goes through each file in succession
	function doFile(file) {
		let reader = new FileReader();
		reader.onload = function(e) {
			let piece = e.target.result;
			var re = /\s\n/;
			pieceArray = piece.split(re);
			//Get rid of space at the end of each word
			pieceArray.forEach(function(currentValue, index, array) {
				array[index] = currentValue.trim();
			});
			content = content.concat(pieceArray);
			if (i < target - 1) {
				i++;
				doFile(files[i]);
			}
			else if (i == target - 1) {
				updatePerformance(t1)
				downloadBlob(content);
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
	console.log(content);
}

function updatePerformance(t1) {
	const t2 = performance.now();
	timer.innerHTML = t2 - t1;
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
