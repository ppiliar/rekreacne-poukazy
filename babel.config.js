module.exports = {
  presets: [ [
    "@vue/cli-plugin-babel/preset",
    { useBuiltIns: "entry" } // fixes error with missing old files in new core-js version 3
  ] ] 
}