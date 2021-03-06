var input;

$(function() {
  // generate and display morphemes
  affixes = genAffix(5);
  rootList = genR(4);
  displayList(rootList, "roots");
  affixes = genAffix(6);
  displayList(affixes, "affixes");
  
  // searchbox and button behaviour
  $(".search input").click(function() {
    $(".search input").val("");
  });
  $(".search input").keydown(function(e){
    if(e.keyCode == 13) {
      $(".search button").trigger("click");
    }
  });
  $(".search button").click(function() {
    input = $(".search input").val();
    $(".input-display").html(input);
    searchRoots(input);
  });
  
  console.log(affixes[0]);
});

function searchAffix(str) {
  for(var i = 1; i<=str.length; i++) {
    var search = str.substring(0, i);
    if(affixes.indexOf(search) !== -1) {
      $(".morpheme-display").append("." + str.substring(0, i));
      searchAffix(str.substring(i));
    }
  }
}

function searchRoots(input) {
  for(var i = 1; i < input.length; i++) {
    var search = input.substring(0, i);
    if (rootList.indexOf(search) !== -1) {
      break;
    }
  }

  $(".morpheme-display").html(input.substring(0, i));
  searchAffix(input.substring(i));
}

// generates a list of roots
function genR(reps) {
  var syllables = [1, 2, 3];
  var rootList = [];
  for (var i = 0; i < reps; i++) {
    var root = "";
    for (var j = 0; j < Math.floor(Math.random() * syllables.length + 1); j++) {
      root += randl(cons, 1) + randl(vowel, 1);
    }
    root += randl(cons, 1);
    rootList.push(root);
  }
  return rootList;
}

// displays list of roots or affixes
function displayList(list, type) {
  var wordlist = "";
  for (var i = 0; i < list.length; i++) {
    wordlist += "<p>" + list[i] + "</p>";
  }
  $("#word-list-" + type).html(wordlist);
}

// returns a number of VC affixes
function genAffix(reps) {
  var list = [];
  for (var i = 0; i < reps; i++) {
    list.push(randl(vowel, 1).toString() + randl(cons, 1).toString());
  }
  return list;
}

// returns a number of random vowels or consonants
function randl(array, reps) {
  var list = [];
  for (var i = 0; i < reps; i++) {
    list.push(array[Math.floor(Math.random() * array.length)]);
  }
  return list;
}

