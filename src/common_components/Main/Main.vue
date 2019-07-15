/*
 * @Author: huangchao 
 * @Date: 2018-11-29 11:00:39 
 * @Last Modified by: huangchao
 * @Last Modified time: 2019-02-12 16:36:33
 */
<template>
    <div class="app-main">
        <sider-menu
            :page="page"></sider-menu>
        <div class="container"
            :style="{
                'padding-bottom': hideFooter ? '0px': '40px'
            }"
        > 
            <app-header
                :subMenuList="subMenuList"
                :hide-search="hideSearch">
                <template v-if="subMenuSlot">
                    <div slot="sub-menu">
                        <slot name="sub-menu"></slot>
                    </div>
                </template>
            </app-header>
            <main
                :style="mainStyle"
                class="main"
            >
                <router-view></router-view>
            </main>
            <app-footer v-if="!hideFooter"></app-footer>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import SiderMenu from '../SiderMenu/'
    import AppHeader from '../AppHeader/'
    import AppFooter from '../AppFooter/'

    export default {
        name: 'app-main',
        props: {
            page: {
                type: String,
                default: ''
            },
            subMenuList: {
                type: Array,
                default () {
                    return []
                }
            },
            hideSearch: {
                type: Boolean,
                default: false
            },
            subMenuSlot: {
                type: Boolean,
                default: false
            },
            hideFooter: {
                type: Boolean,
                default: true
            },
            initRequestData: {
                type: Array,
                default () {
                    return [
                        /* 
                            'getOrderFromList',
                            'getOrderPaymentList',
                            'getOrderPaymentTypeList',
                            'getRoomTypeList'
                        */
                    ]
                }
            }
        },
        components: {
            SiderMenu,
            AppHeader,
            AppFooter
        },
        computed: {
            mainStyle() {
                return this.hideFooter ?
                    {
                        'height': 'calc(100vh - 50px)',
                        'overflow': 'auto'
                    }
                    : {
                        'min-height': 'calc(100vh - 90px)',
                    }
            }
        },
        methods: {
            ...mapActions([
                'getOrderFromList',
                'getOrderPaymentList',
                'getOrderPaymentTypeList',
                'getRoomTypeList',
                'getUserInfo',
                'getHotelList',
                'getAllPermissionList'
            ])
        },
        created() {
            this.getUserInfo()
            this.getHotelList()
            this.getAllPermissionList()
            for (let i = 0, len = this.initRequestData.length; i < len; i++)
                this[this.initRequestData[i]]()
        }
    }
</script>

<style lang="scss" scoped>
    .app-main {
        padding-left: 150px;
        position: relative;
        .container {
            padding-top: 50px;
            position: relative;
            main {
                position: relative;
            }
        }
    }
</style>
