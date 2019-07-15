var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    // externals: {
    //     // vue: 'Vue',
    //     // 'vue-router': 'VueRouter',
    //     // vuex: 'Vuex',
    //     // axios: 'axios',
    //     // iview: 'iView',
    //     // 'AMap': 'AMap',
    //     // 'AMapUI': 'AMapUI'
    // },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'jquery': path.resolve(__dirname, '../node_modules/jquery/src/jquery'),
            'api': resolve('src/api'),
            'common_components': resolve('src/common_components'),
            'common_assets': resolve('src/common_assets'),
            'common_libs': resolve('src/common_libs'),
            'common_store': resolve('src/common_store'),
            '@': resolve('src'),
            'hotelFinance': resolve('src/entries/hotelFinance'),
            'hotelStatus': resolve('src/entries/hotelStatus'),
            'hotelType': resolve('src/entries/hotelType'),
            'hotelOrder': resolve('src/entries/hotelOrder'),
            'hotelLinen': resolve('src/entries/hotelLinen'),
            'hotelLog': resolve('src/entries/hotelLog')
        }
    },
    module: {
        rules: [
            // {
            //     test: /\.(js|vue)$/,
            //     loader: 'eslint-loader',
            //     enforce: 'pre',
            //     include: [resolve('src'), resolve('test')],
            //     options: {
            //         formatter: require('eslint-friendly-formatter')
            //     }
            // },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass?sourceMap'
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            },
            {
                test: /\.jade$/,
                loader: "jade"
            },
            {
                test: /\.pug$/,
                loader: 'pug'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    }
}
