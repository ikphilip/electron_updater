const { app, BrowserWindow } = require('electron')
const { autoUpdater } = require('electron-updater')
const log = require('electron-log')

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

app.on('ready', () => {
  log.info('App is ready!')

  autoUpdater.checkForUpdatesAndNotify()

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

  window.loadURL('https://drupal.org')

  window.once('ready-to-show', () => {
    window.show()
  })
})
