<template>
    <div id="app">
        <router-view
            :hideSearch="true"
            :page="'hotelOrder'"
        ></router-view>
    </div>
</template>
<script>
    import Vue from 'vue';
    import VueRouter from 'vue-router';
    import iView from 'iview';
    import '!style-loader!css-loader!less-loader!../../theme/index.less'
    import util, {setCookie} from 'common_libs/util'
    import router from './router';
    import store from './store';


    Vue.prototype.$util = util;// 挂载到全局的公共函数

    Vue.use(VueRouter);
    Vue.use(iView);
    export default {
        name: 'app',
        data() {
            return {}
        },
        created() {
           
        },
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
    }
    #app {
        width: 100%;
        overflow: hidden;
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
        .hotelOrder {
            .ivu-table-wrapper {
                position: initial;
                border: 0;
                .ivu-table {
                    th {
                        background: rgba(221,244,251,1);
                    }
                    td {
                        span { white-space: pre-wrap;}
                    }
                }
            }
            .search-input {
                .ivu-icon { left: 0; }
                .ivu-input { padding-left: 32px; }
            }
            .ivu-table {
                // .selected { color: #FA2E2E ; }
            }
            .ivu-table-body { 
                overflow-x: hidden;
                overflow-y: auto;
                max-height: 630px;
                tr { cursor: pointer; }
            }
            .plus { color: #F9966F; }
            .negative { color: #01B7B9; }
            .not-data {
                height: 120px;
                background:url('./components/views/hotelOrder/img/notData.png') no-repeat rgba(243,243,243,1) center center;
            }
        }
    }
</style>
