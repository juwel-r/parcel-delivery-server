/* eslint-disable no-undef */

let activeHttpRequests = 0;
let lastStatus = "finished";

function showPopup(msg, bg = "orange") {
  let box = document.getElementById("pims-status-popup");
  if (!box) {
    box = document.createElement("div");
    box.id = "pims-status-popup";
    Object.assign(box.style, {
      position: "fixed",
      top: "48px",
      right: "4px",
      padding: "6px 12px",
      fontSize: "14px",
      fontFamily: "Segoe UI, sans-serif",
      fontWeight: "bold",
      color: "#fff",
      borderRadius: "4px",
      zIndex: 2147483647,
      backgroundColor: bg,
      boxShadow: "0 0 10px rgba(0,0,0,0.25)",
      opacity: 0.85,
      pointerEvents: "none",
    });
    document.body.appendChild(box);
  }
  box.style.backgroundColor = bg;
  box.textContent = msg;
}

function hidePopup() {
  const box = document.getElementById("pims-status-popup");
  if (box) box.remove();
}

function updateStatus(change) {
  activeHttpRequests += change;
  if (activeHttpRequests > 0 && lastStatus !== "pending") {
    lastStatus = "pending";
    clearTimeout(timer);
    showPopup("⏳ Loading...", "orange");
  }
  if (activeHttpRequests === 0 && lastStatus !== "finished") {
    lastStatus = "finished";
    showPopup("✅ Loaded", "green");
    timer = setTimeout(() => {
      hidePopup();
      window.dispatchEvent(new Event("all-network-done")); // notify content.js
    }, 1000);
  }
}

// --- Patch fetch ---
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  updateStatus(1);
  try {
    return await originalFetch(...args);
  } finally {
    updateStatus(-1);
  }
};

// --- Patch XMLHttpRequest (AJAX) ---
(function () {
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function () {
    this._trackRequest = true;
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function () {
    if (this._trackRequest) {
      updateStatus(1);
      this.addEventListener("loadend", () => updateStatus(-1));
    }
    return originalSend.apply(this, arguments);
  };
})();
