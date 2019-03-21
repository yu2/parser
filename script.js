var startTime;
var cons;
var parseResultField;
var parseAreaR;
var parseAreaA;

document.addEventListener("DOMContentLoaded", function() {
  startTime = null;
  cons = document.querySelector(".console");
   
  // Tab navigation bar behaviour
  let tabNavBtn1 = document.querySelector(".tabNavBtn1");
  let tabNavBtn2 = document.querySelector(".tabNavBtn2");
  let tabNavBtn3 = document.querySelector(".tabNavBtn3");
  let tabArea1 = document.querySelector(".tabArea1");
  let tabArea2 = document.querySelector(".tabArea2");
  let tabArea3 = document.querySelector(".tabArea3");
  tabNavBtn1.addEventListener("click", function() {
    tabArea1.style.display = "flex";
    tabArea2.style.display = "none";
    tabArea3.style.display = "none";
    tabNavBtn1.style.background= "gainsboro";
    tabNavBtn2.style.background= "white";
    tabNavBtn3.style.background= "white";
  });
  tabNavBtn2.addEventListener("click", function() {
    tabArea1.style.display = "none";
    tabArea2.style.display = "flex";
    tabArea3.style.display = "none";
    tabNavBtn1.style.background= "white";
    tabNavBtn2.style.background= "gainsboro";
    tabNavBtn3.style.background= "white";
  });
  tabNavBtn3.addEventListener("click", function() {
    tabArea1.style.display = "none";
		tabArea2.style.display = "none";
    tabArea3.style.display = "flex";
    tabNavBtn1.style.background= "white";
    tabNavBtn2.style.background= "white";
    tabNavBtn3.style.background= "gainsboro";
  });

  // INPUT PARSING BEHAVIOUR
  let inputField = document.querySelector(".inputField");
	inputField.focus();

  inputField.addEventListener("input", function() {
    cLog("input registered");
		let input = inputField.value.toLowerCase();
		if (input.length >= 3) {
			if (input.length === 3) {
				modeChanger.mode = "letter";
			}
			processInput(input);
		} else
		if (inputMode.mode === "letter" && input.length < 1) {
			modeChanger.mode = "word";
		}
  });
  
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
	
  // New morpheme behaviour
  addRootButton = document.querySelector(".addRootButton");
  addAffixButton = document.querySelector(".addAffixButton");
  addRootField = document.querySelector(".addRootField");
  addAffixField = document.querySelector(".addAffixField");
});

var roots = [];
var affixes = [];
var outsideResolve;

// MODE SWITCHING PROXY
var inputMode = {mode: "word"};
var modeChanger = new Proxy (inputMode, {
	set: function (target, key, value) {
		if (value == "letter") {
			target[key] = value;
			console.log(`${key} set to ${value}`);
			//parseAreaR.style.display = "grid";
			//parseAreaA.style.display = "none";
		}
		else if (value == "word") {
			target[key] = value;
			console.log(`${key} set to ${value}`);
			//parseAreaR.style.display = "none";
			//parseAreaA.style.display = "grid";
		}
	}
});

// *****************
// Processing inputs
// *****************
var lastMatched = "";
function processInput(str) {
	searchRoots(doSubs(str));
}

var matchFits = "squirrel";
function searchRoots(str) {
	let predictions = [];
	
	if (inputMode.mode === "letter") {
	  //find roots that start with input
		for (let j = 0; j < roots.length; j++) {
			if (roots[j].startsWith(str) && predictions.length < 30) {
				predictions.push(roots[j]);
			}
		}
		
		if (predictions.length === 0) {
			if (!searchAffixes(str)) {
			  //try matching with shorter root
			  crawlBack();
			}
		} else {
			lastMatched = str;
			populateGrid(predictions);
		}

	} else
	if (inputMode.mode === "word") {
		for (let i = 0; i < roots.length; i++) {
			if (str.startsWith(roots[i]) && (str !== roots[i])) {
				lastMatched = roots[i];
				searchAffixes(str);
				if (matchFits) {
					break;
				} else {
					continue;
				}
			}
		}
	}
	
	// make this mandatory to segment roots that come with affixes?
	// !crawlBack() changes the value of lastMatched
	function crawlBack() {
    let testLastMatched = lastMatched;
    for (let i = lastMatched.length; i < lastMatched.length - 3; i--) {
      
    }
	  lastMatched = lastMatched.substring(0, lastMatched.length - 1);
	  searchAffixes(str);
      //crawlBack();
	}
}

function searchAffixes(str) {
	let affixesFound = [];
	let affixesPredicted = [];
	let affix = str.substring(lastMatched.length);
	matchAffixes(affix);

	function matchAffixes(af) {
	  //predict affixes
		for (let j = 0; j < affixes.length; j++) {
			if (affixes[j][2].startsWith(af)) {
				console.log("predicted: " + affixes[j][2]);
				affixesPredicted.push(affixes[j][2]);
			}
		}
		
		//find affixes starting with the current affix
		for (let i = 0; i < affixes.length; i++) {
		  let currentAffix = affixes[i][2];
			if (af.startsWith(currentAffix)) {
				let remainingAffix = af.substring(currentAffix.length);
				console.log(`${currentAffix} pushed`);
				affixesFound.push(currentAffix);
				if (remainingAffix.length === 0) { //if no letters remain, affixes and root have been matched perfectly
					matchFits = true;
					break;
				}
				else { //if letters remain
					console.log(`new matchAffixes() with ${remainingAffix}`);
					matchAffixes(remainingAffix);
				}
				break; //don't ask
			}
			matchFits = false;
		}
		
	}
	console.log(`affixesFound: ${affixesFound}`);
	updateParseDisplay(affixesFound);
	if (inputMode.mode === "letter") {
		populateGrid(affixesPredicted);
	}
	
	return affixesPredicted.length !== 0 ? true : false;
}

function populateGrid(members) {
	clearNode(parseAreaR);
	// Only show max 30 matches, longest first
	for (let i = 0; i < members.length; i++) {
		createChild("div", "box", members[i], parseAreaR);
	}
}

function updateParseDisplay(ar) {
	parseResultField.innerText = lastMatched + "-" + ar.join("-");
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
			for (let i = 0; i < affixes.length; i++) {
				affixes[i][2] = doSubs(affixes[i][2]);
			}
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
