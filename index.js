const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron')

app.on('ready', () => {
  const window = new BrowserWindow({
    fullscreen: false,
    height: 600,
    show: false,
    webPreferences: {
      experimentalFeatures: true,
      webSecurity: false
    },
    width: 800
  })

  const { webContents } = window

  webContents.on('did-finish-load', () => {
    webContents.setZoomFactor(1)
    webContents.setVisualZoomLevelLimits(1, 1)
    webContents.setLayoutZoomLevelLimits(0, 0)
  })

  window.removeMenu()

  window.loadURL('https://interactiveknowledge.com')

  window.once('ready-to-show', () => {
    window.show()
  })
})
