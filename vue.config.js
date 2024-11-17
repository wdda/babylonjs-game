const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: '',
  assetsDir: 'assets',
  outputDir: '../babylonjs-game-build/dist',
  productionSourceMap: false
})