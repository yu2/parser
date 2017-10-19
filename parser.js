var vowel = ['a', 'e', 'i', 'o', 'u'];
var cons = ['q', 'w', 'r', 't', 'y', 'p', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];
var affixes, rootList;
var input;

$(function() {
  //console.log(randl(vowels, 10));
  //console.log(randl(vowel, 1).toString() + randl(cons, 1).toString());
  affixes = genAffix(5);
  displayList(genR(4), "roots");
  displayList(genAffix(6), "affixes");
  
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
});

function searchRoots(input) {
  var itemIndex;
  console.log(input);
  console.log(rootList.indexOf(input));
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