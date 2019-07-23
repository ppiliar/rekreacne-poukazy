<template>
  <el-container>
    <el-header>
      <div class="controls">
        <el-button type="primary" icon="el-icon-arrow-left" v-on:click="back">Spat</el-button>
      </div>
    </el-header>
    <el-main>
      <el-form :inline="true" :model="doklad" :rules="rules" ref="doklad" @submit.native.prevent>
        <el-form-item label="Suma" prop="Suma">
          <el-input
            type="number"
            min="0"
            step="0.01"
            v-model.number="doklad.Suma"
            placeholder="Suma"
            @keyup.enter.native="submitForm('doklad')"
            autofocus
          ></el-input>
        </el-form-item>
        <el-form-item label="Mozne preplatit" prop="Preplatene">
          <el-input type="number"
            min="0"
            step="0.01"
            v-model.number="doklad.Preplatene"></el-input>
            <i id="refresh" class="el-icon-refresh" v-on:click="setPrep"></i>
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
         <el-form-item label="Poznamka">
          <el-input type="textarea" v-model="doklad.Poznamka"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="submitForm('doklad')">Ulozit</el-button>
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
import db from "../scripts/db1.js";
import { clearInterval } from "timers";

export default {
  name: "dokladyAdd",
  props: ["compData"],
  data() {
    var checkSuma = (rule, value, callback) => {
      if(!value){ return callback(new Error("Zadaj cislo")); }
      if (value < 0) {
        return callback(new Error("Cislo nemoze byt zaporne"));
      } else {
        callback();
      }
    };
    var checkPreplatene = (rule, value, callback) => {
      if (value === "") { return callback(new Error("Zadaj cislo")); }
      if (value > (this.doklad.Suma*0.55)) {
        return callback(new Error("Preplatene je viac ako 55%"));
      } else {
        callback();
      }
    }
    return {
      meno: "",
      priezvisko: "",
      doklad: db.getDoklad(this.compData.dokladId),
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
  components: {},
  methods: {
    back: function() {
      bus.$emit("switchComp", "Doklady", this.compData.zamId);
    },
    // Handles form submition
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("form valid");
          try {
            var doklad = this.doklad;
            if(doklad.Schvalene === "Zamietnuté") { doklad.Preplatene = 0; }
            db.updateDoklad(doklad.Suma, doklad.Preplatene, doklad.Schvalene, doklad.Poznamka, doklad.ID);
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
          self.title = "Uspesne pridane";
          self.type = "success";
          break;
        case "fail":
          self.title = "Neuspesne";
          self.type = "error";
          break;
        case "input":
          self.title = "Nespravne zadane udaje";
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
      var doklady = db.getDoklady(this.compData.zamId);
      var prepSum = 0;
      var prep = round(suma * 0.55);
      doklady.forEach(function(doklad) {
          if(doklad.ID != dokladId) {
            prepSum += doklad.Preplatene;
          }   
      });
      console.log(prep);
      console.log(
        "prep+prepSum = %s + %f = %f ",
        prep,
        prepSum,
        prep + prepSum
      );
      if (prepSum + prep > 275) {
        console.log("returning 275-sum " + (275 - prepSum));
        return 275 - prepSum;
      } else {
        console.log("returning prep:" + prep);
        return prep;
      }
    },
    setPrep(){
        this.doklad.Preplatene = this.getPrep(this.doklad.Suma);
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