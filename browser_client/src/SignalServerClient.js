const SignalServerClient = class SignalServerClient {
  constructor(peerBridge, socket, room) {
    this._peerBridge = peerBridge;
    this._socket = socket;
    this._room = room;
    this._localStream;
    this._isInitiator = false;
    this._isStarted = false;
    this._isChannelReady = false;
  }

  makeInitiator() {
    this._isInitiator = true;
  }

  start() {
    this._isStarted = true;
  }

  channelReady() {
    this._isChannelReady = true;
  }

  initialize() {
    this.createEventListeners();

    this._socket.emit("create or join", this._room);
    console.log("Attempted to create or join room", this._room);
  }

  maybeStart = () => {
    console.log(
      ">>>>>>> maybeStart() ",
      this._isStarted,
      this._localStream,
      this._isChannelReady
    );
    if (
      !this._isStarted &&
      typeof this._localStream !== "undefined" &&
      this._isChannelReady
    ) {
      console.log(">>>>>> creating peer connection");
      console.log("isInitiator", this._isInitiator);

      this._peerBridgecreatePeerConnection(this._isInitiator);
      isStarted = true;
    }
  };

  createEventListeners() {
    this._socket.on("created", room => {
      console.log("Created room " + room);
      this._isInitiator = true;
    });

    // room only holds two clients, can be changed in signal_socket.js
    this._socket.on("full", room => {
      console.log("Room " + room + " is full");
    });

    // called by initiator client only
    this._socket.on("join", room => {
      console.log("Another peer made a request to join room " + room);
      console.log("This peer is the initiator of room " + room + "!");
      isChannelReady = true;
    });
    // called by non-initiator client
    this._socket.on("joined", room => {
      console.log("joined: " + room);
      isChannelReady = true;
    });

    // logs messages from server
    this._socket.on("log", array => {
      console.log.apply(console, array);
    });

    // This client receives a message
    this._socket.on("message", message => {
      console.log("MESSAGE", message);

      if (message.type) {
        console.log("received msg typ ", message.type);
      } else {
        console.log("Client received message:", message);
      }

      if (message === "got user media") {
        maybeStart();
      } else if (message.type === "sending signal") {
        console.log("receiving simple signal data");

        this._peerBridge.createPeerConnection(this._isInitiator);
        const peer = this._peerBridge.getPeerConnection();
        peer.signal(message.data);
      } else if (message === "bye" && isStarted) {
        handleRemoteHangup();
      }
    });
  }
};

module.exports = SignalServerClient;
