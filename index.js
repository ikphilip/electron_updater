const log = require('electron-log')

if (require('electron-squirrel-startup')) {
  log.info('Is true')
  return
} else {
  log.info('is not true')
}

const { app, BrowserWindow, autoUpdater, dialog } = require('electron')
const server = 'https://pgc-electron-app.herokuapp.com'
const feed = `${server}/update/${process.platform}/${app.getVersion()}`

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    log.info('No flags')
    return false;
  }

  log.info('flags found', process.argv)

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
};

log.info('App is starting.')

app.on('ready', () => {
  log.info('App is ready!')

  if (process.env.ENV !== 'development') {
    log.info('Check for updates.')

    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
      log.info('Release ' + releaseName + ' will be installed the next time the app starts.', releaseNotes)
    })

    autoUpdater.on('update-available', () => {
      log.info('Update is available.')
    })

    autoUpdater.on('update-not-available', () => {
      log.info('No update available.')
    })

    autoUpdater.on('error', message => {
      log.error('There was a problem updating the application.')
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

  window.loadURL('http://ubuntu.com')

  window.once('ready-to-show', () => {
    window.show()
  })
})
