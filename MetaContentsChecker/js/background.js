var metaContents
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    metaContents = request
  }
)