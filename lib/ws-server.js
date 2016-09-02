
var config = require('../config')[process.env.NODE_ENV || 'development']
var engine = require('engine.io')
var client = require('engine.io-client')

var cp = require('child_process')
var path = require('path')


module.exports = () => {
  var server = engine.listen(config.ws)
  server.on('connection', (browser) => {
    var elserver, electron

    browser.on('message', (data) => {
      var req = JSON.parse(data)
      console.log(req)

      if (req.message === 'connect') {
        elserver = cp.spawn('electron', [config.path], {detached: true})
        elserver.stdout.on('data', (e) => {
          var output = e.toString().trim()
          console.log(output)
          if (/electron-server/.test(output)) {
            electron = client('ws://localhost:' + config.electron)
            electron.on('open', () => {
              browser.send(JSON.stringify({message: 'connected'}))
            })
          }
        })
        elserver.stderr.on('data', (e) => console.log(e.toString().trim()))
      }
      else if (req.message === 'disconnect') {
        process.kill(-elserver.pid)
        browser.send(JSON.stringify({message: 'disconnected'}))
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
}
