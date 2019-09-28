<template>
  <el-container direction="vertical">
    <el-header>
      <div class="controls">
        <el-button class="control-button" v-on:click="add" icon="el-icon-plus">Pridať</el-button>
      </div>
    </el-header>
    <el-main>
      <div class="table">
        <!-- TODO: update this filter -->
        <el-table
          :data="tableData.filter(data => !search || data.Priezvisko.toLowerCase().includes(search.toLowerCase()) || data.Meno.toLowerCase().includes(search.toLowerCase()))"
          :default-sort="{prop: 'Priezvisko', order: 'ascending'}"
          style="width: 100%"
        >
          <el-table-column prop="Meno" label="Meno" width="180" sortable :sort-method="sortMeno"></el-table-column>
          <el-table-column prop="Priezvisko" label="Priezvisko" width="180" sortable :sort-method="sortPriezvisko"></el-table-column>
          <el-table-column prop="Controls" align="right" class="search">
            <template v-slot:header>
              <el-input v-model="search" size="mini" placeholder="Vyhľadať"/>
            </template>
            <template v-slot="scope">
              <el-button type="primary" icon="el-icon-document" circle v-on:click="doklady(scope.row.ID)"></el-button>
              <el-button type="warning" icon="el-icon-edit" circle v-on:click="edit(scope.row.ID)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle v-on:click="remove(scope.row.ID)"></el-button>
            </template>

          </el-table-column>
        </el-table>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import db from "../scripts/db.js";
import { bus } from "../main.js";

export default {
  name: "zamestnanci",
  data() {
    return {
      tableData: db.getZamestnanci(),
      search: ""
    };
  },
  methods: {
    add: function() {
      bus.$emit("switchComp", "ZamestnanciAdd");
    },
    edit: function(id){ 
      bus.$emit("switchComp", "ZamestnanciEdit", id);
    },
    remove: function(id) {
      let zam = db.getZamestnanec(id);
      let msg = zam.Meno + " " + zam.Priezvisko;
      this.deleteBox(id, msg);
    },
    doklady: function(id) {
      bus.$emit("switchComp", "Doklady", id);
    },
    updateTable: function() {
      this.tableData = db.getZamestnanci();
    },
    deleteBox: function(id, msg) {
      const {remote} = require('electron')
      const dialog   = remote.dialog

      let win = remote.getCurrentWindow()

      let options = {}
      options.buttons = ["&Áno","&Nie"]
      options.message = "Naozaj odstrániť " + msg;
      dialog.showMessageBox(win, options, res => {
        if (res === 0) {
          db.removeZamestnanec(id);
          this.updateTable();
        }
      })
    },
    sortMeno: function(a, b) {
      return a.Meno.localeCompare(b.Meno, "sk");
    },
    sortPriezvisko: function(a, b) {
      return a.Priezvisko.localeCompare(b.Priezvisko, "sk");
    }
  }
};
</script>

<style>
.table{
  padding: 5px 20px 10px 20px;
  background-color: #fff;
}
.control-button {
  float: left;
  border: 1px solid gray;
  margin: 0 auto;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-main {
  height: 100%;
}
.el-input {
  width: 180px;
}
.search {
  align-items: left;
}
.controls {
  height: 100%;
  display: flex;
  align-items: center;
}
</style>

