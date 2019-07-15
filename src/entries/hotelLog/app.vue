<template>
    <div id="app">
        <router-view
            :hideSearch="true"
        >
        </router-view>
    </div>
</template>
<script>
    import Vue from 'vue';
    import VueRouter from 'vue-router';
    import iView from 'iview';
    import '!style-loader!css-loader!less-loader!../../theme/index.less'
    import util, {setCookie} from 'common_libs/util'
    import pageonload from 'common_libs/pageonload';
    import router from './router';
    import store from './store';


    Vue.prototype.$util = util;// 挂载到全局的公共函数

    Vue.use(iView)
    Vue.use(VueRouter);
    // Vue.use(loginView)
    export default {
        name: 'app',
        // 通过 router 配置参数注入路由，从而让整个应用都有路由功能
        router,
        store,
    }
</script>


<!-- 全局样式 -->
<style lang="scss" src="../../common_assets/basic.scss"></style>
<style lang="scss" src="../../common_assets/basic_const.scss"></style>
<style lang="scss" rel="stylesheet/scss">
    .app-main .container .main {
        box-shadow: 0 0 22px 0 rgba(0,0,0,.08);
        border-top-left-radius: 4px;
        background:#F7F7F7;
    }
    #app {
        width: 100%;
        overflow: hidden;
        .hotelTypePageBody .ivu-table-border th {
            background-color: #DDEAF4;
            color: #000;
            font-size: 16px;
            font-weight: 500;
            border: none;
        }
        .hotelType .ivu-tabs-bar {
            border-bottom: none;
        }
        .hotelType .ivu-tabs-nav .ivu-tabs-tab {
            /*color: #000;*/
            font-size: 18px;
        }
        .hotelType .ivu-tabs-nav .ivu-tabs-tab-active {
            color: #000000;
            font-weight: 500;
        }
        .hotelType .ivu-tabs-nav .ivu-tabs-tab:hover {
            color: #000;
        }
        .settingPrice .ivu-tabs-nav .ivu-tabs-tab {
            font-size: 16px;
        }
        .hotelType .settingPrice .ivu-tabs-bar {
            border-bottom: 1px solid #AAAAAA;
            padding: 0 0 25px 25px;
        }
        .pageHead {
            //页面头部
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            min-width: 1280px;
            height: 70px;
            justify-content: space-between;
            z-index: 1000;
        }
        .hotelLog {
            .ivu-table-wrapper {
                border: 0;
                .ivu-table:after { width: 0 !important; }
                .ivu-table {
                    th { background: rgba(221,244,251,1); }
                    .ivu-table-body { 
                        overflow-x: hidden;
                        overflow-y: auto;
                        max-height: 630px;
                    }
                    .logContent { line-height: 20px; }
                    // .notData {
                    //     height: 120px;
                    //     background:url('./components/views/hotelOrder/img/notData.png') no-repeat rgba(243,243,243,1) center center;
                    // }
                }
            }
        }
    }

</style>
