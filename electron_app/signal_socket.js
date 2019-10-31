//////// socket signal server ///////////

'use strict';

var os = require('os');

const server = require('http').createServer();
const ioServer = require('socket.io')(server);
server.listen(3000);

console.log('server created');

ioServer.sockets.on('connection', function(socket) {

  // convenience function to log server messages on the client
  function log() {
    var array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  socket.on('message', function(message) {
    console.log('Client said: ', message);
    // for a real app, would be room-only (not broadcast)
    socket.broadcast.emit('message', message);
  });

  socket.on('create or join', function(room) {
    console.log('Received request to create or join room ' + room);

    // I can't console.log or debug this. Why? 
    var clientsInRoom = ioServer.sockets.adapter.rooms[room];
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
    console.log('Room ' + room + ' now has ' + numClients + ' client(s)');

    if (numClients === 0) {
      socket.join(room);
      console.log('Client ID ' + socket.id + ' created room ' + room);
      socket.emit('created', room, socket.id);

    } else if (numClients === 1) { // change number of clients allowed in room here 
      console.log('Client ID ' + socket.id + ' joined room ' + room);
      ioServer.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room, socket.id);
      ioServer.sockets.in(room).emit('ready'); // not being used anywhere
    } else { // max two clients
      socket.emit('full', room);
    }

  });

  socket.on('ipaddr', function() {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        }
      });
    }
  });

  socket.on('bye', function(){
    console.log('received bye');
  });

});
