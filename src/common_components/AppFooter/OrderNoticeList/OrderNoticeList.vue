<template>
    <div class="order-notice-list">
        <Card class="card">
            <div class="card-header">
                <Tabs v-model="tabValue" @on-click="checkTab">
                    <!-- 直连助手 -->
                    <TabPane label="直连助手" name="left">
                        <div class="directAssistantList">
                            <div class="item" v-for="item in orderNoticeListData" :key="item.id" v-if="orderNoticeListData.length > 0">
                                <div class="item-status"></div>
                                <div class="item-info">
                                    <div class="item-left">
                                        <p>
                                            <span>订单号：{{item.orderNo}}</span>
                                            <span
                                                :class="{
                                                    'order-type': true,
                                                    'predetermine': item.orderType === 0,
                                                    'check-in': item.orderType === 1,
                                                    'unsubscribe': item.orderType === 2
                                                }"
                                                style="margin-left: 5px;"
                                            >
                                                {{ item.orderType === 0?'预':item.orderType === 1? '住':'退' }}
                                            </span>
                                            <span
                                                :class="{
                                                    'order-status': true,
                                                    'predetermine': false,
                                                    'check-in': true,
                                                    'unsubscribe': false
                                                }"
                                                style="margin-left: 5px;"
                                            >
                                                {{ item.orderStatus === 0?'新增':item.status === 1? '删除':'修改' }}
                                            </span>
                                        </p>
                                        <p>
                                            <span>飞燕居</span>
                                            <span>{{item.roomType}}</span>
                                            <span>1</span>
                                        </p>
                                        <p>
                                            <span>{{item.checkInData}} ~ {{item.checkOutData}}</span>
                                            <span>{{item.nights}}晚</span>
                                        </p>
                                    </div>
                                    <div class="item-right">
                                        <p>{{item.orderData}}</p>
                                        <p>{{item.name}}</p>
                                        <p>
                                            <span class="channelType">
                                                <span :class="['channel-logo', getChannelFrom(item.channelCode).className]">
                                                    <template v-if="!getChannelFrom(item.channelCode).className">
                                                        {{item.channelName.substring(0, 1)}}
                                                    </template>
                                                </span>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div v-if="orderNoticeListData.length == 0 && tabValue == 'left'">
                                <img src="../../../common_assets/imgs/no_data.png" alt="" style="height:80px;margin-top:20px">
                                <p style="font-size:14px;color:#999999FF">暂无数据</p>
                                <p style="color:#999999FF;margin-bottom:30px">...</p>
                            </div>
                        </div>
                    </TabPane>
                    <!-- 疯特管家 -->
                    <TabPane label="疯特管家" name="right">
                        <div class="ftButlerList">
                            <div class="item" v-for="item in ftButlerListData" :key="item.id" v-if="ftButlerListData.length > 0">
                                <div class="item-status" :style="{'marginTop':item.content.length > 38?'40px':'30px'}"></div>
                                <div class="item-info">
                                    <p class="item-info-top">
                                        <span class="item-info-top-title">{{item.title}}</span>
                                        <span class="item-info-top-time">{{item.time}}</span>
                                    </p>
                                    <p class="item-info-bottom">
                                        <span class="item-info-bottom-content" :title="item.content">{{item.content}}</span>
                                    </p>
                                </div>
                            </div>
                            <div v-if="ftButlerListData.length == 0 && tabValue == 'right'">
                                <img src="../../../common_assets/imgs/no_data.png" alt="" style="height:80px;margin-top:20px">
                                <p style="font-size:14px;color:#999999FF">暂无数据</p>
                                <p style="color:#999999FF;margin-bottom:30px">...</p>
                            </div>
                        </div>
                        
                    </TabPane>
                </Tabs>
                <span class="directAssistantNum">120</span>
                <span class="ftButlerNum">120</span>
            </div>
        </Card>
    </div>
</template>


<script>
    import {mapActions} from 'vuex'
    import {hotelStatusApiSercers} from '../../../entries/hotelStatus/api/API'
    import {
        getChannelFrom,
        trimAll
    } from 'common_libs/util'
    export default {
        name: 'orderNoticeList',
        // props: {
        //     orderNoticeListData: {
        //         type: Array,
        //         default: {
        //             list : [],
        //         }
        //     },
        //     ftButlerListData: {
        //         type: Array,
        //         default: {
        //             list : [],
        //         }
        //     }
        // },
        created() {
        },
        mounted() {
            this.orderNoticeListData = this.$parent.orderNoticeListData
            this.ftButlerListData = this.$parent.ftButlerListData
        },
        data() {
            return {
                getChannelFrom,
                tabValue:'left',
                orderNoticeListData:[],
                ftButlerListData:[]
            }
        },
        computed: {},
        methods: {
            checkTab() {
                if(this.tabValue == 'left'){
                    this.ftButlerListData = []
                    this.orderNoticeListData = this.$parent.orderNoticeListData
                }
                if(this.tabValue == 'right'){
                    this.orderNoticeListData = []
                    this.ftButlerListData = this.$parent.ftButlerListData
                }
            }
        }
    }
