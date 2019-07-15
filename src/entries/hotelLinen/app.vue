<template>
    <div id="app">
        <router-view
            :hideSearch="true"
            :page="'hotelLinen'"
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
    }
</style>
