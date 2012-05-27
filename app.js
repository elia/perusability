var port = process.env.PORT || 3000;
var log = console.log;


// SCRAPING
var jsdom = require('jsdom');
var jquery_uri = 'http://code.jquery.com/jquery-1.5.min.js';

jsdom.defaultDocumentFeatures = {
  FetchExternalResources   : false,
  ProcessExternalResources : false,
  MutationEvents           : false,
  QuerySelector            : false
};

var scrape = function(uri, callback) {
  console.log('SCRAPING: ', uri);
  
  var _title, _body;
  jsdom.env("<html><body><h1>Ciao</h1><p>mondo!</p></body></html>", [jquery_uri], function (errors, window) {
    // _title = window.$('h1').first().text();
    // _body  = window.$('p').first().text();
    // log('FOUND:', _title, _body);
    // callback({title: _title, body: _body});
    log('1');
    // _body = window.document.body.innerHTML;
    callback({title: 'Ciao', body: 'mondo', _body: _body});
    log('2')
  });
  callback({title: 'Ciao', body: 'mondo', _body: _body});
  callback({title: 'Ciao', body: 'mondo', _body: _body});
};



// EXPRESS

var express = require('express');
var app = express.createServer(express.logger());

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});




// SOCKET IO

var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
  socket.on('peruse-page', function (data) {
    console.log(data);
    scrape(data.uri, function(contents) {
      log('CONTENTS:', contents);
      socket.emit('new-contents', contents);
    });
  });
});






// GO!

app.listen(port, function() {
  console.log("Listening on " + port);
});


