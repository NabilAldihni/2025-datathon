function updateSummary() {
    const policiesList = document.getElementById("policiesList");
    const cookiesList = document.getElementById("cookiesList");
    const essentialListEl = document.getElementById("essentialCookiesList");
    policiesList.innerHTML = "<li>Loading...</li>";
    cookiesList.innerHTML = "<li>Loading...</li>";
    essentialListEl.innerHTML = "";
  
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
          let essentialCookies = [];
  
          cookies.forEach(c => {
            if (c.status === "essential") essentialCookies.push(c);
            else {
              const li = document.createElement("li");
              li.innerText = `${c.name}: ${c.status}`; // rejected
              cookiesList.appendChild(li);
            }
          });
  
          if (essentialCookies.length > 0) {
            const li = document.createElement("li");
            li.innerText = `Essential Cookies (${essentialCookies.length})`;
            li.classList.add("clickable");
            li.onclick = () => showEssentialModal(essentialCookies);
            cookiesList.appendChild(li);
          }
        }
      });
    });
  }
  
  // ----------------------
  // Modal functions
  // ----------------------
  function showEssentialModal(essentialCookies) {
    const essentialListEl = document.getElementById("essentialCookiesList");
    essentialListEl.innerHTML = "";
    essentialCookies.forEach(c => {
      const li = document.createElement("li");
      li.innerText = c.name;
      essentialListEl.appendChild(li);
    });
    document.getElementById("essentialModal").classList.remove("tg-modal-hidden");
  }
  
  document.getElementById("closeEssentialModal").onclick = () => {
    document.getElementById("essentialModal").classList.add("tg-modal-hidden");
  };
  
  document.getElementById("refreshBtn").addEventListener("click", updateSummary);
  updateSummary();
  