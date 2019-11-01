module.exports = class PeerBridge {
  constructor(socket) {
    this._socket = socket;
    this._peer = undefined;
    this._remoteVideo = document.querySelector("#remoteVideo");
    this._localVideo = document.querySelector("#localVideo");
  }

  setSignalServerClient(signalServerClient) {
    this._signalServerClient = signalServerClient;
  }

  sendSignal() {
    console.log("sending signal");

    this.sendMessage({
      type: "sending signal",
      data: JSON.stringify(data)
    });
  }

  handleStream = stream => {
    this._remoteVideo.srcObject = stream;
  };

  hangup = () => {
    console.log("Hanging up.");
    stop();
    sendMessage("bye");
  };

  handleRemoteHangup = () => {
    console.log("Session terminated.");
    stop();
    isInitiator = false;
  };

  stop = () => {
    isStarted = false;
    peer.destroy();
    peer = null;
  };

  sendMessage = message => {
    console.log("Client sending message: ", message);
    this._socket.emit("message", message);
  };

  createPeerConnection = isInit => {
    this._peer = new Peer({ initiator: isInit, stream: localStream });
    console.log("creating simple peer");

    // If isInitiator,peer.on'signal' will fire right away, if not it waits for signal
    // https://github.com/feross/simple-peer#peeronsignal-data--
    this._peer.on("signal", data => this.sendSignal(data));
    this._peer.on("connect", data =>
      console.log("SIMPLE PEER IS CONNECTED", data)
    );
    this._peer.on("error", err => console.log(err));
    this._peer.on("stream", stream => this.handleStream(stream));
    this._peer.on("close", () => this.hangup());
  };

  getPeerConnection = () => {
    return this._peer;
  };

  gotStream = stream => {
    console.log("Adding local stream.");
    localStream = stream;
    localVideo.srcObject = stream;
    sendMessage("got user media");
    if (this._signalServerClient.isInitiator()) {
      this._signalServerClient.maybeStart();
    }
  };
};
