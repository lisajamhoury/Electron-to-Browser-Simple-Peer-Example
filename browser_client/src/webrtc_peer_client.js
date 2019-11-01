const io = require("socket.io-client");
let Peer = require("simple-peer");

const SignalServerClient = require("./SignalServerClient.js");
console.log(SignalServerClient);
const socket = io.connect("http://localhost:3000");
let peer;
const ROOM_NAME = "foo"; // Could prompt for room name: // room = prompt('Enter room name:');

let localVideo = document.querySelector("#localVideo");

let localStream;
let turnReady; // currently unused

const pcConfig = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
};

/////////////////// Client Signal Server Using Socket IO ///////////////////
const peerBridge = new PeerBridge(socket);
const signalServerClient = new SignalServerClient(
  peerBridge,
  socket,
  ROOM_NAME
);
signalServerClient.initialize();
peerBridge.setSignalServerClient(signalServerClient);

function sendMessage(message) {
  console.log("Client sending message: ", message);
  socket.emit("message", message);
}

/////////////////// getUserMedia starts video and starts Simple Peer on Connection  ///////////////////

navigator.mediaDevices
  .getUserMedia({
    audio: false,
    video: true
  })
  .then(gotStream)
  .catch(function(e) {
    alert("getUserMedia() error: " + e.name);
  });

window.onbeforeunload = function() {
  sendMessage("bye");
};

/////////////////// Turn Server Used if Not on LocaHost — I have not tested this  ///////////////////

if (
  location.hostname &&
  location.hostname !== "localhost" &&
  location.hostname !== "127.0.0.1"
) {
  requestTurn(
    "https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913"
  );
}

function requestTurn(turnURL) {
  let turnExists = false;
  for (let i in pcConfig.iceServers) {
    if (pcConfig.iceServers[i].urls.substr(0, 5) === "turn:") {
      turnExists = true;
      turnReady = true;
      break;
    }
  }
  if (!turnExists) {
    console.log("Getting TURN server from ", turnURL);
    // No TURN server. Get one from computeengineondemand.appspot.com:
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let turnServer = JSON.parse(xhr.responseText);
        console.log("Got TURN server: ", turnServer);
        pcConfig.iceServers.push({
          urls: "turn:" + turnServer.username + "@" + turnServer.turn,
          credential: turnServer.password
        });
        turnReady = true;
      }
    };
    xhr.open("GET", turnURL, true);
    xhr.send();
  }
}
