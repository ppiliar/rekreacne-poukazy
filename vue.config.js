
module.exports = {
    pluginOptions: {
      electronBuilder: {
        builderOptions: {
          // options placed here will be merged with default configuration and passed to electron-builder
          win: {
            target: ["portable"]
          },
          portable: {
            artifactName: "${productName}_Portable_${version}.exe"
          },
          nsis: {
            deleteAppDataOnUninstall: true
          }
        }
      }
    }
  }