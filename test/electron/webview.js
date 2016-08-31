
var ipcRenderer = require('electron').ipcRenderer


var onload = () => {
  console.log('webview onload')
  webview = document.querySelector('#page')

  webview.addEventListener('did-stop-loading', () => {
    console.log('did-stop-loading')
    // to clear cookies
    // webview.openDevTools()
    ipcRenderer.send('message', {message: 'connect'})
  })
}

ipcRenderer.on('message', (event, req) => {
  if (req.message === 'test') {
    event.sender.send('message', {message: 'test', body: 'webview'})
  }
})
