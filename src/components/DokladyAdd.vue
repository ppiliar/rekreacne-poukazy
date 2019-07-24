<template>
  <el-container>
    <el-header>
      <div class="controls">
        <el-button type="primary" icon="el-icon-arrow-left" v-on:click="back">Späť</el-button>
      </div>
    </el-header>
    <el-main>
      <el-form  :model="doklad" :rules="rules" ref="doklad" @submit.native.prevent>
        <el-form-item label="Cena zájazdu" prop="suma">
          <el-input
            type="number"
            min="0"
            step="0.01"
            v-model.number="doklad.suma"
            placeholder="Suma"
            @keyup.enter.native="submitForm('doklad')"
            autofocus
          ></el-input>
        </el-form-item>
        <el-form-item label="Možné preplatiť" prop="prep">
          <el-input v-model.number="prep" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item>
          <div>
            <el-radio-group v-model="doklad.schvalene">
              <el-radio-button label="Schválené">Schválené</el-radio-button>
              <el-radio-button label="Čakajúce">Čakajúce</el-radio-button>
              <el-radio-button label="Zamietnuté">Zamietnuté</el-radio-button>
            </el-radio-group>
          </div>
        </el-form-item>
         <el-form-item label="Poznámka">
          <el-input type="textarea" v-model="doklad.poznamka"></el-input>
        </el-form-item>
        <el-form-item label="Rok">
          <el-select v-model="doklad.rok">
                <el-option
                v-for="item in roky"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
              </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="submitForm('doklad')">Pridať</el-button>
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
    return {
      meno: "",
      priezvisko: "",
      doklad: {
        suma: "",
        schvalene: "Čakajúce",
        poznamka: "",
        rok: this.getCurrentYear()
      },
      alert: {
        showAlert: false,
        title: "",
        type: ""
      },
      rules: {
        suma: [{ validator: checkSuma, trigger: "blur" }]
      }
    };
  },
  computed: {
    prep: function() {
      if(this.doklad.schvalene === "Zamietnuté") {
        return 0;
      } 
      return this.getPrep(this.doklad.suma);
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
  components: {},
  methods: {
    back: function() {
      bus.$emit("switchComp", "Doklady", this.compData);
    },
    // Handles form submition
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("form valid");
          try {
            var doklad = this.doklad;
            var prep = this.getPrep(this.doklad.suma);
            db.addDoklad(doklad.suma, prep, doklad.schvalene, doklad.poznamka, doklad.rok, this.compData);
            this.createAlert("success");
          } catch (e) {
            this.createAlert("fail");
          }
          this.$refs[formName].resetFields();
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
          self.title = "Úspešne pridané";
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
      var doklady = db.getDoklady(this.compData, this.doklad.rok);
      var prepSum = 0;
      var prep = round(suma * 0.55);
      doklady.forEach(function(doklad) {
        prepSum += doklad.Preplatene;
      });
      if (prepSum + prep > 275) {
        return 275 - prepSum;
      } else {
        return prep;
      }
    },
    getCurrentYear: function() {
      return new Date().getFullYear();
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
</style>