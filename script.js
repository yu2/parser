var startTime;
var cons;
var parseResultField;
var parseAreaR;
var parseAreaA;
document.addEventListener("DOMContentLoaded", function() {
  startTime = null;
  cons = document.querySelector(".console");
   
  // Tab navigation bar behaviour
  let tabNav1 = document.querySelector(".tabNav1");
  let tabNav2 = document.querySelector(".tabNav2");
  let tabNav3 = document.querySelector(".tabNav3");
  let tabArea1 = document.querySelector(".tabArea1");
  let tabArea2 = document.querySelector(".tabArea2");
  let tabArea3 = document.querySelector(".tabArea3");
  tabNav1.addEventListener("click", function() {
    tabArea1.style.display = "flex";
    tabArea2.style.display = "none";
    tabArea3.style.display = "none";
    tabNav1.style.background= "gainsboro";
    tabNav2.style.background= "white";
    tabNav3.style.background= "white";
  });
  tabNav2.addEventListener("click", function() {
    tabArea1.style.display = "none";
    tabArea2.style.display = "flex";
    tabArea3.style.display = "none";
    tabNav1.style.background= "white";
    tabNav2.style.background= "gainsboro";
    tabNav3.style.background= "white";
  });
  tabNav3.addEventListener("click", function() {
    tabArea1.style.display = "none";
		tabArea2.style.display = "none";
    tabArea3.style.display = "flex";
    tabNav1.style.background= "white";
    tabNav2.style.background= "white";
    tabNav3.style.background= "gainsboro";
  });

  // INPUT PARSING BEHAVIOUR
  let inputField = document.querySelector(".inputField");
	inputField.focus();

  inputField.addEventListener("input", function() {
    cLog("input registered");
		let input = inputField.value.toLowerCase();
		if (input.length >= 3) {
			processInput(input);
		}

/*
		if (inputProcessMode.inputMode == "root") {
			parseResultField.innerText = input;
			if (input.length >= 3) {
				processRoot(input.toLowerCase());
			}
		} else if (input.length <= baseRoot.length) {
			modeChanger.inputMode = "root";
			console.log("root mode");
		} else if (inputProcessMode.inputMode == "affix") {
			let affixToProcess = input.replace(baseRoot, "");
			console.log(`affixToProcess is ${affixToProcess}`);
			processAffix(affixToProcess);
		}
*/
  });
  
  // New morpheme behaviour
	/*
  let addRootButton = document.querySelector(".addRootButton");
  let addAffixButton = document.querySelector(".addAffixButton");
  let addRootField = document.querySelector(".addRootField");
  let addAffixField = document.querySelector(".addAffixField");
	*/
  
  // Hide console behaviour
  let hideConsoleButton = document.querySelector(".hideConsoleButton");
  hideConsoleButton.addEventListener("click", function() {
    if (hideConsoleButton.value == "Hide") {
      cons.style.display = "none";
      hideConsoleButton.value = "Show";
    } else {
      cons.style.display = "block";
      hideConsoleButton.value = "Hide";
    }
  });

	parseResultField = document.querySelector(".parseResultField");

	parseAreaR = document.querySelector(".parseAreaR");
	parseAreaA = document.querySelector(".parseAreaA");
});

var roots = [];
var affixes = [];
var outsideResolve;

// MODE SWITCHING PROXY
var inputProcessMode = {inputMode: "root"};
var modeChanger = new Proxy (inputProcessMode, {
	set: function (target, key, value) {
		if (value == "root") {
			target[key] = value;
			console.log(`${key} set to ${value}`);
			parseAreaR.style.display = "grid";
			parseAreaA.style.display = "none";
		} 
		else if (value == "affix") {
			target[key] = value;
			console.log(`${key} set to ${value}`);
			parseAreaR.style.display = "none";
			parseAreaA.style.display = "grid";
		}
	}
});

// *****************
// Processing inputs
// *****************
var lastMatched = "";
var lastMatchedNoSub = "";
let strNoSub = ""; //have to use this because the affix list is not converted into IPA

function processInput(str) {
	strNoSub = str;
	str = doSubs(str);
	searchRoots(str);
}

function searchRoots(str) { 
	getPredictions(str);
}


