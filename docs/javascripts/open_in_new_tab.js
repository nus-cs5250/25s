// https://jekyllcodex.org/without-plugin/new-window-fix/

function external_new_window() {
  for (var c = document.getElementsByTagName("a"), a = 0; a < c.length; a++) {
    var b = c[a];
    if (b.getAttribute("href") && b.hostname !== location.hostname) {
      b.target = "_blank";
      b.rel = "noopener";
    }
  }
}

window.addEventListener("DOMContentLoaded", function () {
  external_new_window();
});
