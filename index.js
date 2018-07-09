var app = require('express')();
var http = require('http').Server(app);
//var io = require('socket.io')(http);
var io = require('socket.io').listen(http);
var express = require('express');
let avl_users = [];

let rooms = [];

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});



app.use(express.static('public'));



io.on('connection', function(socket) {
  console.log('Client connected from: ' + socket.handshake.address);

  let partner = "";

  //add user to avaliable users list
  //avl_users.push(socket.id);




  console.log('avaliable users  is ' + avl_users);
  console.log('rooms is ' + rooms);


  socket.on('disconnect', function() {
    console.log('user disconnected');
    delete avl_users[avl_users.indexOf(socket.id)];
    //cleaning the array from empty elements
    avl_users = avl_users.filter(function(x) {
      return (x !== (undefined || null || ''));
    });

    //exit current room
    for (var g = 0; g < rooms.length; g++) {

      if (typeof(rooms[g]) != "undefined") {
        if (rooms[g].client1 == socket.id) {
          socket.broadcast.to(rooms[g].client2).emit('chat message', "client disconnected - press random again to search someone new");
          //avl_users.push(rooms[g].client2);
          rooms.splice(g, 1);
          break;
        }
        if (rooms[g].client2 == socket.id) {
          socket.broadcast.to(rooms[g].client1).emit('chat message', "client disconnected - press random again to search someone new");
          //avl_users.push(rooms[g].client1);
          rooms.splice(g, 1);
          break;
        }
      }

    }


    console.log('avaliable users  is ' + avl_users);
    console.log('rooms is ' + rooms);


  });

  socket.on('chat message', function(msg, ack) {
   partner="";
    for (var g = 0; g < rooms.length; g++) {

      if (typeof(rooms[g]) != "undefined") {
        if (rooms[g].client1 == socket.id) {
          partner = rooms[g].client2;
        }
        if (rooms[g].client2 == socket.id) {
          partner = rooms[g].client1;
        }
      }

    }
    if (partner != "") {
      socket.broadcast.to(partner).emit('chat message', msg);
    } else {
      {
        ack("you are open to new connections");
      }
    }
    //}
  });

  socket.on('random', function(msg, ack) {
    console.log('random was pressed by ' + socket.id);

if ( avl_users.indexOf(socket.id) == -1 ){
    avl_users.push(socket.id);
}

    //exit current room
    for (var g = 0; g < rooms.length; g++) {

      if (typeof(rooms[g]) != "undefined") {
        if (rooms[g].client1 == socket.id) {
          socket.broadcast.to(rooms[g].client2).emit('chat message', "client has left you :( - press random again to search someone new");
          //avl_users.push(rooms[g].client2);
          rooms.splice(g, 1);
          break;
        }
        if (rooms[g].client2 == socket.id) {
          socket.broadcast.to(rooms[g].client1).emit('chat message', "client has left you :( - press random again to search someone new");
        //  avl_users.push(rooms[g].client1);
          rooms.splice(g, 1);
          break;
        }
      }

    }


    //search for new partner
    partner = "";
    for (var i = 0; i < avl_users.length; i++) {
      var tmpUser = avl_users[i];
      //  console.log('tmpuser is ' + tmpUser);
      //  console.log('value in array is ' + avl_users[i]);

      if (tmpUser != "" || tmpUser != null) {
        if (tmpUser != socket.id) {
          partner = tmpUser;
          break;
        }
      }
    }


    if (partner != "") {
      console.log("partner is " + partner);

      socket.broadcast.to(partner).emit('chat message', "someone connected to u - say hi!");
      rooms.push({
        client1: socket.id,
        client2: partner
      });

      delete avl_users[avl_users.indexOf(socket.id)];
      //cleaning the array from empty elements
      avl_users = avl_users.filter(function(x) {
        return (x !== (undefined || null || ''));
      });

      delete avl_users[avl_users.indexOf(partner)];
      //cleaning the array from empty elements
      avl_users = avl_users.filter(function(x) {
        return (x !== (undefined || null || ''));
      });

      ack("exiting current chat room.. found a new person! say hi");

    }
    //no partner found - hit random again in a few minutes
    else {
      ack("exiting current chat room.. no new person found. everyone is busy");
    }
    //rooms.push(avl_users.pop(socket.id));
    console.log('avaliable users  is ' + avl_users);
    if (rooms.length > 0) {
      for (var g = 0; g < rooms.length; g++) {
        console.log('room number is ' + g);
        if (typeof(rooms[g]) != "undefined") {
          console.log('room' + g + ': ' + rooms[g].client1, rooms[g].client2);
        }
        //console.log(rooms.toString());
      }
    } else {
      {
        console.log('all rooms are empty');
      }
    }
  });




});





http.listen(3000, function() {
  console.log('listening on *:3000');
});
