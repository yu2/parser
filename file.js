var affixes = [];
$(function() {
  $('input[multiple]').change(handleFiles);
});

function handleFiles() {
  var fileList = this.files;
  for (var i = 0; i < fileList.length; i++) {
    $('.output').append(fileList[i].name + "<br>" + fileList[i].type + "<br>" + fileList[i].size + " bytes<br><br>");
    reader.readAsText(fileList[i]);
  }
}
  
var reader = new FileReader();
reader.onload = function(e) {
  var contents = e.target.result;
  var lines = contents.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var tabs = lines[i].split('\t');
    affixes.push(new Affix(tabs[2], tabs[1], tabs[0]));
  }
  affixes.forEach(function(e) {
    $("#word-list-token").append("<p>" + e.token + "</p>");
    $("#word-list-label").append("<p>" + e.label  + "</p>");
    $("#word-list-abbr").append("<p>" + e.abbr + "</p>");
  });
};

function Affix(token, label, abbr) {
  this.token = token;
  this.label = label;
  this.abbr = abbr;
}