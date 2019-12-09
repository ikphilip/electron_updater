const { app, BrowserWindow, autoUpdater, dialog } = require('electron')
const server = 'https://pgc-electron-app.heroku.com'
const feed = `${server}/update/${process.platform}/${app.getVersion()}`

if (process.env.ENVIRONMENT === 'production') {
  autoUpdater.setFeedURL(feed)

  setInterval(() => {
    console.log('Checking...')
    autoUpdater.checkForUpdates()
  }, 60000)

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
  })

  autoUpdater.on('error', message => {
    console.error('There was a problem updating the application')
    console.error(message)
  })
}

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
