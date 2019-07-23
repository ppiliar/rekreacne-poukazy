<template>
  <el-container direction="vertical">
    <el-header>
      <div class="controls">
        <el-button class="control-button" v-on:click="add">Pridat</el-button>
        <!-- <el-button class="control-button" v-on:click="refresh">Refresh</el-button>
        <el-button class="control-button" v-on:click="removeAll">Remove All</el-button> -->
      </div>
    </el-header>
    <el-main>
      <div class="table">
        <!-- TODO: update this filter -->
        <el-table
          :data="tableData.filter(data => !search || data.Priezvisko.toLowerCase().includes(search.toLowerCase()) || data.Meno.toLowerCase().includes(search.toLowerCase()))"
          style="width: 100%"
        >
          <el-table-column prop="Meno" label="Meno" width="180"></el-table-column>
          <el-table-column prop="Priezvisko" label="Priezvisko" width="180"></el-table-column>
          <!-- <el-table-column prop="ID" label="Id" style="display:none;"></el-table-column> -->
          <el-table-column prop="Controls" align="left" class="search">
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
import { DbModel } from "../scripts/db.js";
import { getUserDataPath, createWindow } from "../scripts/controller.js";
import { bus } from "../main.js";

const db = new DbModel(getUserDataPath());
//var result = db.getAll();
//console.log(result);

export default {
  name: "zamestnanci",
  data() {
    return {
      tableData: db.getAll(),
      search: ""
    };
  },
  watch: {
    tableData: function(value) {
      console.log("result changed");
    }
  },
  methods: {
    add: function() {
      bus.$emit("switchComp", "ZamestnanciAdd");
    },
    edit: function(id){ 
      bus.$emit("switchComp", "ZamestnanciEdit", id);
    },
    refresh: function() {
      console.log(db.getAll());
      this.updateTable();
    },
    removeAll: function() {
      db.removeAll();
      this.updateTable();
    },
    remove: function(id) {
      db.remove(id);
      this.updateTable();
    },
    doklady: function(id) {
      bus.$emit("switchComp", "Doklady", id);
      console.log("doklady");
    },
    updateTable: function() {
      this.tableData = db.getAll();
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

