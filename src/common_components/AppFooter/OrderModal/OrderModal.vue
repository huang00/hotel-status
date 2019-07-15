<template>
    <div class="order-modal">
        <app-modal
            v-model="modal"
            :width="650"
            :height="returnHeight()"
            :title="data.type == 1 ?'今日预到' + `(${data.list.length})`:'今日预离' + `(${data.list.length})`"
            >
            <div class="custom-scrollbar" v-if="data.list.length > 0">
                <div class="item-wrap" v-for="item in data.list" :key="item.id">
                    <div class="item-left">
                        <p>
                            <Icon type="md-person" class="icon"/>
                            <span class="name" :title="item.contactName">{{item.contactName}}</span>
                            <span
                                class="channelType"
                                :title="item.channelName"
                            >
                                <span
                                    :class="['channel-logo', getChannelFrom(findOrderFromById(item.orderFrom).channelCode).className]"
                                    :style="{
                                        color: findOrderFromById(item.orderFrom).channelColor
                                    }"
                                >
                                    <template v-if="!getChannelFrom(findOrderFromById(item.orderFrom).channelCode).className">
                                        {{item.channelName.substring(0, 1)}}
                                    </template>
                                </span>
                                {{item.channelName}}
                            </span>
                            <span class="order-ticket connect" v-if="item.otaOrderNo"> 直连 </span> 
                            <!-- <span class="order-ticket quickly"> 闪住 </span> -->
                        </p>
                        <p>
                            <span class="roomInfo" :title="item.roomTypeName + item.roomNo">
                                {{item.roomTypeName}}
                                {{item.roomNo}}
                            </span>
                            <span class="date">
                                {{item.checkInAt}} — {{item.checkOutAt}}
                            </span>
                            <span class="price" :title="item.subTotal.toFixed(2)">
                                ￥{{item.subTotal.toFixed(2)}}
                            </span>
                        </p>
                    </div>
                    <div class="item-right">
                        <button :class="data.type == 1 ? 'check-in' : 'check-out'" @click="handleOrder(item)">
                            {{data.type == 1 ? '办理入住' : '办理退房'}}
                        </button>
                    </div>
                </div>
            </div>
            <div class="no-data-wrap" v-if="data.list.length == 0">
                <img src="../../../common_assets/imgs/no_data.png" alt="">
                <p>暂无数据</p>
                <p>...</p>
            </div>
        </app-modal>
    </div>
</template>


<script>
    import {mapActions} from 'vuex'
    import {hotelStatusApiSercers} from '../../../entries/hotelStatus/api/API'
    import AppModal from 'common_components/AppModal/'
    import {
        getChannelFrom,
        trimAll
    } from 'common_libs/util'
    export default {
        name: 'orderModal',
        props: {
            data: {
                type: Object,
                default: {
                    type : 1,
                    list : [],
                }
            },
        },
        components: {
            AppModal
        },
        data() {
            return {
                getChannelFrom,
                modal: false
            }
        },
        computed: {},
        methods: {
            handleOrder(item) {
                let orderId = item.orderId
                // 根据id获取订单详情
                hotelStatusApiSercers.getOrderInfoByOrderId(orderId).then(result => {
                    if (result.content && result.code === '000000') {
                        // 办理入住
                        let modalType = this.data.type == 1 ?
                            'check-in' : 'check-out'
                        this.$root.Bus.$emit('on-bus-look-order-detail', result.content, modalType, res => {
                            this.modal = false
                        })
                    }
                })
            },
            returnHeight() {
                if(Number(this.data.list.length) == 0){
                    return 342
                }
                if(Number(this.data.list.length) < 3){
                    return 65 + 85 * Number(this.data.list.length)
                }else{
                    return 342
                }
            },
            findOrderFromById (fromId) {
                if (!fromId)
                    return '#ccc'
                let orderFromList = this.$store.getters.orderFromList
                return orderFromList.filter(item => item.id === fromId)[0]
            }
        }
    }
</script>

