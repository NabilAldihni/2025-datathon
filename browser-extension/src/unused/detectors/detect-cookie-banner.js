function detectCookieBanner() {
    const possible = document.querySelectorAll("[id*='cookie'], [class*='cookie']");
  
    possible.forEach(el => {
      if (getComputedStyle(el).display !== "none") {
        chrome.runtime.sendMessage({
          type: "COOKIE_BANNER_FOUND",
          html: el.innerText,
          url: location.href
        });
      }
    });
  }
  
  setInterval(detectCookieBanner, 1500);
  