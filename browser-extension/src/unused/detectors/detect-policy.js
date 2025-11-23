function findPolicyElements() {
    const selectors = [
      "a[href*='terms']",
      "a[href*='privacy']",
      "a[href*='policy']",
      "[id*='terms']",
      "[id*='privacy']",
      "[id*='policy']"
    ];
  
    let matches = [];
  
    selectors.forEach(sel => {
      matches.push(...document.querySelectorAll(sel));
    });
  
    return matches;
  }
  
  function detectPolicyText() {
    const elements = findPolicyElements();
  
    if (elements.length > 0) {
      const textContent = elements.map(el => el.innerText).join("\n");
  
      chrome.runtime.sendMessage({
        type: "POLICY_FOUND",
        text: textContent,
        url: location.href
      });
    }
  }
  
  // attempt scanning occasionally
  setInterval(detectPolicyText, 2000);
  