
var engine = require('engine.io')
var client = require('engine.io-client')
var cp = require('child_process')
var path = require('path')


module.exports = () => {
  var server = engine.listen(process.env.WS_PORT)
  server.on('connection', (browser) => {
    var elserver, electron

    browser.on('message', (data) => {
      var req = JSON.parse(data)
      console.log('ws-server', req)

      if (req.message === 'connect') {
        elserver = cp.spawn(
          path.join(__dirname, '../node_modules/.bin/electron'),
          [process.env.EL_APP], {detached: true})
        elserver.stdout.on('data', (e) => {
          var output = e.toString().trim()
          console.log(output)
          if (/electron-server/.test(output)) {
            electron = client('ws://localhost:' + process.env.EL_PORT)
            electron.on('open', () => {
              browser.send(JSON.stringify({message: 'connected'}))
            })
            electron.on('message', (data) => {
              var req = JSON.parse(data)
              console.log(req)
              console.log('------------------')
              browser.send(JSON.stringify(req))
            })
            electron.on('close', () => setTimeout(() => {
              browser.send(JSON.stringify({message: 'disconnected'}))
              browser.close()
            }, 500))
          }
        })
        elserver.stderr.on('data', (e) => console.log(e.toString().trim()))
      }
      else {
        electron.send(JSON.stringify(req))
      }
    })
  })

  console.log('ws-server-ready', process.env.WS_PORT, '!')
}
