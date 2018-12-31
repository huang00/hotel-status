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
            <div class="portrait"></div>
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
                    <span style="cursor: pointer;">客户端下载</span>
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
    </header>
</template>

<script>
    import Search from './components/search'
    import  { hotelStatusApiSercers } from '../../entries/hotelStatus/api/API.js'
    import {formatStamp, changeMoney} from '../../common_libs/util.js'

    export default {
        name: 'AppHeader',
        components: {
            Search
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
                openSearchInput: false,
                searchValue: '',
                searchList: [],
                showSearchPanle: false
            }
        },
        methods: {
            handlerSearch () {
                hotelStatusApiSercers.findByContact({
                    contact: this.searchValue
                }).then(result => {
                    if (result.code === '000000') {
                        let tempResult = result.content
                        for (let i = 0, len = result.content.length; i < len; i++) {
                            tempResult[i].checkInAt = formatStamp(result.content[i].checkInAt)
                            tempResult[i].checkOutAt = formatStamp(result.content[i].checkOutAt)
                            tempResult[i].subTotal = changeMoney(result.content[i].subTotal)
                        }
                        this.searchList = tempResult
                        this.showSearchPanle = true
                        document.addEventListener('click', this.handlerDocumentMouseUP)
                    } else {
                        this.$Message.error(result.message);
                    }
                })
            },
            switchSubMenu (path) {
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
                    font-size: 18px;
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
                width: 30px;
                height: 30px;
                border-radius: 50%;
                overflow: hidden;
                background: pink;
                right: 0;
                float: right;
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
    }
</style>
