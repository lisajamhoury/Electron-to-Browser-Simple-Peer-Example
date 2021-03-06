# Electron to Browser Connection with Simple Peer

This combines [Electron Quick Start](https://electronjs.org/docs/tutorial/quick-start) with [Realtime Communication with WebRTC](https://codelabs.developers.google.com/codelabs/webrtc-web/#0) Signal Server from Codelabs with [Simple Peer](https://github.com/feross/simple-peer).

It runs a Socket.io signal server, then a peer connection over webRTC using Simple Peer between Electron and the browser. Electron serves the signal server. This currently runs over localhost on port 3000.

## To Use

For Mac OS use master branch or [binaryexample branch](https://github.com/lisajamhoury/Electron-to-Browser-Simple-Peer-Example/tree/binaryexample). For Windows, use [binaryexample branch](https://github.com/lisajamhoury/Electron-to-Browser-Simple-Peer-Example/tree/binaryexample) only. Windows 10 does not allow for two apps to simultaniously use the webcam, so the master branch getUserMedia example will not work.

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/lisajamhoury/Electron-to-Browser-Simple-Peer-Example
# Go into the Electron application folder
cd Electron-to-Browser-Simple-Peer-Example/electron_app
# Install dependencies
npm install
# Run the Electron app — this will start the signaling server in Electron
npm start
# In a new command line window, go into the client folder
cd Electron-to-Browser-Simple-Peer-Example/browser_client
# Install dependencies
npm install
# Run a simple python server on your localhost
# If python 2
python -m SimpleHTTPServer 8000
# If python 3
python -m http.server 8000

# To make changes to client, run watchify in separate command line window
npm run watch
```
Open http://localhost:8000/dist in your browser. Open the developer console (option+command+I) to see communication between Electron and browser client. 

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
