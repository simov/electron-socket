
var ipcRenderer = require('electron').ipcRenderer


module.exports = () => {

  window.addEventListener('DOMContentLoaded', function (e) {
    console.log('webview onload')
    var webview = document.querySelector('#electron-socket')

    webview.addEventListener('did-stop-loading', function (e) {
      console.log('did-stop-loading')
      // to clear cookies
      // webview.openDevTools()
      ipcRenderer.send('message', {message: 'connect'})
      // one-time event
      e.target.removeEventListener(e.type, arguments.callee)
    })

    // one-time event
    e.target.removeEventListener(e.type, arguments.callee)
  })
}
