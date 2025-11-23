// Load user settings
document.addEventListener("DOMContentLoaded", async () => {
    const { cookieBehavior } = await chrome.storage.sync.get("cookieBehavior");
    const toggle = document.getElementById("cookieToggle");
  
    toggle.checked = cookieBehavior === "silent";
  
    toggle.addEventListener("change", () => {
      chrome.storage.sync.set({
        cookieBehavior: toggle.checked ? "silent" : "notify"
      });
    });
  
    // Test modal trigger
    document.getElementById("testModalBtn").addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "SHOW_SUMMARY",
          summary: "This is a test modal message from the popup!"
        });
      });
    });
  });
  
  // Receive summary info from background
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "SUMMARY_LOG") {
      document.getElementById("lastSummary").innerHTML =
        `<strong>Last Summary:</strong> ${new Date().toLocaleTimeString()}`;
    }
  });
  