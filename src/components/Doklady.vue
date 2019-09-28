<template>
  <el-container>
    <el-header>
      <div class="controls">
        <el-button type="primary" icon="el-icon-arrow-left" v-on:click="back">Späť</el-button>
        <el-button v-on:click="add" icon="el-icon-plus">Pridať</el-button>
      </div>
      <div class="controls-right">
        <el-button v-on:click="print" icon="el-icon-printer">Tlačiť</el-button>
      </div>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="12">
        <div class="dashboard">
          <el-row>
            <el-col :span="24"><h1 class="bold">{{ zamestnanec.Meno }} {{ zamestnanec.Priezvisko}}</h1></el-col>
          </el-row>
            <el-row :gutter="10">
            <el-col :span="16"><h2>Cena zájazdov celkom:</h2></el-col>
            <el-col :span="8"> <h1>{{ celkSuma }}</h1>
          </el-col>
          </el-row >
          <el-row :gutter="10">
            <el-col :span="16"><h1>Celkovo preplatene:</h1></el-col>
            <el-col :span="8"><h1>{{celkPrep}}</h1></el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="16"><h1>Možné preplatiť:</h1></el-col>
            <el-col :span="8"><h1>{{ moznePrep }}</h1></el-col>
          </el-row>          
        </div>
        </el-col>
        <el-col :span="12">
          <div class="dashboard">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-progress type="circle" :percentage="percent"></el-progress>
              </el-col>
              <el-col :span="12">
                <div class="progress">{{ celkPrep }} / 275</div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <div class="table">
        <el-table :data="tableData" style="width: 100%" :cell-class-name="tableCellClassName">
          <el-table-column prop="Suma" label="Cena zájazdu" width="100" :formatter="sumaFormatter"></el-table-column>
          <el-table-column prop="Datum" label="Dátum schválenia" width="100"></el-table-column>
          <el-table-column prop="Preplatene" label="Preplatené" width="100" :formatter="prepFormatter"></el-table-column>
          <el-table-column prop="Schvalene" label="Schválené" width="100"></el-table-column>     
          <el-table-column class="poznamka" prop="Poznamka" label="Poznámka" width="200"></el-table-column>
          <el-table-column prop="Controls" align="right">
            <template v-slot:header>
              <el-select v-model="rok" size="small">
                <el-option
                v-for="item in roky"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
              </el-select>
            </template>
            <template v-slot="scope">
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
import { bus } from "../main.js";
import db from "../scripts/db.js";

export default {
  name: "doklady",
  props: ["compData"],
  data() {
    return {
      zamestnanec: db.getZamestnanec(this.compData),
      tableData: "",
      rok: this.getCurrentYear()
    };
  },
  computed: {
    celkSuma: function() {
      var sum = 0;
      this.tableData.forEach(function(element) {
        if(typeof(element.Suma) === 'number'){
        sum += parseFloat(element.Suma);
        }
      });
      return sum.toFixed(2);
    },
    celkPrep: function() {
      var sum = 0;
      this.tableData.forEach(function(element) {
        sum += element.Preplatene;
      });
      return parseFloat(sum).toFixed(2);
    },
    moznePrep: function() {
      var sum = 275 - this.celkPrep;
      return sum.toFixed(2);
    },
    percent: function() {
      var perc = this.celkPrep/275;
      return Math.floor(perc*100);
    },
    roky: function() {
      var currentYear = new Date().getFullYear(), years = [];
      var startYear = 2019;  
      while ( startYear <= currentYear ) {
          years.push(startYear++);
      }   
      return years;
    }
  },
  watch:{
    rok: function() {
        this.updateTable();
    }
  },
  created: function(){
    this.tableData = db.getDoklady(this.compData, this.rok);
  },
  methods: {
    back: function() {
      bus.$emit("switchComp", "Zamestnanci");
    },
    add: function() {
      bus.$emit("switchComp", "DokladyAdd", this.compData);
    },    
    remove: function(id) {
      db.removeDoklad(id);
      this.updateTable();
    },
    edit: function(id) {
      var data = { zamId: this.compData, dokladId: id };
      bus.$emit("switchComp", "DokladyEdit", data);
    },
    print: function() {
      const ipc = require('electron').ipcRenderer;
      ipc.send('print-to-pdf');
    },
    updateTable: function() {
      this.tableData = db.getDoklady(this.compData, this.rok);
    },
    tableCellClassName({row, column, rowIndex, columnIndex}) {
      if(column.label === "Schválené"){
        switch(row.Schvalene){
          case "Schválené": return 'success';
          case "Čakajúce": return 'warning';
          case "Zamietnuté": return 'error';
          default: break;
        }
      }
    },
    tableRowClassName({ row }) {
      switch(row.Schvalene){
        case "Schválené": return 'success-row';
        case "Čakajúce": return 'warning-row';
        case "Zamietnuté": return 'error-row';
        default: break;
      }
    },
    getCurrentYear: function() {
      return new Date().getFullYear();
    },
    sumaFormatter: function(row, column) {
      return parseFloat(row.Suma).toFixed(2);
    },
    prepFormatter: function(row, column) {
      return parseFloat(row.Preplatene).toFixed(2);
    }
  }
};

function fetchZamData(id) {
  var zamData = db.getZamData(id);
}
</script>

<style>
.dashboard {
  height: 140px;
  padding: 10px 20px 10px 20px;
  background-color: #fff;
  box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.1);
}
.table {
  margin-top: 20px;
  padding: 5px 20px 10px 20px;
  background-color: #fff;
  box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.1);
}
.el-form {
  margin-top: 10px;
}
.el-row {
  margin-bottom: 0px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  display: flex;
  text-align: left;
  align-items: left;
  line-height: 60px;
}
/* nerozdelovat slova na konci riadku */
.el-table .cell {
  word-break: break-word;
}
.el-table .el-header {
  word-break: break-word;
}

.input-label {
  display: inline-block;
  width: 130px;
}
.box {
  width: 100px;
  padding: 40px;
  margin: 50px auto;
  background: #f3f3f3;
  box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.1);
}
.bar {
  width: 100%;
  background: #dfdfdf;
  overflow: hidden;
  padding: 5px;
}
.percent {
  float: right;
  font-weight: 600;
  height: 30px;
  line-height: 30px;
}
.el-table .warning {
  background: #FFFFCC;
}

.el-table .success {
  background: #f0f9eb;
}
.el-table .error {
  background: #FFA8A8;
}
.bold {
  font-weight: bold;
}
.progress {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  padding: 15px;
}
.el-input__icon{
  width:35px;
}
.controls-right {
  width: 100%;
  display:flex;
  justify-content: flex-end;
  align-items: center;
}
</style>