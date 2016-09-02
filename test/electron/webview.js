
var ipcRenderer = require('electron').ipcRenderer
require('../../').webview()


ipcRenderer.on('message', (event, req) => {
  console.log('webview', req)
  event.sender.send('message', {message: req.message, body: 'webview'})
})
