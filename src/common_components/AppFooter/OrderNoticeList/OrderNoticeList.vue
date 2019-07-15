<template>
    <div class="order-notice-list">
        <Card class="card">
            <div class="card-header">
                <Tabs v-model="tabValue" @on-click="checkTab">
                    <!-- 直连助手 -->
                    <TabPane label="直连助手" name="left">
                        <div class="directAssistantList custom-scrollbar"  @scroll="onScroll($event)" v-show="showLeft">
                            <div class="item" v-for="(item,index) in orderNoticeListData" :key="item.id" v-if="orderNoticeListData.length > 0" @click="checkOrder(item)">
                                <div class="item-status" :style="{'background':item.isRead == 1?'#fff':'red'}"></div>
                                <div class="item-info" :style="{'background':item.isRead == 1?'#FAFAFAFF':'#F5F9FAFF'}">
                                    <div class="item-left">
                                        <p style="color:#2F6CA3;font-size:14px;">{{returnHotelName(item.innId)}}</p>
                                        <p>
                                            <span class="otaOrderNo">订单号：{{item.messageContent.otaOrderNo}}</span>
                                            <!-- <span
                                                v-if="getChannelFrom(findOrderFromById(item.messageContent.orderFrom).channelCode).playType"
                                                :class="['pay-marker',
                                                getChannelFrom(findOrderFromById(item.messageContent.orderFrom).channelCode).playType]"
                                            >
                                                {{getChannelFrom(findOrderFromById(item.messageContent.orderFrom).channelCode).playTypeName.substr(0, 1)}}
                                            </span>
                                            <span
                                                :class="{
                                                    'order-status': true,
                                                    'predetermine': item.topic === 3,
                                                    'check-in': item.topic === 1,
                                                    'unsubscribe': item.topic === 2
                                                }"
                                            >
                                                {{ item.topic === 1?'新增':item.topic === 2? '取消':'修改' }}
                                            </span> -->
                                        </p>
                                        <p>
                                            <!-- <span>{{item.messageContent.rooms}}</span> -->
                                            <span style="margin-right:10px">{{item.messageContent.roomType}}</span>
                                            <span>{{item.messageContent.rooms}}间</span>
                                        </p>
                                        <p>
                                            <span>{{item.messageContent.start}} ~ {{item.messageContent.end}}</span>
                                            <span><Icon type="ios-moon"  class="moonIcon"/>{{item.nights}}晚</span>
                                        </p>
                                    </div>
                                    <div class="item-right">
                                        <p>
                                            <span
                                                v-if="getChannelFrom(findOrderFromById(item.messageContent.orderFrom).channelCode).playType"
                                                :class="['pay-marker',
                                                getChannelFrom(findOrderFromById(item.messageContent.orderFrom).channelCode).playType]"
                                            >
                                                {{getChannelFrom(findOrderFromById(item.messageContent.orderFrom).channelCode).playTypeName.substr(0, 1)}}
                                            </span>
                                            <span
                                                :class="{
                                                    'order-status': true,
                                                    'predetermine': item.topic === 3,
                                                    'check-in': item.topic === 1,
                                                    'unsubscribe': item.topic === 2
                                                }"
                                            >
                                                {{ item.topic === 1?'新增':item.topic === 2? '取消':'修改' }}
                                            </span>
                                        </p>
                                        <p>{{item.createAt}}</p>
                                        <p class="contactName">{{item.messageContent.contactName}}</p>
                                        <p>
                                            <span class="channelType">
                                                <span :class="['channel-logo', getChannelFrom(returnChannelCode(item.messageContent.orderFrom).channelCode).className]">
                                                    <template v-if="!getChannelFrom(returnChannelCode(item.messageContent.orderFrom).channelCode).className" style="color:red">
                                                        {{returnChannelCode(item.messageContent.orderFrom).channelName?returnChannelCode(item.messageContent.orderFrom).channelName:'无'}}
                                                    </template>
                                                </span>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div v-if="orderNoticeListData.length == 0 && tabValue == 'left'" class="no-data">
                                <img src="../../../common_assets/imgs/no_data.png" alt="">
                                <p>暂无数据</p>
                                <p>...</p>
                            </div>
                        </div>
                    </TabPane>
                    <!-- 疯特管家 -->
                    <TabPane label="疯特管家" name="right">
                        <div class="ftButlerList" v-show="!showLeft">
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
                            <div v-if="ftButlerListData.length == 0 && tabValue == 'right'"  class="no-data">
                                <img src="../../../common_assets/imgs/no_data.png" alt="">
                                <p>暂无数据</p>
                                <p>...</p>
                            </div>
                        </div>
                        
                    </TabPane>
                </Tabs>
                <span class="directAssistantNum" v-show="Number(helperCount) > 0">{{helperCount}}</span>
                <span class="ftButlerNum" v-show="false">0</span>
            </div>
        </Card>
        <Modal v-model="modal2">
            <p slot="header" style="text-align:center">
                <Icon type="information-circled"></Icon>
                <span style="font-size:18px;">提示</span>
            </p>
            <div style="text-align:center">
                <p style="font-size:16px;color:#000">是否切换到 <span style="color:#235f92">{{returnHotelName(changeData.innId)}}</span> 门店查看？</p>
            </div>
            <div slot="footer">
                <i-button type="warning" size="large" @click="modal2 = false">取消</i-button>
                <i-button type="primary" size="large" @click="switchHotel">确定</i-button>
            </div>
        </Modal>
    </div>
