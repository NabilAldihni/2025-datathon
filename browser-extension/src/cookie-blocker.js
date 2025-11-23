(function() {
    const rejectBtn = document.querySelector("button[id*='reject'], button[class*='reject']");
    if (rejectBtn) rejectBtn.click();
  
    Object.defineProperty(document, 'cookie', {
      configurable: false,
      set: function(_) {}
    });
  })();
  