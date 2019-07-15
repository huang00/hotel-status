<template>
    <header class="app-header clearfix">
        <div class="header-left">
            <div class="sub-menu">
                <slot name="sub-menu">
                    <ul class="clearfix" v-if="subMenuList && subMenuList.length">
                        <li
                            v-for="(item, index) in subMenuList" :key="index"
                            :class="returnActice(item) ? 'active': ''"
                            @click="switchSubMenu(item.to)"
                            >{{item.name}}
                        </li>
                    </ul>
                </slot>
            </div>
        </div>

        <div class="header-right clearfix">
            <div class="portrait" @mouseenter="openMenu" @mouseleave="closeMenu">
                <Icon type="ios-person" style="font-size:22px"/>
                <div class="menuWrap" v-show="showMenu" @mouseenter="onMenu" @mouseleave="closeMenu">
                    <ul>
                        <li @click="junpTo('/hotelStatus/hotelLog.html')">操作记录</li>
                        <li @click="openMyaccountModal">我的账号</li>
                        <li @click="out">退出登录</li>
                    </ul>
                </div>
            </div>
            <template v-if="!hideSearch">
                <div 
                    :class="['search', openSearchInput || showSearchPanle ? 'open': '']"
                    @click.stop
                >
                    <Input
                        @on-focus="openSearchInput = true"
                        @on-blur="openSearchInput = false"
                        @on-enter="handlerSearch"
                        v-model="searchValue"
                        :placeholder="openSearchInput ? '联系人姓名/手机号/订单号' : ''">
                        <Icon type="ios-search" slot="suffix" @click="handlerSearch"/>
                    </Input>
                </div>
            </template>
            <div class="downLoad">
                <div>
                    <span class="icon"><img src="../../common_assets/imgs/client_icon_click.png" height="26" width="20"></span>
                    <span style="cursor: pointer;">APP 下载</span>
                </div>
                <div class="hover-detail-content">
                    <div class="hover-detail">
                        <div class="code-contant">
                            <div class="qr-code"></div>
                        </div>
                        <div class="code-down">扫码下载</div>
                        <div class="down-pc" @click='downToPC'>下载到PC</div>
                    </div>
                </div>
            </div>

            <div
                class="search-panle custom-scrollbar"
                v-show='showSearchPanle'
                @click.stop
            >
                <Search :searchList='searchList'></Search>
            </div>
        </div>
        
        <!-- 我的账号 -->
        <app-modal v-model="accountModal" :width="590" :height="480" :footer-hide="true" :header-hide="true" title="" class="accountModal">
            <my-account @on-success="editPhoneSuccess"></my-account>
        </app-modal>
    </header>
</template>

