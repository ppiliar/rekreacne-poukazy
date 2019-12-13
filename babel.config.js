module.exports = {
  presets: [ [
    "@vue/app",
    { useBuiltIns: "entry" } // fixes error with missing old files in new core-js version 3
  ] ] 
}