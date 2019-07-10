var startTime;
var cons;
var parseResultField;
var parseAreaR;
var parseAreaA;

document.addEventListener("DOMContentLoaded", function() {
  startTime = null;
  cons = document.querySelector(".console");
   
  // Tab navigation bar behaviour
	let tabBar = document.querySelector(".tabBar");
	let mainContainer = document.getElementsByClassName("mainContainer")[0];
  let tabNavBtn1 = document.querySelector(".tabNavBtn1");
  let tabNavBtn2 = document.querySelector(".tabNavBtn2");
  let tabNavBtn3 = document.querySelector(".tabNavBtn3");
  let tabNavBtn4 = document.querySelector(".tabNavBtn4");
  let tabArea1 = document.querySelector(".tabArea1");
  let tabArea2 = document.querySelector(".tabArea2");
  let tabArea3 = document.querySelector(".tabArea3");
	tabArea4 = document.getElementsByClassName("tabArea4")[0];
  let inputField = document.querySelector(".inputField");
	parseResultField = document.querySelector(".parseResultField");
	parseAreaR = document.querySelector(".parseAreaR");
	parseAreaA = document.querySelector(".parseAreaA");
	dictSearchResults = document.getElementsByClassName("dictSearchResults")[0];
	dictSearchField = document.getElementsByClassName("dictSearchField")[0];
	let statsBtn = document.getElementsByClassName("statsBtn")[0];
	statsArea = document.getElementsByClassName("statsArea")[0];

  tabNavBtn1.addEventListener("click", function() {
		switchTabs(1);
		inputField.focus();
  });
  tabNavBtn2.addEventListener("click", function() {
		switchTabs(2);
  });
  tabNavBtn3.addEventListener("click", function() {
		switchTabs(3);
  });
	tabNavBtn4.addEventListener("click", function() {
		switchTabs(4);
		dictSearchField.focus();
	});

	let tabNavBtns = tabBar.getElementsByClassName("tabNavBtn");
	let tabAreas = mainContainer.getElementsByClassName("tabArea");

	function switchTabs(target) {
		for (let i = 0; i < tabNavBtns.length; i++) {
			let found = false;
			let classNames = tabNavBtns[i].className.split(" ");
			for (let j = 0; j < classNames.length; j++) {
				if (classNames[j] == "tabNavBtn" + target) {
					found = true;
					break;
				}
			}
			tabBar.getElementsByClassName(classNames[0])[i].style.background = found ? "gainsboro" : "white";
			let ip = i + 1;
			mainContainer.getElementsByClassName("tabArea" + ip)[0].style.display= found ? "flex" : "none";
		}
	}
	
  // INPUT PARSING BEHAVIOUR
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
			clearNode(parseAreaR);
			parseResultField.innerText = "";
		}
  });

  
  // Hide console behaviour
  let hideConsoleButton = document.querySelector(".hideConsoleBtn");
  hideConsoleButton.addEventListener("click", function() {
    if (hideConsoleButton.innerText == "Hide") {
      cons.style.display = "none";
      hideConsoleButton.innerText= "Show";
    } else {
      cons.style.display = "block";
      hideConsoleButton.innerText= "Hide";
    }
  });

  // New morpheme behaviour
  addRootButton = document.querySelector(".addRootButton");
  addAffixButton = document.querySelector(".addAffixButton");
  addRootField = document.querySelector(".addRootField");
  addAffixField = document.querySelector(".addAffixField");

	// Dictionary lookup behaviour
	dictSearchField.addEventListener("keydown", function(e) {
		var key = e.keycode ? e.keycode : e.which;
		if (key == 13) {
			dictSearch(dictSearchField.value.toLowerCase());
		}
	});

	// Stats window behaviour
	statsBtn.addEventListener("click", function() {
		console.log(statsArea.style);
		if (statsArea.style.display == "" | statsArea.style.display == "none") {
			statsArea.style.display = "flex";
			console.log(statsArea.style.display);
			populateStats();
		} else if (statsArea.style.display == "flex") {
			statsArea.style.display = "none";
		}
	});
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
		  searchAffixes(str);
		  /*
			if (!searchAffixes(str)) {
			  //try matching with shorter root
			  crawlBack();
			}
			*/
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
				// try next root if affixes are not matched
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
	}
}

var completedMatches = [];
var matchCount = 0;

