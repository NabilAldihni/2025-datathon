/****************************************************
 *  content.js — FINAL VERSION WITH MODAL UI
 *  - Prevents repeated popups
 *  - Handles dynamic SPA navigation
 *  - Safe messaging
 *  - Clean modal UI
 ****************************************************/

// Tracks per-page state
let policyAlreadySummarized = false;

// Interval IDs
let policyInterval = null;
let cookieInterval = null;

// ----------------------
//  Modal UI Injection
// ----------------------

function createModal() {
  if (document.getElementById("tosGuardianModal")) return; // avoid double insert

  const modalHTML = `
    <div id="tosGuardianModal" class="tg-modal-hidden">
      <div class="tg-modal-backdrop"></div>
      <div class="tg-modal">
        <div class="tg-modal-header">
          <span id="tg-title">Summary</span>
          <button id="tg-close">&times;</button>
        </div>
        <div class="tg-modal-content">
          <p id="tg-body"></p>
        </div>
        <div class="tg-modal-footer">
          <button id="tg-ok">OK</button>
        </div>
      </div>
    </div>
  `;

  const style = `
    #tosGuardianModal.tg-modal-hidden { display: none; }
    #tosGuardianModal {
      position: fixed;
      inset: 0;
      z-index: 999999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
    }
    .tg-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(3px);
    }
    .tg-modal {
      background: white;
      border-radius: 10px;
      width: 450px;
      max-width: 90%;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      position: relative;
      animation: tg-fade-in 0.2s ease-out;
    }
    .tg-modal-header {
      padding: 12px 20px;
      border-bottom: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
    }
    #tg-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
    }
    .tg-modal-content {
      padding: 20px;
      max-height: 350px;
      overflow-y: auto;
      white-space: pre-wrap;
    }
    .tg-modal-footer {
      padding: 10px 20px;
      border-top: 1px solid #ddd;
      text-align: right;
    }
    #tg-ok {
      background: #007bff;
      border: none;
      padding: 10px 18px;
      border-radius: 5px;
      color: white;
      font-size: 14px;
      cursor: pointer;
    }
    @keyframes tg-fade-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  const styleEl = document.createElement("style");
  styleEl.textContent = style;
  document.head.appendChild(styleEl);

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Close handlers
  document.getElementById("tg-close").onclick = hideModal;
  document.getElementById("tg-ok").onclick = hideModal;
}

function showModal(title, body) {
  createModal();
  document.getElementById("tg-title").innerText = title;
  document.getElementById("tg-body").innerText = body;
  document.getElementById("tosGuardianModal").classList.remove("tg-modal-hidden");
}

function hideModal() {
  const modal = document.getElementById("tosGuardianModal");
  if (modal) {
    modal.classList.add("tg-modal-hidden");
  }
}

// ----------------------
// Detect TOS / Privacy Policy text
// ----------------------
function detectPolicyText() {
  if (policyAlreadySummarized) return;

  const keywords = ["terms of service", "terms and conditions", "terms & conditions", "privacy policy"];
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
      console.warn("Extension context invalidated during POLICY_FOUND", e);
      stopAllDetection();
    }
  }
}

// ----------------------
// Detect Cookie banners
// ----------------------
function detectCookieBanner() {
  const els = document.querySelectorAll("[id*='cookie'], [class*='cookie']");

  els.forEach(el => {
    if (el.offsetHeight > 20 && el.offsetWidth > 50) {
      try {
        chrome.runtime.sendMessage({
          type: "COOKIE_BANNER_FOUND",
          html: el.innerText || "",
          url: location.href
        });
      } catch (e) {
        console.warn("Extension context invalidated during COOKIE_BANNER_FOUND", e);
        stopAllDetection();
      }
    }
  });
}

// ----------------------
// Stop all detection
// ----------------------
function stopAllDetection() {
  if (policyInterval) clearInterval(policyInterval);
  if (cookieInterval) clearInterval(cookieInterval);
  policyInterval = null;
  cookieInterval = null;
}

// ----------------------
// Start detection (with safety against double-running)
// ----------------------
function startDetection() {
  if (policyInterval || cookieInterval) return;

  policyInterval = setInterval(detectPolicyText, 2000);
  cookieInterval = setInterval(detectCookieBanner, 2000);
}

startDetection();

// ----------------------
// Handle SPA navigation
// ----------------------
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    stopAllDetection();
  } else {
    startDetection();
  }
});

// ----------------------
// Listen for background responses
// ----------------------
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SHOW_SUMMARY") {
    showModal("Privacy / Terms Summary", msg.summary);
  }

  if (msg.type === "COOKIE_SUMMARY") {
    showModal("Cookie Info", msg.cookies);
  }
});
