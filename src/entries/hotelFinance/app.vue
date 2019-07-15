<template>
    <div id="app" style="background:#F7F7F7FF">
        <router-view
            page="hotelFinance"
            :hideSearch="true"
            :init-request-data="initRequestData"
            :subMenuList="subMenuList"
        ></router-view>
    </div>
</template>
<script>
    import Vue from 'vue';
    import VueRouter from 'vue-router';
    import iView from 'iview';
    import '!style-loader!css-loader!less-loader!../../theme/index.less'
    import 'common_assets/fonts/iconfont/iconfont.css'
    import util, {setCookie} from 'common_libs/util'
    // import hotelStatusPageHead from 'common_components/hotelStatusPageHead/hotelStatusPageHead.vue'
    import router from './router';
    import store from './store';
    import echarts from 'echarts'

    Vue.prototype.$echarts = echarts
    Vue.use(VueRouter);
    Vue.use(iView);
    
    export default {
        name: 'app',
        // components: {
        //     hotelStatusPageHead
        // },
        data() {
            return {
                initRequestData: [
                    'getOrderFromList',
                    'getOrderPaymentList',
                    'getOrderPaymentTypeList',
                    'getRoomTypeList'
                ],
                subMenuListMap: {
                    R_FINANCE_RECORD: {
                        name: '收支流水表', to: '/', children:[
                            {
                                name:'支付流水详情',
                                to: '/payWaysDetail'
                            }
                        ]
                    },
                    R_FINANCE_BALANCE: {
                        name: '渠道对账表', to: '/hotelChannel',children:[
                            {
                                name:'一日渠道订单明细',
                                to: '/dayAllOrder'
                            }
                        ]
                    }
                }
            }
        },
        computed: {
            permissionValueList () {
                let res = []
                let allPermissionList = this.$store.getters.allPermissionList
                for (let i = 0, len = allPermissionList.length; i < len; i++) {
                    let item = allPermissionList[i]
                    if (item.parentId === 3)
                        res.push(item.value)
                }
                return res
            },
            subMenuList () {
                let subMenuList = []
                this.$store.getters.userPermissionList.map(item => {
                    let menuItem = this.subMenuListMap[item]
                    if (menuItem)
                        subMenuList.push(menuItem)
                })
                if (subMenuList && subMenuList.length)
                    this.jumpPage(subMenuList)
                return subMenuList
            }
        },
        methods: {
            jumpPage (subMenuList) {
                let currentPage = this.$route.path
                let exist = subMenuList.some(item => item.to === currentPage)
                if (!exist && currentPage !== '/payWaysDetail' && currentPage !== '/dayAllOrder') {
                    this.$router.push(subMenuList[0].to)
                }
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
<style lang="scss" src="./views/css/index.scss"></style>
<style lang="scss" rel="stylesheet/scss">
    #app {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>
