function $(elid) {
  return document.getElementById(elid);
}

var cursor;
window.onload = init;

function init() {
  cursor = $("cursor");
  cursor.style.left = "0px";
}

function nl2br(txt) {
  return txt.replace(/\n/g, "<br />");
}

function writeit(from, e, s) {
  e = e || window.event;
  var w = $("writer" + s);
  var tw = from.value;
  w.innerHTML = nl2br(tw);
}

function cleanText() {
  $("writer").innerHTML = nl2br($("writer").innerHTML);
}

function clearSet(string, s) {
  $("setter").value = string;
  $("writer").innerHTML = string;
}

function moveIt(count, e) {
  e = e || window.event;
  var keycode = e.keyCode || e.which;
  //				alert(count);
  if (keycode == 37 && parseInt(cursor.style.left) >= 0 - (count - 1) * 10) {
    cursor.style.left = parseInt(cursor.style.left) - 10 + "px";
  } else if (keycode == 39 && parseInt(cursor.style.left) + 10 <= 0) {
    cursor.style.left = parseInt(cursor.style.left) + 10 + "px";
  }
}

function alert(txt) {
  console.log(txt);
}
