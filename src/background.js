'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import db from './scripts/db';
const isDevelopment = process.env.NODE_ENV !== 'production'

// const used for pdf print
const path = require('path')
const fs = require('fs')
const os = require('os')
const electron = require('electron')
const ipc = electron.ipcMain
const shell = electron.shell

// Change default appData location to startup location of portable app
import { createPortableAppDataFolder, copyFromRoaming } from './scripts/fileUtil'
if(!isDevelopment){
  let portablePath = path.join(process.env.PORTABLE_EXECUTABLE_DIR, "rekreacne-data")
  createPortableAppDataFolder(portablePath)
  copyFromRoaming(app.getPath('userData'), portablePath) // copy exitsing db from not portable installation
  app.setPath("appData", portablePath)
  app.setPath("userData", portablePath)
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])


function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 900, height: 600, 
    title: 'Rekreačné poukazy',
    webPreferences: {
    nodeIntegration: true,
    devTools: isDevelopment //disable devTools in production build
  } })

  win.on('page-title-updated', (evt) => {
    evt.preventDefault();
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    win.setMenu(null)
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
    db.close()
    app.quit()
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}


ipc.on('print-to-pdf', function(event) {
  const pdfPath = path.join(os.tmpdir(), 'print.pdf');
  const win = BrowserWindow.fromWebContents(event.sender);

  win.webContents.printToPDF({}, function(error, data){
      if(error) return console.log(error.message);

      fs.writeFile(pdfPath, data, function(err) {
          if(err) return console.log(err.message);
          shell.openExternal('file://'+pdfPath);
          event.sender.send('wrote-pdf', pdfPath);
      })
  })
});