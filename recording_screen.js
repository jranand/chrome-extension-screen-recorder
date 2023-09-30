const fetchBlob = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const base64 = await convertBlobToBase64(blob);

  return base64;
};

const convertBlobToBase64 = (blob) => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;

      resolve(base64data);
    };
  });
};



 
chrome.runtime.onMessage.addListener((message) => {
  
  if (message.name !== 'startRecordingOnBackground') {
    return;
  }

 
  

  // Prompt user to choose screen or window
  chrome.desktopCapture.chooseDesktopMedia(
    ['screen', 'window', 'tab'],
    function (streamId) {
      if (streamId == null) {
        return;
      }

      // Once user has chosen screen or window, create a stream from it and start recording
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: streamId,
          }
        }
      }).then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        let chunks = [];
        let exportFormat = 'mp4';
        let blobType = "video/mp4";
        if(message.exportFormat) {
          console.log('recordedFormat', message);
          exportFormat = message.exportFormat;
          if(exportFormat === 'webm') {
            blobType = "video/webm";  
          } else if(exportFormat === 'gif') {
            blobType ="image/gif";
          }
        }
       
        mediaRecorder.ondataavailable = function(e) {
          chunks.push(e.data);
          if(exportFormat === 'gif') {
            const gif = new GIF({
              workers: 2,
              quality: 10,
            });
            gif.addFrame(chunk, { delay: 200 });
          }
        };



        mediaRecorder.onstop = async function(e) {

         
          const blobFile = new Blob(chunks, { type: blobType });
          
          //const base64 = await fetchBlob(URL.createObjectURL(blobFile));
          const url = URL.createObjectURL(blobFile);
          if(exportFormat !== 'gif'){
            chrome.downloads.download({
              url: url,
              filename: 'screen_recording.'+ exportFormat,
              saveAs: true
            });
          } else {
            gif.download();
          }
          // When recording is finished, send message to current tab content script with the base64 video
          /*chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const tabWhenRecordingStopped = tabs[0];

            chrome.tabs.sendMessage(tabWhenRecordingStopped.id, {
              name: 'endedRecording',
              body: {
                base64,
              }
            })

            window.close();
          });*/

          // Stop all tracks of stream
          stream.getTracks().forEach(track => track.stop());
          chunks =[];
        }

        mediaRecorder.start();
      }).finally(async () => {
        // After all setup, focus on previous tab (where the recording was requested)
        await chrome.tabs.update(message.body.currentTab.id, { active: true, selected: true })
      });
    })
});