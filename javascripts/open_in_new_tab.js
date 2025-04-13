function openExternalLinksInNewTab() {
  document.querySelectorAll("a[href]").forEach((link) => {
    if (new URL(link.href, location.origin).hostname !== location.hostname) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  });
}

document.addEventListener("DOMContentLoaded", openExternalLinksInNewTab);
