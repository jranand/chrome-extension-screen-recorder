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

const getMimeType = (MediaRecorder, exportFormat) => {
  if(exportFormat === 'webm') {
    if(MediaRecorder.isTypeSupported("video/webm; codecs=vp9")) {
      return "video/webm; codecs=vp9";
    }
    if(MediaRecorder.isTypeSupported("video/webm; codecs=vp8")) {
      return "video/webm; codecs=vp8";
    }
    return "video/webm";
  } else {
    return "video/mp4";
  }
  
  
}

const closeWindow = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    window.close();
  });
};
 
chrome.runtime.onMessage.addListener((message) => {
  
  if (message.name !== 'startRecordingOnBackground') {
    closeWindow();
    return;
  }

  let videoResolution = [{ maxWidth: 1280}, { maxHeight: 720}];
  let exportFormat = 'mp4';
  let blobType = "video/mp4";
  if(message.body.exportFormat) {
    console.log('recordedFormat', message);
    exportFormat = message.body.exportFormat;   
  }

  if(message.body.exportSize && message.body.exportSize === 'fullHD') {
    videoResolution = [{ minWidth: 1280}, { minHeight: 720}];
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
          },
          optional: videoResolution,
        }
      }).then(stream => {
        
        const mediaRecorder = new MediaRecorder(stream, {
          videoBitsPerSecond: 3000000, // Adjust the bitrate as needed for higher quality
          audioBitsPerSecond: 128000 // Adjust the audio bitrate as needed
        });
        let chunks = [];
        blobType = getMimeType(MediaRecorder, exportFormat);
        mediaRecorder.ondataavailable = function(e) {
          chunks.push(e.data);
          /*if(exportFormat === 'gif') {
            const gif = new GIF({
              workers: 2,
              quality: 10,
            });
            gif.addFrame(chunk, { delay: 200 });
          }*/
        };



        mediaRecorder.onstop = async function(e) {

         
          const blobFile = new Blob(chunks, { type: blobType });
           
          //const base64 = await fetchBlob(URL.createObjectURL(blobFile));
          const url = URL.createObjectURL(blobFile);
          chrome.downloads.download({
            url: url,
            filename: 'screen_recording.'+ exportFormat,
            saveAs: true
          });
          // When recording is finished, send message to current tab content script with the base64 video
          closeWindow();

          // Stop all tracks of stream
          stream.getTracks().forEach(track => track.stop());
          chunks =[];
        }

        mediaRecorder.start();
      }).finally(async () => {
        // After all setup, focus on previous tab (where the recording was requested)
        await chrome.tabs.update(message.body.currentTab.id, { active: true, selected: true })
      }).catch(()=>{
        closeWindow();
      });
    });
});