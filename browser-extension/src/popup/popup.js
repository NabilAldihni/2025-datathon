function updateSummary() {
    const policiesList = document.getElementById("policiesList");
    const cookiesList = document.getElementById("cookiesList");
    policiesList.innerHTML = "<li>Loading...</li>";
    cookiesList.innerHTML = "<li>Loading...</li>";
  
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const activeTab = tabs[0];
  
      // Policies
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: () => window.tosGuardianAgreements || []
      }, results => {
        const agreements = results?.[0]?.result || [];
        if (agreements.length === 0) policiesList.innerHTML = "<li>No policies agreed to yet.</li>";
        else {
          policiesList.innerHTML = "";
          agreements.forEach(a => {
            const li = document.createElement("li");
            li.innerText = a;
            policiesList.appendChild(li);
          });
        }
      });
  
      // Cookies
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: () => window.tosGuardianCookies || []
      }, results => {
        const cookies = results?.[0]?.result || [];
        if (cookies.length === 0) cookiesList.innerHTML = "<li>No cookies detected yet.</li>";
        else {
          cookiesList.innerHTML = "";
          cookies.forEach(c => {
            const li = document.createElement("li");
            li.innerText = `${c.name}: ${c.status}`; // rejected or essential
            cookiesList.appendChild(li);
          });
        }
      });
    });
  }
  
  // Refresh button
  document.getElementById("refreshBtn").addEventListener("click", updateSummary);
  updateSummary();
  