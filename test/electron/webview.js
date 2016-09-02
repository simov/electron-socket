
var ipcRenderer = require('electron').ipcRenderer
require('../../').webview()


ipcRenderer.on('message', (event, req) => {
  event.sender.send('message', {message: req.message, body: 'webview'})
})
