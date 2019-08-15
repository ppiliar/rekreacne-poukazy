import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';
// import './assets/element-variables.scss'

Vue.use(ElementUI, {locale});
import App from './App.vue';

// db initialization
// if this is in background, it is not properly loaded before start of vue 
// causing vue to fail load data
import  db from './scripts/db.js'; 
const electron = require('electron');
const userDataPath = (electron.app || electron.remote.app).getPath('userData');
db.init(userDataPath)

Vue.config.productionTip = false;

export const bus = new Vue();

new Vue({
  render: h => h(App)
}).$mount('#app')
