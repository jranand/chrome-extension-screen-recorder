
const startRecording = (outputSettings) => {
  chrome.runtime.sendMessage({ name: 'startRecording', outputSettings: outputSettings });
};


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('startRecordingButton').addEventListener('click', ()=>{
    selectedFormat = document.getElementById("exportFormat");
    const exportFormat = selectedFormat.value;
    selectedSize = document.getElementById("exportSize");
    const exportSize = selectedSize.value;
    startRecording({ exportFormat: exportFormat, exportSize: exportSize });
  });
  
});
