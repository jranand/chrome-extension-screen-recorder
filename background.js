const startRecording = async (exportFormat) => {
  await chrome.tabs.query({'active': true, 'lastFocusedWindow': true, 'currentWindow': true}, async function (tabs) {
    // Get current tab to focus on it after start recording on recording screen tab
    const currentTab = tabs[0];

    // Create recording screen tab
    const tab = await chrome.tabs.create({
      url: chrome.runtime.getURL('recording_screen.html'),
      pinned: true,
      active: true,
    });

    // Wait for recording screen tab to be loaded and send message to it with the currentTab
    chrome.tabs.onUpdated.addListener(async function listener(tabId, info, exportFormat) {
      if (tabId === tab.id && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);

        await chrome.tabs.sendMessage(tabId, {
          name: 'startRecordingOnBackground',
          exportFormat: exportFormat,
          body: {
            currentTab: currentTab,
          },
        });
      }
    });
  });
};

// Listen for startRecording message from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.name === 'startRecording') {
    const exportFormat = request.exportFormat;
    console.log(exportFormat);
    startRecording(exportFormat);
  }
});