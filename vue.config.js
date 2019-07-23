
module.exports = {
    pluginOptions: {
      electronBuilder: {
        builderOptions: {
          // options placed here will be merged with default configuration and passed to electron-builder
          nsis: {
            deleteAppDataOnUninstall: true
          },          
          extraResources: [
            {
              "from": "./src/data",
              "to": "data",
              "filter": [
                "**/*"
              ]
            }
          ]
        }
      }
    }
  }