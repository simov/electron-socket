
/*
  1. admin: start a web-server (ws)
  2. user: connect a web socket to it (browser)
  3. user: send a `connect` message
  4. server: spawn Electron process on `connect` message
  5. electron: load the webview and wait for it to load
  6. electron: send `connect` message back to the electron-server
  7. electron: write to stdout to indicate that the electron-server is ready
  8. server: on electron-server ready, connect a web socket to it
  9. server: after ws connection is established send back a `connected` message to the user
*/

var config = require('../config')[process.env.NODE_ENV || 'development']
var t = require('assert')
var path = require('path')
var cp = require('child_process')
var engine = require('engine.io-client')


describe('browser-server-electron', () => {
  var server, client

  before((done) => {
    server = cp.spawn('node', [path.join(process.cwd(), 'lib/ws-server')])
    server.stdout.on('data', (e) => {
      var output = e.toString().trim()
      console.log(output)

      if (/ws-server/.test(output)) {
        client = engine('ws://localhost:' + config.ws)
        client.on('open', () => done())
      }
    })

    server.stderr.on('data', (e) => console.log(e.toString().trim()))
  })

  it('connect', (done) => {
    client.send(JSON.stringify({message: 'connect'}))

    client.once('message', (req) => {
      t.deepEqual(JSON.parse(req), {message: 'connected'})
      done()
    })
  })

  it('send message', (done) => {
    client.send(JSON.stringify({message: 'test'}))

    client.once('message', (req) => {
      t.deepEqual(JSON.parse(req), {message: 'test', body: 'webview'})
      done()
    })
  })

  after((done) => {
    server.kill('SIGHUP')
    done()
  })
})
