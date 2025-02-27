chrome.runtime.onMessage.addListener((message, sender) => {
  console.log(message.url);
  if (!message.url) return;

  fetch(
    "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyBqvTzbhup4HBR8HARdhKcsMu7miT6DI6I",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client: { clientId: "url_checker", clientVersion: "1.0" },
        threatInfo: {
          threatTypes: ["SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "MALWARE"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url: message.url }],
        },
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (true) {
        console.log(data);
        chrome.scripting.executeScript({
          target: { tabId: sender.tab.id },
          function: showWarningPopup,
          args: ["⚠️ Warning: This website is flagged as dangerous!", "red"],
        });
      } else {
        // If website is safe, show green "Safe" popup
        chrome.scripting.executeScript({
          target: { tabId: sender.tab.id },
          function: showWarningPopup,
          args: ["✅ This website is safe!", "green"],
        });
      }
    })
    .catch((error) => console.error("API Error:", error));
});

// Function to display the popup
function showWarningPopup(message, color) {
  let popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.right = "20px";
  popup.style.backgroundColor = color;
  popup.style.color = "white";
  popup.style.padding = "15px";
  popup.style.zIndex = "10000";
  popup.style.fontSize = "16px";
  popup.style.borderRadius = "5px";
  popup.innerText = message;
  document.body.appendChild(popup);

  // Auto remove popup after 5 seconds
  setTimeout(() => popup.remove(), 5000);
}
