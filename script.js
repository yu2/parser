document.addEventListener("DOMContentLoaded", function() {
  startTime = null;
  cons = document.querySelector(".console");
  boxParent = document.querySelector(".boxMother");
  var inputField = document.querySelector(".inputField");
  inputField.addEventListener("input", function(e) {
    cLog("input registered");
    let input = inputField.value;
    if (input.length >= 3) {
      processInput(input.toLowerCase());
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
  let value = ele.innerHTML;
  var blob = (value == "Download Roots")
    ? new Blob([roots.join("\r\n")], {type: 'text/csv'})
    :  new Blob([affixes.join("\r\n")], {type: 'text/csv'});
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

var lastMatch = "";
function processInput(str) {
  str = doSubs(str);
  let found = [];
  let numFound = 0;
  // Search through roots until 30 matches are found
  for (let i = 0; i < roots.length; i++) {
    if (roots[i].startsWith(str)) {
      found.push(roots[i]);
      numFound++;
    }
    if (numFound == 30) {
      lastMatch = found[0];
      populateBoxes(found);
      break;
    }
    else if (i == roots.length - 1 && numFound === 0) {
      console.log(lastMatch);
      let aff = str.replace(lastMatch, "");
      let aff2 = str.replace("abanikos", "");
      console.log("type: " + typeof lastMatch);
      console.log("str: " + str);
      console.log("last match: " + lastMatch);
      console.log("aff: " + aff);
      console.log("aff2: " + aff2);
      checkAffixes(aff);
    }
    else if (i == roots.length - 1) {
      lastMatch = found[0];
      populateBoxes(found);
      break;
    }
  }
  
  function checkAffixes(str) {
    console.log("passed str: " + str);
    let aFound = [];
    console.log(str);
    for (let i = 0; i < affixes.length; i++) {
      if(affixes[i][2].startsWith(str)) {
        aFound.push(affixes[i][2]);
      }
    }
    console.log(aFound);
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
  let lim = Math.min(30, fd.length);
  for (let i = 0; i < lim; i++) {
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