</template>


<script>
    import {mapActions} from 'vuex'
    import {
        hotelStatusApiSercers
    } from 'hotelStatus/api/API'
    import {
        publicHttpServer
    } from '@/api/api'
    import {
        getChannelFrom,
        trimAll,
        setCookie
    } from 'common_libs/util'
    export default {
        name: 'orderNoticeList',
        created() {
        },
        mounted() {},
        data() {
            return {
                getChannelFrom,
                tabValue:'left',
                showLeft: true,
                modal2:false,
			    changeData:{}
                // orderNoticeListData:[]
            }
        },
        computed: {
            orderNoticeListData() {
                return this.$parent.orderNoticeListData
            },

            ftButlerListData() {
                return this.$parent.ftButlerListData
            },

            helperCount() {
                return this.$parent.helperCount
            },

            orderFromList () {
                return this.$store.getters.orderFromList
            },
            hotelList () {
                let hotelList = this.$store.getters.hotelList
                return hotelList
            },
            userInfo () {
                let userInfo = this.$store.getters.userInfo
                return userInfo
            }
        },
        methods: {
            checkTab() {
                this.tabValue == 'left' ? this.showLeft = true : this.showLeft = false
            },
            onScroll(event) {
                this.$parent.onScroll(event)
            },

            // 订单状态
            turnOrderStatus(status) {
                switch(status) {
                    case 0:
                        return '预'
                        break;
                    case 1:
                        return '住'
                        break;
                    case 2:
                        return '退';
                        break;
                    case 3:
                        return '消'
                        break;
                    default:
                        return '预'
                }
            },

            // 查看订单
            checkOrder(item) {
                if(this.$parent.helperCount > 0){
                    this.$parent.helperCount--
                }
                item.isRead = 1
                if(item.topic == 2){
                    //取消的订单无法点击
                    return
                }
                // 不是当前客栈的订单
                if(item.innId != this.userInfo.innId){
                    this.changeData = item;
                    this.modal2 = true;
                    return;
                }
                let orderId = item.messageContent.orderId
                hotelStatusApiSercers.getOrderInfoByOrderId(orderId).then(result => {
                    if (result.content && result.code === '000000') {
                        this.$root.Bus.$emit('on-bus-look-order-detail', result.content,'look', (res) => {
                            console.log('订单详情')
                        })
                    }else{
                        this.$Message.error(result.message)
                    }
                })
            },
            // 根据渠道daid返回渠道信息
            returnChannelCode(id) {
                let list = this.$store.state.orderFromList
                let result = { channelCode: '',channelName:'' }
                for(let z = 0;z < list.length;z++){
                    if(id == list[z].id){
                        result = list[z]
                    }
                }
                return result
            },

            findOrderFromById (fromId) {
                return this.orderFromList.filter(item => item.id === fromId)[0]
            },

            // 返回客栈名
            returnHotelName(id) {
                let hotelList = this.hotelList;
                let res = ''
                for(let z = 0;z < hotelList.length;z++){
                    if(id == hotelList[z].innId){
                        res = hotelList[z].innName
                    }
                }
                return res
            },

            // 切换客栈
            switchHotel () {
                publicHttpServer.switchHotel({
                    innId: this.changeData.innId
                }).then(res => {
                    if (res.code === '000000' && res.content) {
                        let { token, innId, userId } = res.content
                        setCookie('token', token)
                        setCookie('innId', innId)
                        setCookie('userId', userId)
                        window.location.reload()
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .order-notice-list {
        position: fixed;
        bottom: 58px;
        right: 20px;
        z-index: 100;
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
            box-shadow:0px 2px 9px 0px rgba(78,76,152,0.15);
            &.predetermine {
                background:linear-gradient(223deg,rgba(186,219,118,1) 0%,rgba(101,197,62,1) 100%);
            }
            &.check-in {
                background:linear-gradient(225deg,rgba(91,168,244,1) 0%,rgba(31,135,237,1) 100%);
            }
            &.unsubscribe {
                background:rgba(239,239,239,1);
                color: #BABABAFF;
            }
        }
        .otaOrderNo{
            margin-right: 5px;
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
            &.predetermine {
                background:linear-gradient(231deg,rgba(255,210,90,1) 0%,rgba(255,175,45,1) 100%)
            }
            &.check-in {
                background: #52ADF5;
            }
            &.unsubscribe {
                background: #C7C7C7;
            }
        }
        .pay-marker {
            height: 20px;
            width: 20px;
            display: inline-block;
            border-radius:6px;
            line-height: 20px;
            vertical-align: middle;
            text-align: center;
            box-shadow:2px 2px 6px 0px rgba(245,166,35,0.34);
            color: #fff;
            margin-right:5px;
            &.before {
                background: linear-gradient(231deg,rgba(255,210,90,1) 0%,rgba(255,175,45,1) 100%);
                box-shadow: 2px 2px 6px 0px rgba(245,166,35,0.34);
            }
            &.now {
                background:linear-gradient(225deg,rgba(25,199,197,1) 0%,rgba(21,176,168,1) 100%);
                box-shadow:2px 2px 6px 0px rgba(21,177,170,0.5);
            }
            &.quickly {
                background:linear-gradient(51deg,rgba(164,156,234,1) 0%,rgba(161,157,249,1) 100%);
                box-shadow:0px 2px 9px 0px rgba(97,76,152,0.15);
            }
            // &.single {
            //     top: initial;
            //     bottom: 8px;
            // }
        }
        .card{
            width: 500px;
            .ivu-tabs-nav{
                margin-left: 16px;
                .ivu-tabs-ink-bar{
                    width: 56px !important;
                    left: 0px;
                    background: #2F6CA3FF
                }
                .ivu-tabs-tab-active{
                    color: #2F6CA3FF !important;
                }
                .ivu-tabs-tab{
                    padding: 8px 0px;
                    padding-right: 70px;
                }
                .ivu-tabs-tab:hover{
                    color: #2F6CA3FF !important;
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
                        height: 112px;
                        text-align: left;
                        margin-bottom: 10px;
                        .item-status{
                            float: left;
                            width: 7px;
                            height: 7px;
                            // background:linear-gradient(225deg,rgba(255,127,81,1) 0%,rgba(255,28,0,1) 100%);
                            box-shadow:1px 1px 4px 0px rgba(255,35,5,0.2);
                            border-radius: 50%;
                            margin: 49px 5px 0 5px;
                        }
                        .item-info{
                            background: #E9F0F2;
                            overflow: hidden;
                            padding: 6px 10px;
                            font-size: 12px;
                            margin-right: 8px;
                            cursor: pointer;
                            .item-left{
                                float: left;
                                line-height: 24px;
                                color: #666666;
                                .moonIcon{
                                    color:#DFCB99FF;
                                    margin-top:-2px;
                                    font-size:14px;
                                    margin-left:16px
                                }
                            }
                            .item-right{
                                float: right;
                                line-height: 24px;
                                color: #999999;
                                text-align: right;
                                .contactName{
                                    width:240px;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    text-overflow: ellipsis
                                }
                                .channel-logo{
                                    // background: #EAEAEAFF;
                                    width: 22px;
                                    height: 22px;
                                }
                            }
                        }
                        .item-info:hover{
                            background: #E9F0F2FF !important
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
                            // background: #E9F0F2;
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
                .no-data{
                    img{
                        height:80px;
                        margin-top:26px
                    }
                    p:nth-child(2){
                        font-size:14px;
                        color:#999999FF
                    }
                    p:nth-child(3){
                        color:#999999FF;
                        margin-bottom:30px
                    }
                }
            }
        }
    }
</style>
