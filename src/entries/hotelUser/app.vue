<template>
  <!-- :subMenuSlot="true" -->
  <div id="app">
    <router-view 
        :subMenuList="subMenuList" 
        :hideSearch="true" 
        :init-request-data="initRequestData" 
        page="hotelUser"
    ></router-view>
  </div>
</template>
<script>
import Vue from 'vue';
import VueRouter from 'vue-router';
import 'common_assets/fonts/iconfont/iconfont.css'
import iView from 'iview';
import '!style-loader!css-loader!less-loader!../../theme/index.less'
import util from 'common_libs/util'
// import pageonload from 'common_libs/pageonload';
import router from './router';
import store from './store';
import Bus from '../../bus/'
import 'babel-polyfill'

Vue.prototype.$util = util;// 挂载到全局的公共函数
Vue.config.devtools = false;

Vue.use(iView);
Vue.use(VueRouter);

export default {
  name: 'app',
  components: {},
  data() {
    return {
      Bus,
      initRequestData: [
        'getOrderFromList',
        'getOrderPaymentList',
        'getOrderPaymentTypeList',
        'getRoomTypeList'
      ],
      subMenuList: [
        {
          name: '客户列表', to: '/', children: [
            {
              name: 'userList',
              to: '/userList'
            }
          ]
        },
        // {
        //   name: '短信服务', to: '/shortMessage', children: [
        //     {
        //       name: 'shortMessage',
        //       to: '/shortMessage'
        //     }
        //   ]
        // }
      ],
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
<style lans='scss' src="./assets/pub.css"></style>
<style lang="scss" rel="stylesheet/scss">
// #app {}
</style>


