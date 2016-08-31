
var config = require('../config')[process.env.NODE_ENV || 'development']
var server = require('engine.io').listen(config.electron)
var ipcMain = require('electron').ipcMain


module.exports = (win) => {

  server.on('connection', (socket) => {

    socket.on('message', (data) => {
      var req = JSON.parse(data)
      console.log(req)
      win.webContents.send('message', req)
    })

    ipcMain.on('message', (event, req) => {
      socket.send(JSON.stringify(req))
    })

  })

  console.log('electron-server', config.electron, '!')
}
