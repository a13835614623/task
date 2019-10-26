const isProduction = process.env.NODE_ENV === "production";
// 开发环境
let dev_url = "http://127.0.0.1:9527";
// 生产环境
let prod_url = "http://127.0.0.1:9528";
// 目标url
let target = isProduction ? prod_url : dev_url;
module.exports = {
  outputDir: "dist",
  indexPath: "index.html",
  publicPath: "./",
  lintOnSave: false,
  // 是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: false,
  // 不使用sourceMap
  productionSourceMap: false,
  //axios域代理，解决axios跨域问题
  devServer: {
    proxy: {
      "/api": {
        target,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  // webpack配置
  // configureWebpack: config => {
  //   // 为生产环境修改配置...
  //   // if (isProduction) {
  //   // } else {
  //   //   // 为开发环境修改配置...
  //   // }
  // },
  // 全局引入scss
  css: {
    loaderOptions: {
      scss: {
        prependData: `
          @import "@/assets/scss/index.scss";
        `
      }
    }
  }
};
