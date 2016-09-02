
var engine = require('engine.io')
var ipcMain = require('electron').ipcMain


module.exports = (win) => {
  var server = engine.listen(process.env.EL_PORT)
  var socket

  server.on('connection', (sock) => {
    socket = sock // currently supports only a single connection
    socket.on('message', (data) => {
      var req = JSON.parse(data)
      console.log('el-server', req)
      win.webContents.send('message', req)
    })
  })

  ipcMain.on('message', (event, req) => {
    if (req.message === 'connect') {
      // confirm that the server is ready
      console.log('electron-server-ready', process.env.EL_PORT, '!')
    }
    else if (req.message === 'disconnect') {
      win.close()
      server.close()
    }
    else {
      socket.send(JSON.stringify(req))
    }
  })
}