function getPredictions(str) {
	let predictions = [];
	
	new Promise((resolve, redirect) => {
		let strPart = str.substring(0, 3);
		
		for (let i = 0; i < roots.length; i++) {
			if (str.startsWith(roots[i])) {
				if (str == roots[i]) {
					redirect(strNoSub)
				}
				predictions.push(roots[i]);
				if (predictions.length === 30) {
					break;
				}
			}
		}

		for (let j = 0; j < roots.length; j++) {
			if (str.startsWith(rootCandidates[j])) {
				lastMatched = rootCandidates[j];
				break;
			}
		}

		if (rootCandidates.length === 0) {
			redirect(strNoSub);
		} else {
			lastMatched = str;
			lastMatchedNoSub = strNoSub;
			updateParseDisplay([]);
			console.log(`last matched: ${lastMatched}`);
			resolve(predictions);
		}

	}).then((val) => {
		populateGrid(val);
		})
		.catch((val) => {
			console.log(`affix passed : ${val}`);
			searchAffixes(val);
		});
}

function searchAffixes(str) {
	let affixesFound = [];
	let affixesPredicted = [];
	let affix = str.substring(lastMatchedNoSub.length);
	matchAffixes(affix);

	function matchAffixes(af) {
		//affixesPredicted = [];
		for (let j = 0; j < affixes.length; j++) {
			if (affixes[j][2].startsWith(af)) {
				console.log("predicted: " + affixes[j][2]);
				affixesPredicted.push(affixes[j][2]);
			}
		}
		for (let i = 0; i < affixes.length; i++) {
			if (af.startsWith(affixes[i][2])) {
				var foundAffix = affixes[i][2];
				var remainingAffix = af.substring(foundAffix.length);
				console.log(`remainingAffix is ${remainingAffix}`);
				affixesFound.push(foundAffix);
				if (remainingAffix.length !== 0) {
					matchAffixes(remainingAffix);
				}
				break;
			}
			if (i == affixes.length - 1) {
				//affixesFound = ["no match found"];
			}
		}
	}
	console.log(affixesFound);
	updateParseDisplay(affixesFound);
	populateGrid(affixesPredicted);
}

function updateParseDisplay(ar) {
	parseResultField.innerText = lastMatched + "-" + ar.join("-");
}
// OLD FUNCTION
/*
function processRoot(str) {
	if (inputProcessMode.inputMode == "root") {
		str = doSubs(str);
		console.log(`processRoot() ran with mode root, root: ${str}`);
		let found = [];
		let numFound = 0;
		// Crawl through roots until 30 matches are found
		for (let i = 0; i < roots.length; i++) {
			if (roots[i].startsWith(str)) {
				found.push(roots[i]);
				if (found == str) {
					baseRoot = found;
					modeChanger.inputMode = "affix";
				}
				numFound++;
			}
			// 30 matches found before reaching end of roots
			if (numFound == 30) {
				bestMatch = found.includes(str) ? str : "";
				populateGrid(found);
				break;
			}
			// Reached end of roots and no match found
			// Entering Affix Mode
			else if (i == roots.length - 1 && numFound === 0 && str.startsWith(bestMatch)) {
				let aff = str.substring(bestMatch.length);
				modeChanger.inputMode = "affix";
				console.log("affix mode");
				baseRoot = bestMatch;
				processAffix(aff, bestMatch);
			}
			// Reached end of roots, fewer than 30 found
			else if (i == roots.length - 1) {
				bestMatch = found.includes(str) ? str : "";
				populateGrid(found);
				break;
			}
		}
	}
}

//var baseRoot = "";
var baseAffix = "";
function processAffix(str) {
	console.log("processAffix ran");
	let affixesFound = [];
	matchAffixes(str);
	let affixesPredicted= [];
	let currentAffix = str.substring(baseAffix.length);
	if (currentAffix.length !== 0) {
		for (let j = 0; j < affixes.length; j++) {
			if (affixes[j][2].startsWith(currentAffix)) {
				affixesPredicted.push(affixes[j][2]);
			}
		}
	}
	populateGrid(affixesPredicted, true);
	function matchAffixes(af) {
		console.log("matchAffixes ran");
		for (let i = 0; i < affixes.length; i++) {
			if (af.startsWith(affixes[i][2])) {
				var foundAffix = affixes[i][2];
				var remainingStr = af.substring(foundAffix.length);
				console.log(`remainingStr is ${remainingStr}`);
				affixesFound.push(foundAffix);
				if (remainingStr.length !== 0) {
					matchAffixes(remainingStr);
				}
				break;
			}
			if (i == affixes.length - 1) {
				//affixesFound = ["no match found"];
			}
		}
	}
	console.log(affixesFound);
	populateGrid(affixesFound);
	baseAffix = affixesFound.join("");
	return affixesFound[0];
}
*/

