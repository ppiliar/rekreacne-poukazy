<template>
  <div id="app">
    <el-container>
      <el-aside width="0px">
      </el-aside>
      <el-container id="container">
        <component :is="currentComp" v-bind:compData="componentData"></component>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Zamestnanci from './components/Zamestnanci.vue'
import ZamestnanciAdd from './components/ZamestnanciAdd.vue'
import ZamestnanciEdit from './components/ZamestnanciEdit.vue'
import Doklady from './components/Doklady.vue'
import DokladyEdit from './components/DokladyEdit.vue'
import DokladyAdd from './components/DokladyAdd.vue'
import { bus } from './main.js'
import 'reset-css'

export default {
  name: 'app',
  data() {
    return {
      currentComp: 'Zamestnanci',
      componentData: ''
    };
  },
  created() {
      bus.$on('switchComp', (comp,data) => {
           this.currentComp = comp;
           this.componentData = data;
      });
  },
  components: {
    Zamestnanci,
    ZamestnanciAdd,
    ZamestnanciEdit,
    Doklady,
    DokladyAdd,
    DokladyEdit
  },
  methods: {
  }
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.container {
  max-width: 1200px;
  margin: auto;
}

.el-aside {
  background: #545c64;
  color: white;
  min-height: 100vh;
}

.logo-container {
  padding: 22px;
  background: #434A50;
}

.el-menu {
  border-right: 0 !important;
}

.el-main {
  background: #EEF1F4;
}

.breadcrumb-container {
  margin-top: 20px;
  margin-bottom: 40px;
}

.button-container {
  margin-top: 20px;
}
</style>
