import {
    summarizeTextMock,
    logEventMock,
    getUserSettingsMock
  } from "./api.js";
  
  chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  
    if (msg.type === "POLICY_FOUND") {
      const summaryResult = await summarizeTextMock(msg.text, msg.url);
  
      chrome.tabs.sendMessage(sender.tab.id, {
        type: "SHOW_SUMMARY",
        summary: summaryResult.summary
      });
  
      await logEventMock("policy_summary", msg.url);
      sendResponse(summaryResult);
    }
  
    if (msg.type === "COOKIE_BANNER_FOUND") {
      const settings = await getUserSettingsMock();
  
      if (settings.cookie_behavior === "silent") {
        chrome.scripting.executeScript({
          target: { tabId: sender.tab.id },
          files: ["src/cookie-blocker.js"]
        });
      } else {
        chrome.tabs.sendMessage(sender.tab.id, {
          type: "COOKIE_SUMMARY",
          cookies: msg.html
        });
      }
  
      await logEventMock("cookies_detected", msg.url);
    }
  });
  