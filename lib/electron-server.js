
var config = require('../config')[process.env.NODE_ENV || 'development']
var server = require('engine.io').listen(config.electron)
var ipcMain = require('electron').ipcMain


module.exports = (win) => {
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
