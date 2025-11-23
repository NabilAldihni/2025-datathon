function detectPolicyText() {
    const keywords = ["terms", "privacy", "policy"];
    const found = [];
  
    document.querySelectorAll("a, p, div, section, article").forEach(el => {
      const text = (el.innerText || "").toLowerCase();
  
      if (keywords.some(k => text.includes(k))) {
        if ((el.innerText || "").length > 100) {
          found.push(el.innerText);
        }
      }
    });
  
    if (found.length > 0) {
      chrome.runtime.sendMessage({
        type: "POLICY_FOUND",
        text: found.join("\n\n"),
        url: location.href
      });
    }
  }
  
  function detectCookieBanner() {
    const els = document.querySelectorAll("[id*='cookie'], [class*='cookie']");
    els.forEach(el => {
      if (el.offsetHeight > 10) {
        chrome.runtime.sendMessage({
          type: "COOKIE_BANNER_FOUND",
          html: el.innerText,
          url: location.href
        });
      }
    });
  }
  
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "SHOW_SUMMARY") {
      alert(msg.summary);  // temporary UI while developing
    }
  
    if (msg.type === "COOKIE_SUMMARY") {
      alert("🍪 Cookie banner detected:\n\n" + msg.cookies);
    }
  });
  
  setInterval(() => {
    detectPolicyText();
    detectCookieBanner();
  }, 2000);
  