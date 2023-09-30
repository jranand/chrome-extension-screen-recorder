
const startRecording = (exportFormat) => {
  chrome.runtime.sendMessage({ name: 'startRecording', exportFormat: exportFormat });
};


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('startRecordingButton').addEventListener('click', ()=>{
    selectedFormat = document.getElementById("exportFormat");
    exportFormat = selectedFormat.value;
    startRecording(exportFormat);
  });
  
});