<script>
    import {mapActions} from 'vuex'
    import Search from './components/search'
    import myAccount from './components/myAccount'
    import  { hotelStatusApiSercers } from '../../entries/hotelStatus/api/API.js'
    import {changeMoney, getCookie,setCookie,formatDate} from '../../common_libs/util.js'
    import { mapState } from 'vuex'
    import AppModal from 'common_components/AppModal/'
    // import accountTop from 'common_components/ /'
    import { headerServers  } from 'api/api'


    export default {
        name: 'AppHeader',
        components: {
            Search,
            myAccount,
            AppModal,
        },
        props: {
            hideSearch: {
                type: Boolean,
                default: false
            },
            subMenuList: {
                /* { name: menuName, to: 'path' } */
                type: Array,
                default() { return [] }
            }
        },
        data () {
            return {
                // 搜索
                openSearchInput: false,
                searchValue: '',
                searchList: [],
                showSearchPanle: false,

                //菜单
                showMenu: false,
                timer:null,

                // 我的账号
                accountModal:false,
            }
        },
        watch: {
            searchList (val, oldVal) {
                if (val.length > 0) {
                    this.$store.dispatch('showSearch', true)
                }
            }
        },
        methods: {
            ...mapActions(['setChannelDayIds']),
            handlerSearch () {
                this.searchList = []
                if (!this.searchValue){
                     this.$Message.error('请输入搜索内容');
                } else {
                    let obj = {
                        contact: this.searchValue
                    }
                    hotelStatusApiSercers.findByContact(obj).then(result => {
                        if (result.code === '000000') {
                            if (!result.content.length ) {
                                this.$Message.warning('暂无符合搜索条件的结果');
                            } else {
                                let tempResult = JSON.parse(JSON.stringify(result.content))
                                for (let i = 0, len = result.content.length; i < len; i++) {
                                    tempResult[i].checkInAt = formatDate(result.content[i].checkInAt)
                                    tempResult[i].checkOutAt = formatDate(result.content[i].checkOutAt)
                                    tempResult[i].subTotal = changeMoney(result.content[i].subTotal)
                                }
                                this.searchList = tempResult
                                this.showSearchPanle = true
                                document.addEventListener('click', this.handlerDocumentMouseUP)
                            }
                           
                        } else {
                            this.$Message.error(result.message);
                        }
                    })
                }
            },
            switchSubMenu (path) {
                if(path == '/hotelChannel'){
                    if(window.location.hash != '#/hotelChannel'){
                        let storeData = {
                            type : 3
                        }
                        this.setChannelDayIds(storeData)
                        this.$store.dispatch('timeStampsChannel', [new Date(new Date().setDate(1)).getTime(),new Date().getTime()])
                    }
                }
                this.$router.push(path)
            },
            returnActice(item) {
                let res = false
                if(this.$route.path === item.to){
                    res = true
                }

                if(item.children){
                    for(let q = 0;q < item.children.length;q++){
                        if(this.$route.path === item.children[q].to){
                            res = true
                        }
                    }
                }
                return res
            },
            // 下载到PC
            downToPC () {
                window.location.href="https://wefint.com/download/pms.apk"
            },
            handlerDocumentMouseUP () {
                this.showSearchPanle = false
                this.searchValue = ''
                document.removeEventListener('click', this.handlerDocumentMouseUP)
            },

            // 菜单
            openMenu() {
                clearTimeout(this.timer)
                this.timer = null
                this.showMenu = true
            },
            closeMenu() {
                clearTimeout(this.timer)
                this.timer = null
                this.timer = setTimeout(() => {
                    this.showMenu = false
                },500)
            },
            onMenu() {
                clearTimeout(this.timer)
                this.timer = null
                this.showMenu = true
            },

            // 打开我的帐户
            openMyaccountModal() {
                this.accountModal = true
            },

            // 退出登陆
            out () {
                headerServers.logout().then(result => {
                    if (result.code === '000000') {
                        setCookie('token', '');
                        setCookie('innId', '');
                        setCookie('userId', '');
                        setCookie('innName', '');
                        this.junpTo('/index/index.html')
                    } else {
                        this.$Message.error(result.message);
                    }
                })

            },

            // 跳转
            junpTo (path, newOpen) {
                if (newOpen) {
                    window.open(path)
                } else {
                    window.location.href = path
                }
            },

            editPhoneSuccess(data) {
                console.log(data)
                // this.accountModal = false
            }
        },
    }
</script>

