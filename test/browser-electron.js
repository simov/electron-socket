
/*
  1. admin: start Electron process (ws)
  2. user: connect a web socket to it (browser)
  3. electron: load the webview and wait for it to load
  4. electron: send `connect` message back to the electron-server
  5. electron: write to stdout to indicate that the electron-server is ready
*/

var config = require('../config')[process.env.NODE_ENV || 'development']
var t = require('assert')
var path = require('path')
var cp = require('child_process')
var engine = require('engine.io-client')


describe('browser-electron', () => {
  var server, client

  before((done) => {
    server = cp.spawn('electron',
      [path.join(process.cwd(), 'test/electron/')], {detached: true})
    server.stdout.on('data', (e) => {
      var output = e.toString().trim()
      console.log(output)

      if (/electron-server/.test(output)) {
        client = engine('ws://localhost:' + config.electron)
        client.on('open', () => done())
      }
    })

    server.stderr.on('data', (e) => console.log(e.toString().trim()))
  })

  it('send message', (done) => {
    client.send(JSON.stringify({message: 'test'}))

    client.once('message', (req) => {
      t.deepEqual(JSON.parse(req), {message: 'test', body: 'webview'})
      done()
    })
  })

  after(() => process.kill(-server.pid))
})
