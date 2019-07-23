<template>
  <el-container>
    <el-header>
      <div class="controls">
        <el-button type="primary" icon="el-icon-arrow-left" v-on:click="back">Spat</el-button>
        <el-button v-on:click="add">Pridat</el-button>
      </div>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="12">
        <div class="dashboard">
          <el-row>
            <el-col :span="24"><h1 class="bold">{{ zamestnanec.Meno }} {{ zamestnanec.Priezvisko}}</h1></el-col>
          </el-row>
            <el-row>
            <el-col :span="12">
          <h2>Suma celkom:</h2> </el-col><el-col :span="12"> <h1>{{ celkSuma }}</h1>
          </el-col>
          </el-row>
          <el-row>
            <el-col :span="12"><h1>Celkovo preplatene:</h1></el-col>
            <el-col :span="12"><h1>{{celkPrep}}</h1></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"><h1>Mozne preplatit:</h1></el-col>
            <el-col :span="12"><h1>{{ 275 - celkPrep }}</h1></el-col>
          </el-row>          
        </div>
        </el-col>
        <el-col :span="12">
          <div class="dashboard">
            <el-row>
              <el-col :span="12">
                <el-progress type="circle" :percentage="percent"></el-progress>
              </el-col>
              <el-col :span="12">
                <div class="progress">{{ celkPrep }} / 275 </div>
              </el-col>
            </el-row>
          <!-- <div class="bar">
            <div class="progress" v-bind:style="{'background':'#0288d1', 'width':'24'+'%'}"></div>
            <span class="percent">24%</span>
          </div> -->
          </div>
        </el-col>
      </el-row>
      <div class="table">
        <el-table :data="tableData" style="width: 100%" :cell-class-name="tableCellClassName">
          <el-table-column prop="Suma" label="Suma"></el-table-column>
          <el-table-column prop="Preplatene" label="Preplatene"></el-table-column>
          <el-table-column prop="Schvalene" label="Schvalene" width="100"></el-table-column>     
          <el-table-column prop="Poznamka" label="Poznamka"></el-table-column>
          <el-table-column prop="Controls" align="left" class="search">
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
import db from "../scripts/db1.js";

export default {
  name: "doklady",
  props: ["compData"],
  data() {
    return {
      zamestnanec: db.getZamestnanec(this.compData),
      tableData: db.getDoklady(this.compData)
    };
  },
  computed: {
    celkSuma: function() {
      var sum = 0;
      this.tableData.forEach(function(element) {
        //TODO if not number
        if(typeof(element.Suma) === 'number'){
        sum += parseFloat(element.Suma);
        }
      });
      return sum;
    },
    celkPrep: function() {
      var sum = 0;
      this.tableData.forEach(function(element) {
        sum += element.Preplatene;
      });
      return sum;
    },
    percent: function() {
      var perc = this.celkPrep/275;
      return Math.floor(perc*100);
    },
    schvaleneIcon: function(column) {
      console.log("row:",column);
      if(column == "ok"){
        console.log("ok");
      }
      // switch(row) {
      //   case "ok": return "el-icon-success";
      //   default: return "el-icon-error";
      // };
    }
  },
  created() {
    fetchZamData();
    console.log(this.zamestnanec);
  },
  components: {},
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
    updateTable: function() {
      this.tableData = db.getDoklady(this.compData);
    },
    tableCellClassName({row, column, rowIndex, columnIndex}) {
      if(columnIndex === 2){
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
  }
};

function fetchZamData(id) {
  var zamData = db.getZamData(id);
  //console.log(zamData);
  //return zamData;
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
.progress {
  float: left;
  padding: 15px;
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
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>