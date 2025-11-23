/****************************************************
 * content.js — Trigger mock summary only for:
 * - Visible actionable button near policy text
 * OR
 * - Text containing "agree"/"agreement" near policy keywords
 ****************************************************/

let policyAlreadySummarized = false;
let policyInterval = null;

// ----------------------
// Check if element is visible
// ----------------------
function isVisible(el) {
  const rect = el.getBoundingClientRect();
  return el.offsetHeight > 0 && el.offsetWidth > 0 &&
         rect.bottom > 0 && rect.right > 0;
}

// ----------------------
// Determine if text contains policy keywords and agreement keywords nearby
// ----------------------
function textIndicatesAgreement(el) {
  const text = (el.innerText || "").toLowerCase();
  const policyKeywords = ["privacy policy", "terms of service", "terms and conditions"];
  const agreementKeywords = ["agree", "agreement"];
  
  return policyKeywords.some(pk => text.includes(pk)) &&
         agreementKeywords.some(ak => text.includes(ak));
}

// ----------------------
// Determine if element is an actionable consent banner
// ----------------------
function isConsentNearPolicyText(el) {
  if (!isVisible(el)) return false;

  const actionableButtonKeywords = ["accept", "agree", "i consent", "continue", "reject"];
  const buttons = el.querySelectorAll("button, a");

  const hasActionableButton = Array.from(buttons).some(btn =>
    actionableButtonKeywords.some(k => (btn.innerText || "").toLowerCase().includes(k))
  );

  // Trigger if either:
  // 1. Visible button exists with keyword
  // 2. Text itself contains "agree"/"agreement" near policy keywords
  return hasActionableButton || textIndicatesAgreement(el);
}

// ----------------------
// Detect actionable policy modals
// ----------------------
function detectPolicyModal() {
  if (policyAlreadySummarized) return;

  const candidateEls = document.querySelectorAll("div, section, dialog");

  for (let el of candidateEls) {
    if (isConsentNearPolicyText(el)) {
      policyAlreadySummarized = true;

      showModal("Policy Summary", "mock policy summary");

      // Optionally log to backend
      try {
        chrome.runtime.sendMessage({
          type: "POLICY_FOUND",
          url: location.href
        });
      } catch (e) {
        console.warn("Extension context invalidated during POLICY_FOUND", e);
      }

      break;
    }
  }
}

// ----------------------
// Start detection interval
// ----------------------
function startDetection() {
  if (policyInterval) return;
  policyInterval = setInterval(detectPolicyModal, 2000);
}

startDetection();

// ----------------------
// Automatically reject cookie banners
// ----------------------
function autoRejectCookies() {
  // Common cookie banner selectors
  const selectors = [
    "[id*='cookie']",
    "[class*='cookie']",
    "[id*='consent']",
    "[class*='consent']",
    "[id*='gdpr']",
    "[class*='gdpr']"
  ];

  const rejectKeywords = ["reject", "deny", "decline", "manage preferences"];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (!el.offsetHeight || !el.offsetWidth) return; // skip hidden

      // Find buttons or links to reject
      const buttons = el.querySelectorAll("button, a");
      const rejectButton = Array.from(buttons).find(btn =>
        rejectKeywords.some(k => (btn.innerText || "").toLowerCase().includes(k))
      );

      if (rejectButton) {
        rejectButton.click();
        console.log("Cookie banner rejected automatically");
      }
    });
  });
}

// Run cookie rejection every 2 seconds (handles dynamic SPA content)
setInterval(autoRejectCookies, 2000);


// ----------------------
// Stop detection interval
// ----------------------
function stopDetection() {
  if (policyInterval) clearInterval(policyInterval);
  policyInterval = null;
}

// ----------------------
// SPA navigation support
// ----------------------
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    stopDetection();
  } else {
    startDetection();
  }
});

// ----------------------
// Modal UI
// ----------------------
function createModal() {
  if (document.getElementById("tosGuardianModal")) return;

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
      width: 400px;
      max-width: 90%;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      position: relative;
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
    #tg-close { background: none; border: none; font-size: 24px; cursor: pointer; }
    .tg-modal-content { padding: 20px; max-height: 300px; overflow-y: auto; white-space: pre-wrap; }
    .tg-modal-footer { padding: 10px 20px; border-top: 1px solid #ddd; text-align: right; }
    #tg-ok { background: #007bff; border: none; padding: 10px 18px; border-radius: 5px; color: white; font-size: 14px; cursor: pointer; }
  `;

  const styleEl = document.createElement("style");
  styleEl.textContent = style;
  document.head.appendChild(styleEl);

  document.body.insertAdjacentHTML("beforeend", modalHTML);

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
  if (modal) modal.classList.add("tg-modal-hidden");
}
