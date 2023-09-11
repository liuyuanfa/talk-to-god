const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  productionSourceMap: false,
  publicPath: "./",
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  pages: {
    index: {
      entry: "src/main.js",
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias.set("@", resolve("src"));
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "this.is.talktogod",
        productName: "TalkToGod",
        electronDownload: {
          mirror: "https://npm.taobao.org/mirrors/electron/",
        },
        directories: {
          output: "output", // 打包后的文件夹
        },
        asar: true,
        mac: {
          target: "dmg",
          icon: "build/icons/icon.icns",
        },
        win: {
          // Windows平台的配置
          target: "nsis", // 打包的目标格式为NSIS安装程序
          icon: "build/icons/icon.ico", // Windows平台的图标路径
          publisherName: "liuyuanfa", // 发布者名称
        },
        linux: {
          target: ["AppImage", "deb"],
        },
        nsis: {
          oneClick: false,
          language: "2052",
          perMachine: true,
          allowElevation: true,
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: "TalkToGod",
        },
      },
    },
  },
};
