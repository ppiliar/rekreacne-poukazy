import { createWriteStream } from 'fs';

const path = require('path');
const fs = require('fs');
//const app = require('electron').remote.app;

function ensureExists(path, mask, cb) {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = '0777';
    }
    fs.mkdir(path, mask, function(err) {
        if (err) {
            if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
            else cb(err); // something else went wrong
        } else cb(null); // successfully created folder
    });
}

export function checkDataFiles(userDataPath){
    var dataFolder = path.join(userDataPath,"data");
    ensureExists(dataFolder, (err) => {
        if (err) throw err;
    });
}

export function createPortableAppDataFolder(portableAppDataPath) {
    var dataFolder = path.join(portableAppDataPath);
    ensureExists(dataFolder, (err) => {
        if (err) throw err;
    });
}

export function copyFromRoaming(userDataPath, portableAppDataPath) {
    let dbPath = path.join(userDataPath, "data", "rekredb.db"); 
    let newPath = path.join(portableAppDataPath, "rekredb.db");
    
    if (!fs.existsSync(newPath) && fs.existsSync(dbPath)) {
        fs.copyFile(dbPath, newPath, (err) => {
            if(err) throw err;
            console.log("Db copied to portable location")
        })
    }
}

//TODO move async dialog to background.js or make async call writing after finished
export async function writeFile(fileName, data) {
    const electron = require('electron').remote;
    const app = electron.app;
    const dialog = electron.dialog;
    const mainWindow = electron.mainWindow;

    const filePath = path.join(app.getPath("desktop"), fileName);
    const result = await dialog.showSaveDialog(mainWindow, { 
        defaultPath: filePath 
    });

    //How to writeFile multiple times 
    const file = fs.createWriteStream(result.filePath);
    file.write(data);
    file.end();
    file.close();
    //TODO create callback for writeFile function
    /*file.writeFile(result.filePath, data, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); */
}