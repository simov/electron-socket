
var config = require('../config')[process.env.NODE_ENV || 'development']
var engine = require('engine.io')
var ipcMain = require('electron').ipcMain


module.exports = (win) => {
  var server = engine.listen(config.electron)
  var socket

  server.on('connection', (sock) => {
    socket = sock // currently supports only a single connection
    socket.on('message', (data) => {
      var req = JSON.parse(data)
      console.log(req)
      win.webContents.send('message', req)
    })
  })

  ipcMain.on('message', (event, req) => {
    if (req.message === 'connect') {
      // confirm that the server is ready
      console.log('electron-server', config.electron, '!')
    }
    else {
      socket.send(JSON.stringify(req))
    }
  })
}