function populateGrid(members, predict = false) {
	if (inputProcessMode.inputMode == "root") {
		clearNode(parseAreaR);
		// Only show max 30 matches, longest first
		for (let i = 0; i < members.length; i++) {
			createChild("div", "box", members[i], parseAreaR);
		}
	} 
	else if(inputProcessMode.inputMode == "affix" && predict == false) {
		if (members.length >= 1) {
			parseResultField.innerText = baseRoot + "-" + members.join("-");
		}
	}
	else if (predict == true) {
		clearNode(parseAreaA);

		for (let i = 0; i < members.length; i++) {
			createChild("div", "box", members[i], parseAreaA);
		}
	}
}

function createChild(type, cl, text, mother) {
	let child = document.createElement(type);
	child.className = cl;
	child.innerText = text;
	mother.appendChild(child);
}

function clearNode(node) {
	while (node.lastChild) {
		node.removeChild(node.lastChild);
	}
}

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
    }).then(() => {
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
    let line = d.split('\r\n');
    roots = roots.concat(line);
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
  let value = ele.innerHTML;
  var blob = (value == "Download Roots")
    ? new Blob([roots.join("\r\n")], {type: 'text/csv'})
    :  new Blob([affixes.join("\r\n")], {type: 'text/csv'});
  let url = URL.createObjectURL(blob);
  ele.href = url;
  ele.download = "wordlist.txt";
}

function trimIt(ar) {
  for (let i = 0; i < roots.length; i++) {
    roots[i] = roots[i].trim();
  }
}

function uniq(ar) {
  roots = [...new Set(roots)];
}

function sortIt(ar) {
  roots = roots.sort((a, b) => b.length - a.length);
  affixes = affixes.sort((a, b) => b[2].length - a[2].length);
}

function lowerCaseIt() {
  roots = roots.map(x => x.toLowerCase());
}

function printCharCodes (str) {
  for (let i = 0; i < str.length; i++) {
    console.log(i + ": " + str.codePointAt(i));
  }
}


function cLog(str) {
  cons.innerHTML = str + "\n" + cons.innerHTML;
}

function toIPA(ar) {
  // Method 1: Convert array to string first
  (function method1() {
    trackPerformance();
    var promise = new Promise((resolve, reject) => {
      let joined = roots.join("\u0099");
      joined = doSubs(joined);
      roots = joined.split("\u0099");
      resolve();
    }).then((msg) => {
      trackPerformance();
    });
  })();
  // Method 2: Iterate through array
}

function doSubs(ar) {
  ar = ar
    .replace(/\u00F1/gu, "\u0272")
    .replace(/nk/g, "ng")
    .replace(/nt/g, "nd")
    .replace(/np/g, "nb")
    .replace(/manda/g, "manta")
    .replace(/hua/g, "wa")
    .replace(/ch/g, "\u02A7")
    .replace(/sh/g, "\u0283")
    .replace(/ll/g, "\u0292")
    .replace(/(rr|^r)/g, "@")
    .replace(/ r/g, " @")
    .replace(/ @/g, " \u0290")
    .replace(/@/g, "\u0290")
    .replace(/r/g, "\u027E")
    .replace(/ce/g, "se")
    .replace(/ci/g, "si")
    .replace(/ca/g, "ka")
    .replace(/co/g, "ko")
    .replace(/cu/g, "ku")
    .replace(/qu/g, "k")
    .replace(/hu/g, "xu")
    .replace(/gui/g, "gi")
    .replace(/j/g, "x")
    .replace(/-y-/g, "i") //none in dataset
    .replace(/y/g, "j")
    .replace(/^v/gm, "b")
    .replace(/ v/g, " b")
    .replace(/v/g, "\u03B2")
    .replace(/^z/gm, "s")
    .replace(/ z/g, " s")
    .replace(/aj/g, "ai")
    .replace(/aia/g, "aja")
    .replace(/aw/g, "au")
    .replace(/aua/g, "awa")
    .replace(/gua/g, "wa")
    .replace(/\u00ED/gu, "i")
    .replace(/\u00E9/gu, "e")
    .replace(/\u00E1/gu, "a")
    .replace(/\u00F3/gu, "o")
    .replace(/\u00FA/gu, "u");
  return ar;
}

function newMorpheme(md) {
  switch(md) {
    case "root":
      let newR = addRootField.value;
      breakWords(newR);
      cLog("Root list updated");
      break;
    case "affix":
      let newA = addAffixField.value;
      breakWords(newA);
      cLog("Affix list updated");
    }

    function breakWords(input) {
      let splitInput = [];
      switch(md) {
	case "root":
		splitInput = input.split("\n");
		roots = roots.concat(splitInput);
		break;
	case "affix":
		splitInput = input.split("\n");
		for (let i = 0; i < splitInput.length; i++) {
		affixes.push(["", "", splitInput[i]]);
		}
      }
   }
}
