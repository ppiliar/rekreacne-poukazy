import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';
// import './assets/element-variables.scss'

Vue.use(ElementUI, {locale});
import App from './App.vue';
import { getUserDataPath } from './scripts/controller.js';

import  db from './scripts/db.js'; 
db.init(getUserDataPath());

Vue.config.productionTip = false;

export const bus = new Vue();

new Vue({
  render: h => h(App)
}).$mount('#app')
