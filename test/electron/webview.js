
var ipcRenderer = require('electron').ipcRenderer
require('../../').webview()


ipcRenderer.on('message', (event, req) => {
  if (req.message === 'test') {
    event.sender.send('message', {message: 'test', body: 'webview'})
  }
})
