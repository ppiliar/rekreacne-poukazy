<template>
  <el-container>
    <el-header>
      <div class="controls">
        <el-button type="primary" icon="el-icon-arrow-left" v-on:click="back">Spat</el-button>
      </div>
    </el-header>
    <el-main>
      <el-form
        :inline="true"
        :model="formInline"
        :rules="rules"
        ref="formInline"
        class="form-inline"
      >
        <el-form-item label="Meno" prop="meno">
          <el-input v-model="formInline.meno" placeholder="Meno"></el-input>
        </el-form-item>
        <el-form-item label="Priezvisko" prop="priezvisko">
          <el-input v-model="formInline.priezvisko" placeholder="Priezvisko"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="submitForm('formInline')">Pridat</el-button>
        </el-form-item>
      </el-form>
      <el-row id="alerts">
        <el-alert ref="alert" :title="alert.title" :type="alert.type" show-icon v-show="alert.showAlert"></el-alert>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { bus } from "../main.js";
import db from "../scripts/db1.js";
import { clearInterval } from 'timers';

export default {
  name: "ZamestnanciAdd",
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("Zadaj meno"));
      } else {
        callback();
      }
    };
    var checkSurname = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("Zadaj priezvisko"));
      } else {
        callback();
      }
    };
    return {
      meno: "",
      priezvisko: "",
      formInline: {
        meno: "",
        priezvisko: ""
      },
      alert: {
        showAlert: false,
        title: "Uspesne pridane",
        type: "success"
      },
      rules: {
        meno: [{ validator: checkName, trigger: "blur" }],
        priezvisko: [{ validator: checkSurname, trigger: "blur" }]
      }
    };
  },
  components: {},
  methods: {
    back: function() {
      bus.$emit("switchComp", "Zamestnanci");
    },
    // Handles form submition
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("form valid");
          try{
          db.addZamestnanec(this.formInline.meno, this.formInline.priezvisko);
          this.createAlert("success");
          } catch(e) {
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
      var form = this.formInline;

      switch(type) {
        case "success": 
          self.title = "Uspesne pridane: " + form.meno + " " + form.priezvisko;
          self.type = "success";
          break;
        case "fail":
          self.title = "Neuspesne: "+ form.meno + " " + form.priezvisko + " uz existuje";
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
      },10000);
    }
  }
};

function sanitizeString(str) {
  //str = str.replace(/[^a-z0-9 \.,_-]/gim,"");
  str = str.replace(
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gim,
    ""
  );
  return str.trim();
}
</script>

<style>
.el-form {
  margin-top: 10px;
}
.el-row {
  min-height: 35px;
  margin-bottom: 20px;
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