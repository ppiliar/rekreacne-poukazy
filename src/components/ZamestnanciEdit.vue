<template>
  <el-container>
    <el-header>
      <div class="controls">
        <el-button type="primary" icon="el-icon-arrow-left" v-on:click="back">Späť</el-button>
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
          <el-input v-model="formInline.meno"></el-input>
        </el-form-item>
        <el-form-item label="Priezvisko" prop="priezvisko">
          <el-input v-model="formInline.priezvisko"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="submitForm('formInline')">Uložiť</el-button>
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
import db from "../scripts/db.js";
import { clearInterval } from 'timers';

export default {
  name: "ZamestnanciEdit",
  props: ["compData"],
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
  created() {
      var data = db.getZamestnanec(this.compData);
      this.formInline.meno = data.Meno;
      this.formInline.priezvisko= data.Priezvisko;
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
          self.title = "Uspesne zmenené: ";
          self.type = "success";
          break;
        case "fail":
          self.title = "Neúspešné: osoba už existuje";
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
      },10000);
    }
  }
};
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