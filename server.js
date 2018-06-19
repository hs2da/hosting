var express = require("express");
var path    = require("path");
var app     = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use(express.static(path.join(__dirname + '/public'))); //Serves resources from public folder
/*
var myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};
app.use(myLogger)
*/
app.get('/',function(req,res){
    res.sendFile("index2.html", { root: path.join(__dirname, 'public') })
});

app.get('/main',function(req,res){
    res.sendFile("mainS.html", { root: path.join(__dirname, 'public') })
});

app.post('/main',function(req,res){
    res.redirect('/main');
});

var RoomNum = 1;
var Player = 0;

server.lastPlayderID = 1;

io.on('connection',function(socket){

    socket.on('new_player',function(){
        socket.player = {
            id: server.lastPlayderID++,
            x: 360,
            y: 890
        };
        console.log('id : '+socket.player.id+" player create!");
        socket.broadcast.emit('new_player', socket.player);
        socket.emit('get_allplayer', getAllPlayers(socket.player));

        socket.on('disconnect', function() {
            console.log(socket.player.id+'is disconnected !');
            io.emit('remove',socket.player.id);
        });

    });

    socket.on('move_R',function(){
        console.log('move_R');
        socket.broadcast.emit('move_R', socket.player);
    });

    socket.on('move_L',function(){
        console.log('move_L');
        socket.broadcast.emit('move_L', socket.player);
    });

    socket.on('stop',function(){
        console.log('stop');
        socket.broadcast.emit('stop_p', socket.player);
    });

    socket.on('death',function(){
        console.log(socket.player.id+'is dead !');
        socket.broadcast.emit('death', socket.player.id);
    });

    socket.on('Reset',function(data){
        console.log('All Cleart');
        socket.broadcast.emit('GoMain');
    });
     socket.on('Return',function(){
        console.log('Return');
        socket.broadcast.emit('GoFirst');
    });

    //멀티 플레이 구현을 위한 소켓 연결
    socket.on('ready',function(){
        Player++;
        console.log(Player);
        socket.join(RoomNum);
        socket.emit('roomset',{roomNum:RoomNum,player:Player});
        if(Player%4==0){
            Player=0;
            RoomNum++;
        }
    });

    socket.on('GS',function(data){
        socket.broadcast.to(data.GameRoom).emit('pageMove',{RoomNum:data.GameRoom});
    });
});

server.listen(process.env.PORT || 3000,function(){
    console.log('Listening on '+server.address().port);
});

function getAllPlayers(self){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player && player.id != self.id)
            players.push(player);
    });
   /* for(var i in players.id)
    {
        console.log(players[i].id)+'testsetsetsdfasdf';
    }*/
    return players;
}