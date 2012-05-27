port = process.env.PORT or 3000
log = console.log
jsdom = require("jsdom")
jquery_uri = "http://code.jquery.com/jquery-1.5.min.js"
jsdom.defaultDocumentFeatures =
  FetchExternalResources: false
  ProcessExternalResources: false
  MutationEvents: false
  QuerySelector: false

scrape = (uri, callback) ->
  console.log "SCRAPING: ", uri
  _title = undefined
  _body = undefined
  jsdom.env "<html><body><h1>Ciao</h1><p>mondo!</p></body></html>", [ jquery_uri ], (errors, window) ->
    log "1"
    callback title: "Ciao", body: "mondo", _body: _body
    log "2"

  callback title: "Ciao", body: "mondo", _body: _body

express = require("express")
app = express.createServer(express.logger())
app.configure ->
  app.use express.static(__dirname + "/public")

io = require("socket.io").listen(app)
io.sockets.on "connection", (socket) ->
  socket.on "peruse-page", (data) ->
    console.log data
    scrape data.uri, (contents) ->
      log "CONTENTS:", contents
      socket.emit "new-contents", contents


// GO!!!
app.listen port, ->
  console.log "Listening on " + port
