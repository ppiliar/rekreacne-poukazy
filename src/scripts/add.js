const about = module.exports = {
    init,
    win: null
}

const electron = require('electron')
const path = require('path')

function init() {
    if (about.win) {
        return about.win.show()
    }

    const win = about.win = new electron.remote.BrowserWindow({
        backgroundColor: '#ECECEC',
        center: true,
        fullscreen: false,
        height: 170,
        maximizable: false,
        minimizable: false,
        resizable: false,
        show: false,
        skipTaskbar: true,
        title: 'About ',
        useContentSize: true,
        width: 300
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        // Load the index.html when not in development
        //createProtocol('app');
        //win.loadURL('app://./index.html');
        console.log(__dirname);
        console.log(path.join(__static, '.', 'index.html'));
        console.log(path.join(__dirname,'..','static','index.html'));
        
        win.loadURL('file://' + path.join(__static, '.', 'add.html'));
        const renderPridanie = require('../main.js');
        renderPridanie();
    }

    //win.loadURL('file://' + path.join(__dirname,'..','index.html'))

    // No menu on the About window
    win.setMenu(null)

    win.once('ready-to-show', function () {
        win.show()
    })

    win.once('closed', function () {
        about.win = null
    })
}