<style lang="scss">
    .order-modal {
        .no-data-wrap{
            text-align:center;
            margin-top:50px;
            color:#999999FF;
        }
        .custom-scrollbar{
            max-height: 258px;
            overflow: auto
        }
        .item-wrap{
            padding:0 10px;
            height: 66px;
            background: #F5F9FAFF;
            overflow: hidden;
            margin-top:20px;
            cursor: pointer;
            .item-left{
                float: left;
                padding-left: 17px;
                border-left: 2px solid #1F5A8EFF;
                line-height: 33px;
                width: calc(100% - 120px);
                .icon{
                    font-size: 20px;
                    margin-top: -2px;
                }
                .name{
                    display: inline-block;
                    font-size: 18px;
                    color: #1F5A8EFF;
                    vertical-align: middle;
                    margin-left: 15px;
                    width: 100px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
                .channelType{
                    display: inline-block;
                    font-size: 14px;
                    width: 100px;
                    color: #666666;
                    vertical-align: middle;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    .channel-logo{
                        width: 19px;
                        height: 19px;
                        line-height: 19px;
                        margin-right: 5px;
                        background-color: #CDCDCD;
                    }
                }
                .order-ticket {
                    width:31px;
                    line-height:18px;
                    border-radius:6px;
                    color: white;
                    display: inline-block;
                    text-align: center;
                    &.connect {
                        background:linear-gradient(270deg,rgba(234,166,166,1) 0%,rgba(214,119,119,1) 100%);
                    }
                    &.quickly {
                        background:linear-gradient(270deg,rgba(154,199,225,1) 0%,rgba(94,155,203,1) 100%);
                    }
                }
                .roomInfo{
                    display: inline-block;
                    overflow: hidden;
                    width: 244px;
                    font-size:14px;
                    color: #999999;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    float: left;
                }
                .date{
                    display: inline-block;
                    overflow: hidden;
                    width: 120px;
                    font-size:14px;
                    color: #999999;
                }
                .price{
                    float: right;
                    display: inline-block;
                    overflow: hidden;
                    font-size:14px;
                    color: #D67777FF;
                    width: 82px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
            }
            .item-right{
                width: 120px;
                margin-top: 17px;
                float: right;
            }
        }
        .item-wrap:hover{
            background: #E9F0F2FF
        }
        .item-wrap:nth-child(1){
            margin-top: 0
        }
        button {
            border: 0;
            cursor: pointer;
            outline: none;
            width: 110px;
            height: 32px;
            border-radius: 17px;
            font-size: 14px;
            &:not(.cancle) {
                float: right;
                color: white;
            }
            &.cancle {
                background:linear-gradient(270deg,rgba(243,243,243,1) 0%,rgba(224,224,224,1) 100%);
                box-shadow:2px 2px 8px 0px rgba(183,183,183,0.34);
            }
            &.update {
                background:linear-gradient(270deg,rgba(153,200,135,1) 0%,rgba(79,152,55,1) 100%);
                box-shadow:2px 2px 8px 0px rgba(169,242,156,0.45);
            }
            &.check-in {
                background:linear-gradient(270deg,rgba(138,173,197,1) 0%,rgba(75,136,188,1) 100%);
                box-shadow:2px 2px 8px 0px rgba(56,120,178,0.33);
            }
            &.check-out {
                background:linear-gradient(270deg,rgba(221,175,141,1) 0%,rgba(184,91,43,1) 100%);
                box-shadow:2px 2px 8px 0px rgba(242,191,156,0.45);
            }
            &.predetermine {
                background:linear-gradient(270deg,rgba(147,202,240,1) 0%,rgba(83,167,233,1) 100%);
                box-shadow:2px 2px 8px 0px rgba(56,120,178,0.33);
            }
            &.repair {
                background:linear-gradient(270deg,rgba(224,144,144,1) 0%,rgba(195,78,45,1) 100%);
                box-shadow:2px 2px 8px 0px rgba(242,191,156,0.45);
            }
            &.confirm {
                background:linear-gradient(270deg,rgba(138,173,197,1) 0%,rgba(75,136,188,1) 100%);
                box-shadow:2px 2px 8px 0px rgba(56,120,178,0.33);
            }
        }
        .modal-body{
            padding: 20px 0!important
        }
        .modal-footer{
            display: none !important
        }
    }
</style>
