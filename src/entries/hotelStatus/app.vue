<template>
    <div id="app">
        <router-view
            :subMenuSlot="true"
            :hide-footer="false"
            page="hotelStatus">
        </router-view>
    </div>
</template>
<script>
    import Vue from 'vue';
    import VueRouter from 'vue-router';
    import 'common_assets/fonts/iconfont/iconfont.css'
    import iView from 'iview';
    import 'iview/dist/styles/iview.css'
    import util from 'common_libs/util'
    // import pageonload from 'common_libs/pageonload';
    import router from './router';
    import store from './store';
    // import vTitle from '../../vue_plugins/v_title'
    import Bus from '../../bus/'
    import 'babel-polyfill'
    
    Vue.prototype.$util = util;// 挂载到全局的公共函数
    Vue.config.devtools = false;
    
    Vue.use(iView);
    Vue.use(VueRouter);
    // Vue.use(vTitle);
    export default {
        name: 'app',
        components: {},
        data() {
            return {
                Bus
            }
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
    #app { }
</style>
