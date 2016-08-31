
var config = require('../config')[process.env.NODE_ENV || 'development']
var server = require('engine.io').listen(config.ws)
var client = require('engine.io-client')

var cp = require('child_process')
var path = require('path')


server.on('connection', (browser) => {
  var electron

  browser.on('message', (data) => {
    var req = JSON.parse(data)
    console.log(req)

    if (req.message === 'connect') {
      electron = cp.spawn('electron', [config.path])
      electron.stdout.on('data', (e) => {
        var output = e.toString().trim()
        console.log(output)
        if (/electron-server/.test(output)) {
          electron = client('ws://localhost:' + config.electron)
          electron.on('open', () => {
            browser.send(JSON.stringify({message: 'connected'}))
          })
        }
      })
      electron.stderr.on('data', (e) => console.log(e.toString().trim()))
    }
    else {
      electron.on('message', (data) => {
        var req = JSON.parse(data)
        console.log(req)
        browser.send(JSON.stringify(req))
      })
      electron.send(JSON.stringify(req))
    }
  })
})

console.log('ws-server', config.ws, '!')
