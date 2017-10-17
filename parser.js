var vowel = ['a', 'e', 'i', 'o', 'u'];
var cons = ['q', 'w', 'r', 't', 'y', 'p', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];
var affixes;

$(function() {
  //console.log(randl(vowels, 10));
  //console.log(randl(vowel, 1).toString() + randl(cons, 1).toString());
  affixes = genAffix(5);
  displayAffixes();
});

function displayAffixes() {
  var wordlist = "";
  for (var i = 0; i < affixes.length; i++) {
    wordlist += "<p>" + affixes[i] + "</p>";
  }
  $("#word-list-affixes").html(wordlist);
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