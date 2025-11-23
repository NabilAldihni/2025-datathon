/**
 * MOCK API LAYER
 * 
 * When backend is ready:
 * - Replace mock functions with real fetch() calls
 * - Or wrap fetch() inside these functions
 * 
 * 
 * export async function summarizeTextMock(text, url) {
  const res = await fetch("https://YOUR_BACKEND/summarize", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({text, url})
  });
  return await res.json();
}
 * 
 */

export async function summarizeTextMock(text, url) {
    return {
      summary: `📝 MOCK SUMMARY\n\nThis is where the summary of the terms/privacy policy would appear.\n\nDetected text length: ${text.length} characters.\nURL: ${url}`
    };
  }
  
  export async function logEventMock(event, url) {
    console.log(`[MOCK LOG] Event=${event} URL=${url}`);
    return { status: "ok" };
  }
  
  export async function getUserSettingsMock() {
    // Change this to "notify" if you want prompts during dev
    return { cookie_behavior: "silent" };
  }
  