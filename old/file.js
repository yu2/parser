var affixes = [];
$(function() {
  $(".morpheme-area").css("height", $("body").css("height").slice(0, -2) - $(".header").css("height").slice(0, -2) - $(".search").css("height").slice(0, -2) - $(".tab-nav label").css("height").slice(0, -2) - 4 + "px");
  var leftHeight = $("body").css("height").slice(0, -2) - $(".header").css("height").slice(0, -2) - $(".search").css("height").slice(0, -2) - $(".tab-nav label").css("height").slice(0, -2) + "px";
  //var leftHeight = $(".morpheme-area").height("75vh");
  console.log("body: " + $("body").css("height").slice(0, -2) + " header: " + $(".header").css("height").slice(0, -2) + " search: " + $(".search").css("height").slice(0, -2) + " tab-nav: " + $(".tab-nav label").css("height").slice(0, -2));
  console.log("height(): " + $("body").height());
  console.log("cssheight: " + $("body").css("height").slice(0, -2));
  console.log("leftHeight: " + leftHeight);
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
