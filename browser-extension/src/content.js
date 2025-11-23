/****************************************************
 * content.js — Full integrated version
 ****************************************************/

// ----------------------
// Global arrays
// ----------------------
window.tosGuardianAgreements = [];
window.tosGuardianCookies = [];

let policyAlreadySummarized = false;
let policyInterval = null;

// ----------------------
// Helper functions
// ----------------------
function isVisible(el) {
  const rect = el.getBoundingClientRect();
  return el.offsetHeight > 0 && el.offsetWidth > 0 &&
         rect.bottom > 0 && rect.right > 0;
}

function textIndicatesAgreement(el) {
  const text = (el.innerText || "").toLowerCase();
  const policyKeywords = ["privacy policy", "terms of service", "terms and conditions"];
  const agreementKeywords = ["agree", "agreement"];
  return policyKeywords.some(pk => text.includes(pk)) &&
         agreementKeywords.some(ak => text.includes(ak));
}

function isConsentNearPolicyText(el) {
  if (!isVisible(el)) return false;

  const actionableButtonKeywords = ["accept", "agree", "i consent", "continue", "reject"];
  const buttons = el.querySelectorAll("button, a");

  const hasActionableButton = Array.from(buttons).some(btn =>
    actionableButtonKeywords.some(k => (btn.innerText || "").toLowerCase().includes(k))
  );

  return hasActionableButton || textIndicatesAgreement(el);
}

// ----------------------
// Log policy agreement
// ----------------------
function logPolicyAgreement(policyName) {
  if (!window.tosGuardianAgreements.includes(policyName)) {
    window.tosGuardianAgreements.push(policyName);
  }
}

// ----------------------
// Detect and show mock policy modal
// ----------------------
function detectPolicyModal() {
  if (policyAlreadySummarized) return;

  const candidateEls = document.querySelectorAll("div, section, dialog");

  for (let el of candidateEls) {
    if (isConsentNearPolicyText(el)) {
      policyAlreadySummarized = true;

      // Determine policy name for logging
      const text = (el.innerText || "").toLowerCase();
      let policyName = "Policy";
      if (text.includes("privacy")) policyName = "Privacy Policy";
      else if (text.includes("terms of service")) policyName = "Terms of Service";
      else if (text.includes("terms and conditions")) policyName = "Terms & Conditions";

      logPolicyAgreement(policyName);
      showModal("Policy Summary", "mock policy summary");

      // Optional logging to backend
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
// Cookie logging
// ----------------------
function logCookie(name, status) {
  const existing = window.tosGuardianCookies.find(c => c.name === name);
  if (existing) {
    existing.status = status;
  } else {
    window.tosGuardianCookies.push({ name, status });
  }
}

// Auto-reject cookie banners
function autoRejectCookies() {
  const selectors = ["[id*='cookie']", "[class*='cookie']", "[id*='consent']", "[class*='consent']"];
  const rejectKeywords = ["reject", "deny", "decline"];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (!isVisible(el)) return;

      const buttons = el.querySelectorAll("button, a");
      const rejectButton = Array.from(buttons).find(btn =>
        rejectKeywords.some(k => (btn.innerText || "").toLowerCase().includes(k))
      );

      if (rejectButton) {
        rejectButton.click();

        // Log rejected cookies after a short delay
        setTimeout(() => {
          document.cookie.split(";").forEach(c => {
            const name = c.split("=")[0].trim();
            logCookie(name, "rejected");
          });
        }, 500);
      }
    });
  });
}

// Detect essential cookies
function logEssentialCookies() {
  document.cookie.split(";").forEach(c => {
    const name = c.split("=")[0].trim();
    if (!window.tosGuardianCookies.find(e => e.name === name)) {
      logCookie(name, "essential");
    }
  });
}

// ----------------------
// Detection intervals
// ----------------------
function startDetection() {
  if (policyInterval) return;
  policyInterval = setInterval(() => {
    detectPolicyModal();
    autoRejectCookies();
    logEssentialCookies();
  }, 2000);
}

function stopDetection() {
  if (policyInterval) clearInterval(policyInterval);
  policyInterval = null;
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") stopDetection();
  else startDetection();
});

startDetection();

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