<style lang="scss">
    .app-header {
        position: absolute;
        width: 100%;
        background: #fff;
        top: 0;
        height: 50px;
        padding-right: 20px;    
        .header-left {
            float: left;
            height: 100%;
            .sub-menu {
                li {
                    float: left;
                    line-height: 48px;
                    padding: 0 25px;
                    border-top: 2px solid transparent;
                    font-size: 16px;
                    cursor: pointer;
                    &.active, &:hover {
                        border-color: #1E5A90;
                        background: #F7F7F7;
                        color: #1F5A90;
                    }
                }
            }
        }
        .header-right {
            float: right;
            height: 100%;
            position: relative;
            padding-top: 10px;
            .portrait {
                position: relative;
                width: 30px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                font-size: 18px;
                background: #ccc;
                border-radius: 50%;
                // overflow: hidden;
                // background: pink;
                right: 0;
                float: right;
                cursor: pointer;
                .menuWrap{
                    font-size: 12px;
                    position:absolute;
                    top:40px;
                    right:0;
                    background:#fff;
                    padding:5px;
                    z-index:99;
                    text-align:center;
                    box-shadow:2px 2px 8px 0px rgba(0,0,0,0.12);
                    border-radius:4px;
                    ul{
                        li{
                            width:102px;
                            height:40px;
                            line-height:40px;
                            background:#fff;
                            border-radius:4px;
                            margin-bottom:3px;
                        }
                        li:hover{
                            color:#2F6CA3FF;
                            background:rgba(250,250,250,1);
                        }
                    }
                }
            }
            .search {
                float: right;
                margin-right: 20px;
                width: 70px;
                transition: width .3s ease;
                .ivu-input-wrapper {
                    .ivu-input {
                        border-radius: 20px;
                        background:rgba(240,240,240,1);
                    }
                }
                &.open {
                    width: 200px;
                    .ivu-input-suffix {
                        background:linear-gradient(270deg,rgba(138,173,197,1) 0%,rgba(75,136,188,1) 100%);
                        border-radius:20px;
                        width: 35px;
                        cursor: pointer;
                        .ivu-icon {
                            font-size: 24px;
                            color: white;
                        }
                    }
                }
            }
            .downLoad {
                float: left;
                font-size: 12px;
                color: #2F6CA3;
                line-height: 32px;
                margin-right: 26px;
                position: relative;
                .icon {
                    display: inline-block;
                    width: 10px;
                    height: 13px;
                    margin-right: 2px;
                    img {
                        width: 100%;
                        height: 100%;
                        vertical-align: text-top;
                    }
                }
                &:hover .hover-detail-content {
                    display: block;
                }
                .hover-detail-content {
                    position: absolute;
                    display: none;
                    left: -36px;
                    top: 22px;
                    width: 151px;
                    height: 250px ;
                    z-index: 999;
                    .hover-detail {
                        position: absolute;
                        padding: 10px 10px 0;
                        top: 15px;
                        width:151px;
                        height:212px;
                        background:rgba(255,255,255,1);
                        box-shadow:2px 2px 8px 0px rgba(0,0,0,0.12);
                        border-radius:4px;
                        .code-contant {
                            width: 130px;
                            height: 130px;
                            padding-top: 5px; 
                            border-radius:4px;
                            box-shadow: 2px 2px 8px 0px rgba(0,0,0,0.12);
                            .qr-code {
                                width:120px;
                                height:120px;
                                margin: 0 auto;
                                border-radius:4px;
                                background: url('../../common_assets/imgs/qr-code.png') no-repeat white center center;
                                background-size: 100% 100%;
                            }
                        }
                        .code-down {
                            margin-top: 10px;
                            color: #999;
                            text-align: center;
                            line-height: 24px;
                        }
                        .down-pc {
                            text-align: center;
                            margin: 0 auto;
                            width:130px;
                            height:30px;
                            color: #999;
                            cursor: pointer;
                            &:hover {
                                text-align: center;
                                background:rgba(245,245,245,1);
                                border-radius:4px;
                                color: #2F6CA3;
                            }
                        }
                    }
                }
                
            }
            .search-panle {
                overflow: auto;
                width:334px;
                max-height:500px;
                background:rgba(255,255,255,1);
                box-shadow:2px 2px 8px 0px rgba(0,0,0,0.12);
                border-radius:4px;
                position: absolute;
                top: 45px;
                right: 48px;
                z-index: 1;
            }
        }


         
        .account-top{
            width:590px;
            height:242px;
            background:url('../../common_assets/imgs/myAccountBg.png') no-repeat white center center;
            text-align: center;
            .backList{
                cursor: pointer;
                position:absolute;
                top:2px;
                left:6px;
                height:30px;
                line-height:30px;
                font-size:14px;
                color:#215D91FF;
                i{
                    color: #1F5A8EFF;
                    font-size: 18px;
                    margin-right:4px;
                    margin-top:-2px;
                }
            }
            .icon{
                margin-top:39px;
            }
            p{
                color: #215D91FF;
                font-size: 16px;
                margin-top:10px;
            }
        }

        .account-content{
            .account-list{
                width:320px;
                margin:0 auto;
                p{
                    margin-top:32px;
                    font-size: 14px;
                    // height: 50px;
                    // line-height: 50px;
                    button{
                        float: right;
                        width: 110px;
                        font-size: 14px;
                        color: #FFFFFF;
                        margin-top: -7px
                    }
                }
            };
            .editPassForm{
                width:400px;
                margin:0 auto;
                margin-top: 20px;
            }

            .editPhoneFormFir{
                width: 500px;
                margin: 0 auto;
                margin-top: 37px;
                .get-code{
                    margin-left: 20px;
                    margin-top: 0px;
                }
            }
            .editPhoneFormSec{
                width: 500px;
                margin: 0 auto;
                margin-top: 37px;
                .get-code{
                    margin-left: 20px;
                    margin-top: 0px;
                }
            }
            .button-list{
                text-align: center;
            }
            button{
                border: 0;
                cursor: pointer;
                outline: none;
                width: 110px;
                height: 32px;
                border-radius: 17px;
                font-size: 14px;
                &.submit{
                    background: linear-gradient(270deg,rgba(153,200,135,1) 0%,rgba(79,152,55,1) 100%);
                    box-shadow:2px 2px 8px 0px rgba(169,242,156,0.45);
                }
                &.submit-phone{
                    margin-top: 40px;
                }
                &.next-step{
                    background: linear-gradient(270deg,rgba(138,173,197,1) 0%,rgba(75,136,188,1) 100%);
                    box-shadow:2px 2px 8px 0px rgba(56,120,178,0.33);
                    margin-top: 40px;
                }
            }
        }
    }
</style>
