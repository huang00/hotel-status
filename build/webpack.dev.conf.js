var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// 按entries文件夹下打包的多模块循环生成多个 entry 及 HtmlWebpackPlugin config
let entryOption = {};
let HTMLPluginOption = [];
config.build.entryInfoList.forEach((entryInfo) => {
    entryOption[entryInfo.entryName] = [
        // add hot-reload related code to entry chunks
        // 把不同入口页面的dev-client（同时影响热加载中间件）分开
        './build/dev-client?name=' + entryInfo.entryName,
        // './webpack-hot-middleware/client?path=' + '/__webpack_hmr_' + entryInfo.entryName,
        path.join(path.dirname(entryInfo.indexPath), 'index.js'), // 获得入口js文件
    ];
    // https://github.com/ampedandwired/html-webpack-plugin
    HTMLPluginOption.push(new HtmlWebpackPlugin(utils.getHtmlPluginParam(entryInfo.indexPath)));
});

// 最终配置
const devWebpackConfig = {
    entry: entryOption,
    module: {
        rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap})
    },
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        ...HTMLPluginOption,
        new FriendlyErrorsPlugin(),
    ],
}

module.exports = merge(baseWebpackConfig, devWebpackConfig);