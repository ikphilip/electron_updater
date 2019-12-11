const { app, BrowserWindow, autoUpdater, dialog } = require('electron')
const log = require('electron-log')
const server = 'https://pgc-electron-app.herokuapp.com'
const feed = `${server}/update/${process.platform}/${app.getVersion()}`

log.info('App is starting.')

app.on('ready', () => {
  log.info('App is ready!')

  if (process.env.ENV !== 'development') {
    log.info('Check for updates.')

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
      log.error('There was a problem updating the application')
      log.error(message)
    })

    autoUpdater.setFeedURL(feed)

    // Check once
    autoUpdater.checkForUpdates()
  } else {
    log.info('Will not check for updates.')
  }

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
    webContents.zoomFactor = 1
    webContents.setVisualZoomLevelLimits(1, 1)
    webContents.setLayoutZoomLevelLimits(0, 0)
  })

  window.removeMenu()

  window.loadURL('http://drupal.org')

  window.once('ready-to-show', () => {
    window.show()
  })
})
