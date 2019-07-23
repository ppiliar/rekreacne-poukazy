
// appData initialization
import checkDataFiles from './fileUtil.js';
import { init } from "./add.js"

const electron = require('electron');
checkDataFiles(getUserDataPath());

//console.log("appData: "+ electron.remote.app.getPath('appData'));

export function getUserDataPath(){
  const userDataPath = (electron.app || electron.remote.app).getPath('userData');
  return userDataPath;
}

export function createWindow(){
  init();
}