<template>
  <el-container>
    <el-header>
      <div class="controls">
        <el-button type="primary" icon="el-icon-arrow-left" v-on:click="back">Späť</el-button>
      </div>
    </el-header>
    <el-main>
      <el-form :model="doklad" :rules="rules" ref="doklad" @submit.native.prevent>
        <el-form-item label="Cena zájazdu" prop="Suma">
          <el-input
            type="number"
            min="0"
            step="0.01"
            v-model="doklad.Suma"
            v-on:blur="formatSuma()"
            v-on:submit="formatSuma()"
            placeholder="Suma"
            @keyup.enter.native="submitForm('doklad')"
            autofocus
          ></el-input>
        </el-form-item>
        <el-form-item label="Možné preplatiť" prop="preplatene">
          <el-input type="number"
            min="0"
            step="0.01"
            v-model.number="preplatene"></el-input>
            <!-- <i id="refresh" class="el-icon-refresh" v-on:click="setPrep"></i> -->
        </el-form-item>
        <el-form-item>
          <div>
            <el-radio-group v-model="doklad.Schvalene">
              <el-radio-button label="Schválené">Schválené</el-radio-button>
              <el-radio-button label="Čakajúce">Čakajúce</el-radio-button>
              <el-radio-button label="Zamietnuté">Zamietnuté</el-radio-button>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="doklad.Datum" format="dd/MM/yyyy" value-format="dd/MM/yyyy">
          </el-date-picker>
        </el-form-item>
         <el-form-item label="Poznámka">
          <el-input type="textarea" v-model="doklad.Poznamka"></el-input>
        </el-form-item>
        <el-form-item label="Rok">
          <el-select v-model="doklad.Rok">
                <el-option
                v-for="item in roky"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
              </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="submitForm('doklad')">Uložiť</el-button>
        </el-form-item>
      </el-form>
      <el-row id="alerts">
        <el-alert
          ref="alert"
          :title="alert.title"
          :type="alert.type"
          show-icon
          v-show="alert.showAlert"
        ></el-alert>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { bus } from "../main.js";
import db from "../scripts/db.js";
import { clearInterval } from "timers";

export default {
  name: "dokladyAdd",
  props: ["compData"],
  data() {
    var checkSuma = (rule, value, callback) => {
      if(!value){ return callback(new Error("Zadaj číslo")); }
      if (value < 0) {
        return callback(new Error("Číslo nemôže byť záporné"));
      } else {
        callback();
      }
    };
    var checkPreplatene = (rule, value, callback) => {
      if (value === "") { return callback(new Error("Zadaj číslo")); }
      if (value > (round(this.doklad.Suma*0.55))) {
        console.log(value);
        console.log(this.doklad.Suma + "*"+0.55 +"= "+ round(this.doklad.Suma*0.55));
        return callback(new Error("Preplatené je viac ako 55%"));
      } else {
        callback();
      }
    }
    return {
      meno: "",
      priezvisko: "",
      doklad: db.getDoklad(this.compData.dokladId),
      changedStatus: false,
      alert: {
        showAlert: false,
        title: "",
        type: ""
      },
      rules: {
        Suma: [{ validator: checkSuma, trigger: "blur" }],
        Preplatene: [{ validator: checkPreplatene, trigger: "blur"}]
      }
    };
  },
  computed: {
    roky: function() {
      let currentYear = new Date().getFullYear(), years = [];
      let startYear = 2019;  
      while ( startYear <= currentYear ) {
          years.push(startYear++);
      }   
      return years;
    },
    preplatene: function() {
      return this.getPrep(this.doklad.Suma);
    },
    schvalene: function() {
      return this.doklad.Schvalene;
    },
    doklady: function() {
      return db.getDoklady(this.compData.zamId, this.doklad.Rok);
    }
  },
  created: function() {
    if(this.doklad.Datum == '-') {
      console.log(this.doklad.Datum);
      this.doklad.Datum = this.getCurrentDate();
    }
  },
  watch: {
    schvalene: function () {
      this.changedStatus = true;
    },
  },
  methods: {
    back: function() {
      bus.$emit("switchComp", "Doklady", this.compData.zamId);
    },
    // Handles form submition
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          try {
            var doklad = this.doklad;
            doklad.Preplatene = this.preplatene;
            if(doklad.Schvalene === "Zamietnuté") { doklad.Preplatene = 0; }
            db.updateDoklad(doklad.Suma, doklad.Preplatene, doklad.Datum, doklad.Schvalene, doklad.Poznamka, doklad.Rok, doklad.ID);
            this.createAlert("success");
          } catch (e) {
            console.log(e);
            this.createAlert("fail");
          }
          this.doklad = db.getDoklad(this.compData.dokladId);
        } else {
          return false;
        }
      });
    },
    // creates alerts to inform about submit event
    createAlert(type) {
      var self = this.alert;
      switch (type) {
        case "success":
          self.title = "Úspešne upravené";
          self.type = "success";
          break;
        case "fail":
          self.title = "Neúspešné";
          self.type = "error";
          break;
        case "input":
          self.title = "Nesprávne zadané údaje";
          self.type = "warning";
          break;
        default:
          break;
      }
      // automaticaly disappear after 10 sec
      self.showAlert = true;
      var alertTimer = setInterval(function() {
        clearInterval(alertTimer);
        self.showAlert = false;
      }, 10000);
    },
    getPrep(suma) {
      var dokladId = this.compData.dokladId;
      var doklady = this.doklady;
      var prepSum = 0;
      var prep = round(suma * 0.55);
      doklady.forEach(function(doklad) {
          if(doklad.ID != dokladId) {
            prepSum += doklad.Preplatene;
          }   
      });
      if (prepSum + prep > 275) {
        return round(275 - prepSum).toFixed(2);
      } else {
        return prep.toFixed(2);
      }
    },
    setPrep(){
        this.doklad.Preplatene = this.getPrep(this.doklad.Suma);
    },
    getCurrentYear: function() {
      return new Date().getFullYear();
    },
    getCurrentDate: function() {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); 
      var yyyy = today.getFullYear();

      today = dd + '/' + mm + '/' + yyyy;
      return today;
    },
    formatSuma: function() {
      var suma = this.doklad.Suma;
      if(suma) {
        this.doklad.Suma = parseFloat(suma).toFixed(2);
      }
    }
  }
};

function round(value) {
  return Number(Math.round(value + "e" + 2) + "e-" + 2);
}
</script>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  display: none;
}
.el-form {
  margin-top: 10px;
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
#refresh {
  padding-left: 10px;
}
</style>