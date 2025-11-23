/****************************************************
 *  content.js
 *  Clean detection + safe messaging + interval control
 ****************************************************/

// Tracks whether this page has already shown a summary
let policyAlreadySummarized = false;

// Interval IDs for cleanup
let policyInterval = null;
let cookieInterval = null;

// ----------------------
// Detect TOS / Privacy Policy Text
// ----------------------
function detectPolicyText() {
  if (policyAlreadySummarized) return;

  const keywords = ["terms", "privacy", "policy"];
  const found = [];

  document.querySelectorAll("a, p, div, section, article").forEach(el => {
    const text = (el.innerText || "").toLowerCase();

    if (keywords.some(k => text.includes(k))) {
      if ((el.innerText || "").length > 120) {
        found.push(el.innerText);
      }
    }
  });

  if (found.length > 0) {
    policyAlreadySummarized = true;

    try {
      chrome.runtime.sendMessage({
        type: "POLICY_FOUND",
        text: found.join("\n\n"),
        url: location.href
      });
    } catch (e) {
      console.warn("Extension context invalidated during POLICY_FOUND sendMessage", e);
      stopAllDetection();
    }
  }
}

// ----------------------
// Detect Cookie Banners
// ----------------------
function detectCookieBanner() {
  const elements = document.querySelectorAll("[id*='cookie'], [class*='cookie']");

  elements.forEach(el => {
    if (el.offsetHeight > 20 && el.offsetWidth > 50) {
      try {
        chrome.runtime.sendMessage({
          type: "COOKIE_BANNER_FOUND",
          html: el.innerText || "",
          url: location.href
        });
      } catch (e) {
        console.warn("Extension context invalidated during COOKIE_BANNER_FOUND sendMessage", e);
        stopAllDetection();
      }
    }
  });
}

// ----------------------
// Stop All Detection Intervals
// ----------------------
function stopAllDetection() {
  if (policyInterval) clearInterval(policyInterval);
  if (cookieInterval) clearInterval(cookieInterval);
  policyInterval = null;
  cookieInterval = null;
}

// ----------------------
// Start detection intervals (only once)
// ----------------------
function startDetection() {
  // Prevent double-starting if Chrome injects twice
  if (policyInterval || cookieInterval) return;

  policyInterval = setInterval(detectPolicyText, 2000);
  cookieInterval = setInterval(detectCookieBanner, 2000);
}

startDetection();

// ----------------------
// Handle SPA navigation (Google, YouTube, etc.)
// These sites replace content with JavaScript instead of reloading pages.
// ----------------------
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    stopAllDetection();
  } else if (document.visibilityState === "visible") {
    // restart on returning to tab
    startDetection();
  }
});

// ----------------------
// Listen for summary or cookie popup messages
// ----------------------
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SHOW_SUMMARY") {
    alert(msg.summary);  // temporary UI—replace with modal later
  }

  if (msg.type === "COOKIE_SUMMARY") {
    alert("🍪 Cookie banner detected:\n\n" + msg.cookies);
  }
});
