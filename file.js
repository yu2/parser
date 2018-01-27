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
    for (var j = 0; j < tabs.length; j++) {
      $('.output').append(tabs[j] + "<br>");
    }
  }
};

function Affix(token, label, abbreviation) {
  this.token = token;
  this.label = label;
  this.abbreviation = abbreviation;
}
