
var electron = require('electron')
var app = electron.app
var BrowserWindow = electron.BrowserWindow
var ipcMain = electron.ipcMain
var server = require('../../lib/electron-server')
var win = null


app.on('ready', () => {
  win = new BrowserWindow({})
  win.webContents.session.clearCache(() => {
    win.maximize()
    win.loadURL('file://' + __dirname + '/index.html')
    win.webContents.openDevTools()
    win.on('closed', () => (win = null))
  })
})

ipcMain.on('message', (event, req) => {
  if (req.message === 'connect') {
    server(win)
  }
})
