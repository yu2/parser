$(function() {
  $("#rule-name").append(wrap("t:c => ___ i"))
  $("#rule").append(wrap("LR:  t  a  t  i"));
  $("#rule").append(wrap("SR:  t  a  c  i"));
});

function wrap(str) {
  return "<p>" + str + "</p>";
}