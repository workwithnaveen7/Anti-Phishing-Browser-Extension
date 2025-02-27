chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message.url) return;

  fetch(
    "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyAbBlQVU7qJrskzFX5C0cgiOvVpsavlXaY",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: message.url }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.result === true) {
        chrome.scripting.executeScript({
          target: { tabId: sender.tab.id },
          files: ["popup.js"],
        });
      }
    })
    .catch((error) => console.error("API Error:", error));
});
