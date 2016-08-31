
var config = require('../config')[process.env.NODE_ENV || 'development']
var server = require('engine.io').listen(config.ws)
var engine = require('engine.io-client')

var cp = require('child_process')
var path = require('path')


server.on('connection', (socket) => {
  var client

  socket.on('message', (message) => {
    var req = JSON.parse(message)
    console.log(req)

    if (req.message === 'connect') {
      electron = cp.spawn('electron', [config.path])
      electron.stdout.on('data', (e) => {
        var output = e.toString().trim()
        console.log(output)
        if (/electron-server/.test(output)) {
          client = engine('ws://localhost:' + config.electron)
          client.on('open', () => socket.send(JSON.stringify({message: 'connected'})))
        }
      })
      electron.stderr.on('data', (e) => console.log(e.toString().trim()))
    }
    else {
      client.on('message', (message) => {
        var req = JSON.parse(message)
        console.log(req)
        socket.send(JSON.stringify(req))
      })
      client.send(JSON.stringify(req))
    }
  })
})

console.log('ws-server', config.ws, '!')
