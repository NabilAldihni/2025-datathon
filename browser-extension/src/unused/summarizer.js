async function summarize(text) {
    const token = await chrome.storage.sync.get("authToken");
  
    const res = await fetch("https://your-backend.com/api/summarize", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token.authToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });
  
    return await res.json();
  }
  