</script>

<style lang="scss">
    .order-notice-list {
        .order-status {
            display: inline-block;
            line-height: 20px;
            width: 40px;
            text-align: center;
            color: white;
            border-radius: 6px;
            vertical-align: middle;
            margin-right: 2px;
            vertical-align: middle;
            &.predetermine {
                background: #EA9A70;
            }
            &.check-in {
                background: #52ADF5;
            }
            &.unsubscribe {
                background: #C7C7C7;
            }
        }
        .order-type {
            display: inline-block;
            line-height: 20px;
            width: 20px;
            text-align: center;
            color: white;
            border-radius: 6px;
            vertical-align: middle;
            margin-right: 2px;
            vertical-align: middle;
            &.predetermine {
                background: #EA9A70;
            }
            &.check-in {
                background: #52ADF5;
            }
            &.unsubscribe {
                background: #C7C7C7;
            }
        }
        position: fixed;
        bottom: 50px;
        right: 20px;
        .card{
            width: 500px;
            .ivu-tabs-nav{
                margin-left: 16px;
                .ivu-tabs-ink-bar{
                    width: 56px !important;
                    left: 0px;
                }
                .ivu-tabs-tab{
                    padding: 8px 0px;
                    padding-right: 70px;
                }
            }
            .ivu-card-body{
                padding: 0
            }
            .card-header{
                text-align:center;
                position:relative;
                .directAssistantList{
                    max-height: 360px;
                    overflow: auto;
                    .item{
                        overflow: hidden;
                        height: 82px;
                        text-align: left;
                        margin-bottom: 10px;
                        .item-status{
                            float: left;
                            width: 7px;
                            height: 7px;
                            background:linear-gradient(225deg,rgba(255,127,81,1) 0%,rgba(255,28,0,1) 100%);
                            box-shadow:1px 1px 4px 0px rgba(255,35,5,0.2);
                            border-radius: 50%;
                            margin: 37px 5px 0 5px;
                        }
                        .item-info{
                            background: #E9F0F2;
                            overflow: hidden;
                            padding: 6px 10px;
                            font-size: 12px;
                            margin-right: 10px;
                            cursor: pointer;
                            .item-left{
                                float: left;
                                line-height: 24px;
                                color: #666666;
                            }
                            .item-right{
                                float: right;
                                line-height: 24px;
                                color: #999999;
                                text-align: right;
                                .channel-logo{
                                    width: 22px;
                                    height: 22px;
                                }
                            }
                        }
                    }
                }
                .ftButlerList{
                    max-height: 360px;
                    overflow: auto;
                    .item{
                        overflow: hidden;
                        text-align: left;
                        margin-bottom: 10px;
                        .item-status{
                            float: left;
                            width: 7px;
                            height: 7px;
                            background:linear-gradient(225deg,rgba(255,127,81,1) 0%,rgba(255,28,0,1) 100%);
                            box-shadow:1px 1px 4px 0px rgba(255,35,5,0.2);
                            border-radius: 50%;
                            margin: 30px 5px 0 5px;
                        }
                        .item-info{
                            background: #E9F0F2;
                            overflow: hidden;
                            padding: 6px 10px;
                            font-size: 12px;
                            margin-right: 10px;
                            cursor: pointer;
                            .item-info-top{
                                overflow:hidden;
                                .item-info-top-title{
                                    float:left;
                                    font-size:16px;
                                    color:#333333;
                                    font-family: MicrosoftYaHei;
                                }
                                .item-info-top-time{
                                    float:right;
                                    color:#999999
                                }
                            }
                            .item-info-bottom{
                                margin-top:6px;
                                .item-info-bottom-content{
                                    color:#666666;
                                    line-height:22px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    display: -webkit-box;
                                    -webkit-line-clamp: 2;
                                    -webkit-box-orient: vertical;
                                }
                            }
                        }
                    }
                }
                .directAssistantNum{
                    position:absolute;
                    width: 25px;
                    height: 18px;
                    background: #FBF3F3FF;
                    border-radius: 4px;
                    top:10px;
                    left:80px;
                    color:#E1544CFF;
                    font-size:12px;
                }
                .ftButlerNum{
                    position:absolute;
                    width: 25px;
                    height: 18px;
                    background: #FBF3F3FF;
                    border-radius: 4px;
                    top:10px;
                    left:222px;
                    color:#E1544CFF;
                    font-size:12px
                }
            }
        }
    }
</style>
