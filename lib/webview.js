
var ipcRenderer = require('electron').ipcRenderer


module.exports = () => {

  window.addEventListener('DOMContentLoaded', (e) => {
    console.log('webview onload')
    var webview = document.querySelector('#electron-socket')

    webview.addEventListener('did-stop-loading', () => {
      console.log('did-stop-loading')
      // to clear cookies
      // webview.openDevTools()
      ipcRenderer.send('message', {message: 'connect'})
    })
  })
}
