### Chrome Extension Screen Recorder 

This browser extension template helps you build chrome extension apps. 

![ChromeExtensionScreenRecorder](https://lh3.googleusercontent.com/IY2vENUW6OnvHtqp9GkZJx_MGna1_L-xMdF9r02-UP-YX4iXsDh4ZaWXFGIj4RmJgmTPNdxw4KL55WjO3YKJUrO7ISM=s1280-w1280-h800)


### Demo

[Live Chrome Extension Preview](https://chromewebstore.google.com/u/2/detail/minimal-screen-recorder-f/nhnmpgbmdachgljegmenphljmhllepnj?hl=en)


### Features

1. Capture or Record your screen  as video 
2. Export as .MP4 or .WebM


## Installation

1. Clone this repository to your local machine
2. Open the Google Chrome browser and go to `chrome://extensions/`.
3. Turn on the "Developer mode" toggle in the top right corner.
4. Click on the "Load unpacked" button and select the directory where you cloned this repository.
5. The extension should now be loaded and ready to use.

## Usage

1. Click on the extension icon in the top right corner of the browser.
2. Click on the "Start Recording" button to start recording your screen.
3. It will open a new extension tab that is pinned and without a title. Select any screen.
4. Click on the "Stop Recording" button to stop the recording.
5. The recorded video will be displayed on screen (you can do anything you want in `content.js` file).

### Known issues
Because this is a minimal example, we do not address these issues:
- You can't start/stop recording on non-http pages (like `chrome://extensions`)
