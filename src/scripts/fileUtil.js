const path = require('path');
const fs = require('fs');

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

export default function checkDataFiles(userDataPath){
    var dataFolder = path.join(userDataPath,"data");
    ensureExists(dataFolder, (err) => {
        if (err) throw err;
    });
}