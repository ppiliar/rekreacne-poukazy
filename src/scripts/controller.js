
// appData initialization
import checkDataFiles from './fileUtil.js';

const electron = require('electron');
checkDataFiles(getUserDataPath());

export function getUserDataPath(){
  const userDataPath = (electron.app || electron.remote.app).getPath('userData');
  return userDataPath;
}