<template>
    <div id="app">
        <router-view
            :hide-footer="true"
            :hideSearch="true"
            :subMenuList="subMenuList"
            page="hotelType">
        </router-view>
    </div>
</template>
<script>
    import Vue from 'vue';
    import VueRouter from 'vue-router';
    import iView from 'iview';
    import '!style-loader!css-loader!less-loader!../../theme/index.less'
    import {
        setCookie,
        subMenuListMap
    } from 'common_libs/util'
    import pageonload from 'common_libs/pageonload';
    import router from './router';
    import store from './store';

    Vue.use(iView);
    Vue.use(VueRouter);
    // Vue.use(loginView)
    export default {
        name: 'app',
        data() {
            return {
                subMenuListMap: {
                    R_ROOM_MANAGER: {
                        name: '房型房号', to: '/'
                    },
                    R_CHANNEL_MANAGER: {
                        name: '渠道设置', to: '/ownChannel'
                    },
                    R_INN_MANAGER: {
                        name: '门店信息', to: '/hotelInfo'
                    },
                    R_EMPLOYEE: {
                        name: '员工账号', to: '/staffAccount'
                    },
                    R_CONNECT_APPLY: {
                        name: '直连管理', to: '/channelManage'
                    },
                    R_CONNECT_ROOM: {
                        name: '直连房量', to: '/roomAmount'
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
                    if (item.parentId === 6)
                        res.push(item.value)
                }
                return res
            },
            subMenuList () {
                let subMenuList = []
                let userPermissionValueList = []
                let userPermissionList = this.$store.getters.userPermissionList
                userPermissionList.map(item => {
                    let menuItem = this.subMenuListMap[item]
                    if (menuItem) {
                        userPermissionValueList.push(item)
                    }
                })
                let userPermissionP = new Promise(res => {
                    if (userPermissionList && userPermissionList.length)
                        res(true)
                })
                let permissionValueP = new Promise(res => {
                    if (this.permissionValueList && this.permissionValueList.length)
                        res(true)
                })
                for (let i = 0, len = this.permissionValueList.length; i < len; i++) {
                    let item = this.permissionValueList[i]
                    let index = userPermissionValueList.indexOf(item) >= 0
                    if (item === 'R_INN_MANAGER' && !index)
                        subMenuList.push(this.subMenuListMap.R_INN_MANAGER)
                    else if (index)
                        subMenuList.push(this.subMenuListMap[item])
                }
                Promise.all([userPermissionP, permissionValueP]).then(res => {
                    this.jumpPage(subMenuList)
                })
                    
                return subMenuList
            }
        },
        methods: {
            jumpPage (subMenuList) {
                let currentPage = window.location.hash.slice(1)
                let exist = subMenuList.some(item => item.to === currentPage)
                if (!exist) {
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
<style lang="scss" rel="stylesheet/scss">
    #app {
        width: 100%;
        overflow: hidden;
        background: #F7F7F7FF;
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
    }
    .modalPriceBg {
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 100000;
        background:rgba(170,170,170,1);
        top: 0;
        left: 0;
        opacity: 0.3;
    }
    .ivu-message {
        top: 30%;
        z-index: 100000;
    }

    .menu {
        .ivu-menu-submenu-title {
            padding: 0;
            border: 0;
            padding: 14px 15px 14px 40px;
            border-left: 4px solid transparent;
        }
        .ivu-menu-submenu {
            .ivu-menu { margin-top: 7px; }
        }
        .ivu-menu-submenu.ivu-menu-item-active {
            .ivu-menu-submenu-title {
                border: 0;
                border-left: 4px solid #0B8CEF;
            }
        }
    }
    .roomAmount {
        .datePicker {
            .ivu-date-picker-editor {
                .ivu-icon { display: none !important; }
            }
            .ivu-input {
                background: #EFEFEF;
                padding: 4px 7px;
                border: 0;
            }
        }
    }
    /* 客栈信息 */
    .completeDetail {
      .prograss {
        width: 365px;
        margin-left: 15px;
        .ivu-progress-inner {
            background-color: #C9E9FA;
        }
        .ivu-progress-bg {
          background-color: #0087CD;
        }
      }
    }
    /* 自定义渠道 */
    .wonChannel {
        margin-top: 30px !important;
        .ivu-input {
            border-color: #AAAAAA;
            border-radius: 0;
            height: 36px;
        }
        .ivu-input-wrapper.errNote {
            .ivu-input { border-color: #FB2A2A; }
        }
        .ivu-input-group-append {
            border: 0;
            background: white;
            .ivu-btn {
                border: 0;
                border-radius: 0;
                font-size: 16px;
                background: #BEE3F6;
                color: white;
                padding: 0;
                height: 36px;
                width: 45px;
            }
        }
    }
    /* 
        全局类
        m_l_c  margin-left: 0
        m_r_c  margin-right: 0
        .clearfix 清除浮动
    */
    .m_l_c { margin-left: 0 !important; }
    .m_r_c { margin-right: 0 !important; }
    .f_d {
        // width: 1200px;
        width: 90%;
        margin: 0 auto;
    }
    .clearfix:after {
        height: 0;
        content: '.';
        visibility: hidden;
        clear: both;
        display: block;
    }
    .clearfix { zoom: 1; }
    /* 删除确认框内文本样式 */
    .confirmText {
        color: #000000;
        font-size: 16px;
        text-align: center;
        height: 78px;
        line-height: 78px;
    }
    /* 加载遮罩 */
    .ivu-spin-fix {
        background: #000;
        opacity: 0.2;
        z-index: 100000;
        position: fixed;
        .spin-icon-load{
            animation: ani-demo-spin 1s linear infinite;
        }
        @keyframes ani-demo-spin {
            from { transform: rotate(0deg);}
            50%  { transform: rotate(180deg);}
            to   { transform: rotate(360deg);}
        }
    }
    div.anchorBL { display: none !important; }
    .BMap_bubble_title a { display: none !important; }
    .panel.open li a { display: none !important; }
    .panel.open > div > div:last-child > a { display: none !important; }

</style>
