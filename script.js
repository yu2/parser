document.addEventListener("DOMContentLoaded", function() {
  startTime = null;
  cons = document.querySelector(".console");
  boxParent = document.querySelector(".boxMother");
   
  // Tab navigation bar behaviour
  let tabNav1 = document.querySelector(".tabNav1");
  let tabNav2 = document.querySelector(".tabNav2");
  let tabArea1 = document.querySelector(".tabArea1");
  let tabArea2 = document.querySelector(".tabArea2");
  tabNav1.addEventListener("click", function(e) {
    tabArea1.style.display = "flex";
    tabArea2.style.display = "none";
    tabNav1.style.background= "gainsboro";
    tabNav2.style.background= "white";
  });
  tabNav2.addEventListener("click", function(e) {
    tabArea1.style.display = "none";
    tabArea2.style.display = "flex";
    tabNav1.style.background= "white";
    tabNav2.style.background= "gainsboro";
  });

  // Input parsing behaviour
  let inputField = document.querySelector(".inputField");
  inputField.addEventListener("input", function(e) {
    cLog("input registered");
    let input = inputField.value;
    if (input.length >= 3) {
      processInput(input.toLowerCase());
    }
  });
  
  // New morpheme behaviour
  let addRootButton = document.querySelector(".addRootButton");
  let addAffixButton = document.querySelector(".addAffixButton");
  addRootField = document.querySelector(".addRootField");
  addAffixField = document.querySelector(".addAffixField");
  
  // Hide console behaviour
  let hideConsoleButton = document.querySelector(".hideConsoleButton");
  hideConsoleButton.addEventListener("click", function(e) {
    if (hideConsoleButton.value == "Hide") {
      cons.style.display = "none";
      hideConsoleButton.value = "Show";
    } else {
      cons.style.display = "block";
      hideConsoleButton.value = "Hide";
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

var lastMatch = "";
function processInput(str) {
  str = doSubs(str);
  let found = [];
  let numFound = 0;
  // Crawl through roots until 30 matches are found
  for (let i = 0; i < roots.length; i++) {
    if (roots[i].startsWith(str)) {
      found.push(roots[i]);
      numFound++;
    }
    // 30 matches found before reaching end of roots
    if (numFound == 30) {
      lastMatch = found[0];
      populateBoxes(found);
      break;
    }
    // Reached end of roots, no match found
    else if (i == roots.length - 1 && numFound === 0) {
      let aff = str.substring(lastMatch.length);
      checkAffixes(aff);
    }
    // Reached end of roots, fewer than 30 found
    else if (i == roots.length - 1) {
      lastMatch = found[0];
      populateBoxes(found);
      console.log("I'm running regardless");
      break;
    }
  }
  
  function checkAffixes(str) {
    let aFound = [];
    for (let i = 0; i < affixes.length; i++) {
      if(affixes[i][2].startsWith(str)) {
      	aFound.push(affixes[i][2]);
      }
    }
    console.log(aFound);
		return aFound[0];
  }
}

function populateBoxes(fd) {
  // First, clear any existing boxes
  while (boxParent.lastChild) {
    boxParent.removeChild(boxParent.lastChild);
  }
  
  //if (fd.length === 0) {
    // if letter(s) are left over after longest root is matched,
    // start searching in affixes[i][2]
    // must begin new search, starting from root, every time a new letter is inputted
    // no affix found
  //}
  
  // Only show max 30 matches, longest first
  for (let i = 0; i < fd.length; i++) {
    let child = document.createElement("div");
    child.className = "box";
    child.innerText = fd[i];
    boxParent.appendChild(child);
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
