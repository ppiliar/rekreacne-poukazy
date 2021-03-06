
module.exports = {
    pluginOptions: {
      electronBuilder: {
        externals: ['better-sqlite3'],
        nodeIntegration: true,
        builderOptions: {
          // options placed here will be merged with default configuration and passed to electron-builder
          nsis: {
            deleteAppDataOnUninstall: true
          }
        }
      }
    }
  }