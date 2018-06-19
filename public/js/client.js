var Client = {};
Client.socket = io.connect();
var RN=-1;
var dec; //구분자
Client.new_p = function(){
    Client.socket.emit('new_player');
};
Client.move_p_Right = function(){
    Client.socket.emit('move_R');
};
Client.move_p_Left = function(){
    Client.socket.emit('move_L');
};
Client.stop_p = function(){
    Client.socket.emit('stop');
};

Client.death_p = function() {
    Client.socket.emit('death');
};

Client.Reset_p = function(room){
    Client.socket.emit('Reset',room);
};

Client.socket.on('new_player',function(new_player){
    console.log(RN);
    if(RN <= new_player.id/4&&new_player.id/4<RN+1)
    {
        //console.log(RN);
        game_Scene.addNewPlayer(new_player.id, new_player.x, new_player.y);
        console.log('newplayer : '+new_player.id);
    }
});


Client.socket.on('remove',function(id){
    console.log(id+'is removed');
    game_Scene.removePlayer(id);
});

Client.socket.on('death',function(id){
    console.log(id+'is killed');
    game_Scene.killPlayer(id);
});

Client.socket.on('get_allplayer',function(other_players){
    console.log('total player : ' + other_players.length);
    for(var i=other_players.length;i>=0;i-=4){
        RN++;
    }
    // console.log(RN);
    // if((other_players.RoomNum/4)<=RN){
    for(var i = RN*4; i < other_players.length; i++)
    {
        console.log('hello');
        game_Scene.addNewPlayer(other_players[i].id, other_players[i].x, other_players[i].y);
    }
    // }
    dec=RN;
    Client.socket.on('move_R',function(player){
        game_Scene.move_p_Right(player.id);
    });
    Client.socket.on('move_L',function(player){
        game_Scene.move_p_Left(player.id);
    });

    Client.socket.on('stop_p',function(player){
        game_Scene.stop_p(player.id);
    });


});