function searchAffixes(str) {
	let affixesFound = [];
	let affixesPredicted = [];
	let affix = str.substring(lastMatched.length);
	matchAffixes(affix);
  
  var matchTree = [];
  
	function matchAffixes(af) {
	  //predict affixes
		for (let j = 0; j < affixes.length; j++) {
			if (affixes[j][2].startsWith(af)) {
				console.log("predicted: " + affixes[j][2]);
				affixesPredicted.push(affixes[j][2]);
				//matchTree.push(affixesPredicted);
			}
		}
		
		//find affixes starting with the current affix
		for (let i = 0; i < affixes.length; i++) {
			if (af.startsWith(affixes[i][2])) {
				let remainingAffix = af.substring(affixes[i][2].length);
				affixesFound.push(affixes[i][2]);
				if (remainingAffix.length === 0) { //if no letters remain, affixes and root have been matched perfectly
					matchFits = true;
					break;
				}
				else { //if letters remain
					matchAffixes(remainingAffix);
				}
				break; //don't ask
			}
			matchFits = false;
		}
		
	}
	console.log(`matchFits: ${matchFits}`)
	if (!matchFits) {
	  //matchAffixes(affix);
	}
	console.log(`affixesFound: ${affixesFound}`);
	completedMatches[matchCount] = lastMatched + "-" + affixesFound.join("-");
	updateParseDisplay(affixesFound);
	if (inputMode.mode === "letter") {
		populateGrid(affixesPredicted);
	}
	
	return affixesPredicted.length !== 0 ? true : false;
}

function populateGrid(members, target = parseAreaR) {
	clearNode(target);
	// Only show max 30 matches, longest first
	for (let i = 0; i < members.length; i++) {
		createChild("div", "box", members[i], target);
	}
}

function updateParseDisplay(ar) {
  for (let i = 0; i < completedMatches.length; i++) {
    parseResultField.innerText = completedMatches[i] + " ";
  }
}

function createChild(type, class_name, content, mother) {
	let child = document.createElement(type);
	child.className = class_name;
	child.innerHTML = content;
	mother.appendChild(child);
	return child;
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

function downloadDict(content, fileName, contentType) {
	var a = document.createElement("a");
	var file = new Blob([JSON.stringify(content)], {type: contentType});
	a.href = URL.createObjectURL(file);
	a.download = fileName;
	a.click();
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

function lowerCaseDict() {
	for (let i = 0; i < Dictionary.length; i++) {
		Dictionary[i].head = Dictionary[i].head.toLowerCase();
	}
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

function dictSearch(word) {
	clearNode(dictSearchResults);
	word = diacriticize(word);
	word = new RegExp("^" + word + "$");
	let found = Dictionary.filter(e => word.test(e.head));
	for (let j = 0; j < found.length; j++) {
		let show = [];
		for (let i = 0; i < found[j].links.length; i++) {
			show[i] = `${found[j].links[i][0]}`;  
		}
		let searchHeader = createChild("div", "tabAreaHeader dictSearchHeader dictSearchHeader" + j, "", dictSearchResults);
		searchHeader.innerHTML = `<span class="dictSearchNum">${j+1}.</span> ${found[j].head} <span class="dictSearchDesc">(${found[j].origin})</span>`;
		let gridDisplay = createChild("div", "gridDisplay dictGridDisplay dictGridDisplay" + j, "", dictSearchResults);
		populateGrid(show, gridDisplay);
	}

	function diacriticize(str) {
		return str.replace("a", "[aá]")
							.replace("e", "[eé]")
							.replace("i", "[ií]")
							.replace("o", "[oó]")
							.replace("u", "[uúü]")
							.replace("n", "[nñ]");
	}
}

function populateStats() {
/*	
	for (let k = 0; k < Dictionary.length; k++) {
		Dictionary[k].verbal = false;
	}
*/
	Stats = {
		SPLemmas: 0,
		QLemmas: 0,
		Links: 0
	}
	let re = /.*(ar|ir|er)$/;
	let verbals = [];
	let verbalRE = /.*na$/;
	let counter = 0;
	let counter2 = 0;
	let linkLength = 0;
	let noQVerb = 0;
	let noQVerbList = [];
	let nonV = 0;
	let nonVLinks = [];
	for (let i = 0; i < Dictionary.length; i++) {
		if (re.test(Dictionary[i].head)) {
			counter++;
			linkLength = linkLength + Dictionary[i].links.length;
			let linkMatches = 0;
			for (let j = 0; j < Dictionary[i].links.length; j++) {
				if (verbalRE.test(Dictionary[i].links[j][0])) {
					counter2++;
					linkMatches++;
					verbals.push(Dictionary[i].links[j]);
				}
			}
			if (linkMatches === 0) {
				noQVerb++;
				noQVerbList.push(Dictionary[i].head);
				nonV = nonV + Dictionary[i].links.length;
				for (let l = 0; l < Dictionary[i].links.length; l++) {
					nonVLinks.push(Dictionary[i].links[l][0]);
				}
			}
		}
	}

	//Object.keys(Stats).length;
	statsArea.innerText += (`SP lemmas: ${counter}`);
	statsArea.innerText += (`Q lemmas: ${counter2}`);

	console.log(`total number of links: ${linkLength}`);
	console.log(`SP words with no verbal Q link: ${noQVerb}`);
	console.log(noQVerbList);
	console.log(`Q words linked by non-verbal SP words: ${nonV}`);
	console.log(nonVLinks);
	//console.log(verbals);
}
