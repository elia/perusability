var port = process.env.PORT || 3000;



// SCRAPING
var request = require('request');
var url = require('url');
var jsdom = require('jsdom');
var jquery_uri = 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js';
var sugar_uri = 'http://sugarjs.com/download';

function scrape(uri) {
  request({uri: uri}, function(error, response, body){
    if (error && response.statusCode !== 200) { return false; };
    
    var title, body;
    jsdom.env({
      html: body,
      scripts: [jquery_uri, sugar_uri]
    }, function (error, window) {
      var $ = window.jQuery;
      title = $('h1')[0] || $('h2')[0];
      body = $('p')[0];
    });
    
    return {title: title, body: body};
  });
}



// EXPRESS

var express = require('express');
var app = express.createServer(express.logger());

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});




// SOCKET IO

var io = require('socket.io').listen(app)
var fs = require('fs')

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('peruse-page', function (data) {
    console.log(data);
    socket.emit('new-contents', scrape(data.uri));
  });
});

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});





// GO!

app.listen(port, function() {
  console.log("Listening on " + port);
});


