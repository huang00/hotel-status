<template>
    <div class="informationLookingModal">
        <!-- <div class="close" @click="closeLookModal"><i class="iconfont icon-guanbi-"></i></div> -->
        <div class="modalHeader">
            <div class="label"></div>
            <span class="modalName">订单信息</span>
        </div>
        <div class="modalBody">
            <div class="userInfo">
                <div class="label">联系人信息</div>
                <div class="userInfoEdit">
                    <div class="userName">
                        姓名：<span>{{ dataObj.contactName }}</span>
                    </div>
                    <div class="userMobile">
                        电话：<span>{{ dataObj.contactPhone }}</span>
                    </div>
                    <div class="userResource">
                        来源：<span>{{ orderFromList[dataObj.orderFrom] }}</span>
                    </div>
                </div>
            </div>
            <div class="consumptionInfoLook">
                <div class="label">
                    <p class="tabName">消费信息</p>
                </div>
                <div class="userConsumptionEdit" v-for="(item, index) in dataObj.suborders" :key="index" >
                    <div class="userConsumInfo" style="padding:15px 0px 0">
                        <p class="status reserveBgColor" v-if="item.status === 0">预</p>
                        <p class="status checkInBgcolor" v-if="item.status === 1">住</p>
                        <p class="status checkOutBgcolor" v-if="item.status === 2">退</p>
                        <p class="marginLeftTwenty roomName">房间：<span> {{rowData.roomNo[index]}} </span></p>
                        <p class="marginLeftFifty">
                            入离时间：<span> {{ formatDate(item.checkInDate) }} </span>入住——<span> {{ formatDate(item.checkOutDate)}} </span>离店</p>
                        <p class="marginLeftTwenty">&nbsp;&nbsp;<span> {{dayTotal(item.checkInDate, item.checkOutDate)}} </span>晚</p>
                        <p class="marginLeftFifty">金额：￥<span>{{toDecimal2(item.suborderAmount/100 || 0)}}</span></p>
                        <p class="dropdown"
                           v-if="(item.status === 1||item.status === 2)" @click="item.canDropDownIsTrue = !item.canDropDownIsTrue">
                            <Icon v-if="item.canDropDownIsTrue" class="dropdownI" type="ios-arrow-down"></Icon>
                            <Icon v-if="!item.canDropDownIsTrue" class="dropdownI" type="ios-arrow-up"></Icon>
                        </p>
                    </div>
                    <div class="clinteInfo" v-for="(subItem, key) in item.clients" :key="key" v-if="item.canDropDownIsTrue">
                        <p>姓名：<span>{{subItem.name}}</span></p>
                        <p>电话：<span>{{subItem.phone}}</span></p>
                        <p><span>身份证：</span><span>{{subItem.identityNo}}</span></p>
                    </div>
                </div>
            </div>
            <div class="financeInfo">
                <div class="label">
                    <p class="tabName">财务记录</p>
                </div>
                <div class="financeDetaileInfo"
                     v-for="(item, value) in dataObj.records" :key="value"
                     :style="dataObj.records.length-1===value?'border-bottom:1px dashed #aaa':'border:none'">
                    <div class="financeEdit">
                        <p class="financeDetaile">
                            <span class="financeType">{{financeTypeName[item.financeType]}}</span>
                            <span class="paymentId marginLeftEighty">{{paymentName[item.paymentId]}}</span>
                            <span v-if="item.financeType<4" class="price reserveFontColor">+￥{{toDecimal2(item.price / 100 || 0)}}</span>
                            <span v-if="item.financeType>3" class="price errorFontcolor">-￥{{toDecimal2(item.price / 100 || 0)}}</span>
                        </p>
                    </div>
                </div>
                <div class="orderSmallPlan">
                    <p class="orderDetaile">订单总额：￥<span class="price">{{toDecimal2(dataObj.totalAmount/100 || 0)}}</span></p>
                    <p class="orderDetaile">已收款：￥<span class="price">{{toDecimal2(dataObj.paidAmount/100 || 0)}}</span></p>
                    <p class="orderDetaile">需补：￥<span class="price">{{ toDecimal2((dataObj.totalAmount-dataObj.paidAmount)/100 || 0)}}</span></p>
                </div>
            </div>
            <div class="orderNote">
                <p> 备注：<span class="content">{{openOrder.remarks}}</span></p>
            </div>
            <div class="userNotify" v-if="false">
                <p> 提醒：<span class="content">这里是提醒</span></p>
            </div>
        </div>
        <!-- <div class="modalFoot isScorllAndBoxShadow">
            <div class="updateOrder" @click="openUpdataModal">确认</div>
        </div> -->
    </div>
</template>
<script>
    import { toDecimal2, getCookie } from 'common_libs/util.js'
    import {hotelOrderApiServers} from '../../../api/API'

    export default {
        name: 'orderDetailLooking',
        props: ['rowData'],
        data() {
            return {
                showCheckOutBox: false,
                orderStatus: false,
                orderId: false,
                subOrderId: false,
                toDecimal2,
                openOrder: {},
                thisResOrder: {},
                financeInfo:
                [
                    {
                        financeType: 1,
                        price: 0,
                        paymentId: 1,
                    }
                ],
                dataObj: {},
                financeTypeName: [undefined, '收取定金', '收取房费', '收取押金', '退还定金', '退还房费', '退还押金'],
                paymentName: [undefined, '现金', '支付宝', '微信', '银联', '去哪儿代收', '美团代收', '携程代收', '艺龙代收', '飞猪代收', '其它'],
                orderFromList: {}
            }
        },
        computed: {
            hotelOrderPaymentList() {
                // return this.$store.state.hotelStatus.hotelOrderPaymentList;
            },
            hotelOrderFinanceTypeList() {
                // return this.$store.state.hotelStatus.hotelOrderFinanceTypeList;
            },
            hotelRoomTypeAndRoomList() {
                // return this.$store.state.hotelStatus.hotelRoomTypeAndRoomList;
            },
        },
        mounted() {
        },
        methods: {
            closeLookModal() {
                // this.dispatchWatchOpenLookingModal({
                //     isOpen: false
                // });
                // this.showCheckOutBox = false;
            },
            formatDate (timeStamp) {
                let date = new Date(timeStamp),
                    year = date.getFullYear(),
                    month = date.getMonth() + 1,
                    day = date.getDate();
                return `${year}-${month}-${day}`
            },
            dayTotal (startDate, endDate) {
                startDate = +new Date(startDate)
                endDate = +new Date(endDate)
                return Math.floor((endDate - startDate)/ (1000 * 60 * 60 * 24))
            },
            getData () {
                hotelOrderApiServers.getOrderDetail(this.rowData.id).then(resutl => {
                    if (resutl.code === '000000') {
                        let list = resutl.content.suborders
                        for (let i = 0, len = list.length; i < len; i++) {
                            list[i].canDropDownIsTrue = true
                        }
                        this.dataObj = resutl.content
                        this.dataObj.suborders = list
                    }
                })
            },
            /* 获取支付方式 */
            getPayment () {
                hotelOrderApiServers.getPayment().then(resutl => {
                    if (resutl.code === '000000') {
                        let list = resutl.content
                        for (let i = 0, len = list.length; i < len; i++) {
                            this.paymentName[list[i].id] = list[i].name
                        }
                    }
                })
            },
            /* 获取订单来源 */
            getOrderFrom () {
                hotelOrderApiServers.getOrderFrom({
                    userId: getCookie('userId'),
                    innId: getCookie('innId')
                }).then(resutl => {
                    if (resutl.code === '000000') {
                        let list = resutl.content
                        for (let i = 0, len = list.length; i < len; i++) {
                            this.orderFromList[list[i].id] = list[i].channelName
                        }
                        let arr = JSON.parse(JSON.stringify(this.orderFromList))
                        this.orderFromList = arr
                    }
                })
            }
        },
        created() {
            this.getPayment()
            this.getOrderFrom()
            this.getData()
        },
    }
</script>
<style lang="scss" scoped>
    @import "../../../../../common_assets/basic_const";

    .informationLookingModal {
        width: 100%;
        height: 100%;
        padding: 25px 0;
        position: relative;
        .close {
            width: 35px;
            height: 35px;
            background-color: rgba(0, 0, 0, 0.2);
            position: absolute;
            top: 5px;
            right: -35px;
            text-align: center;
            line-height: 35px;
            cursor: pointer;
            i {
                font-size: 22px;
                color: #fff;
            }
        }
        .modalHeader {
            width: 95%;
            height: 35px;
            margin: 0 auto;
            border-bottom: 1px solid #CECECE;
            display: flex;
            justify-content: flex-start;
            .label {
                width: 6px;
                height: 20px;
                background-color: #338EF3;
            }
            .modalName {
                font-size: 18px;
                color: #000;
                margin-left: 10px;
                line-height: 20px;
                font-weight: 500;
            }
        }
        .leftFivePx {
            margin-left: 5px;
        }
        .leftTwenty {
            margin-left: 30px;
        }
        .modalBody {
            width: 100%;
            padding: 0 20px;
            height: 460px;
            overflow: auto;
            .userInfo {
                width: 100%;
                height: 60px;
                border-bottom: 1px solid #CECECE;
                padding: 5px 155px 16px 20px;
                .label {
                    font-size: 14px;
                    color: #000;
                    font-weight: 500;
                }
                .userInfoEdit {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    .userName {
                        position: relative;
                    }

                }
            }
            .consumptionInfoLook {
                width: 100%;
                border-bottom: 1px solid #CECECE;
                padding: 8px 20px;
                .label {
                    display: flex;
                    justify-content: space-between;
                    .tabName {
                        font-size: 14px;
                        color: #000;
                        font-weight: 500;
                    }
                }
                .userConsumptionEdit {
                    position: relative;
                    .userConsumInfo {
                        width: 100%;
                        display: flex;
                        padding: 15px 5px;
                        position: relative;
                        justify-content: flex-start;
                        .roomName {
                            min-width: 135px;
                            max-width: 195px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .status {
                            width: 20px;
                            height: 20px;
                            text-align: center;
                            line-height: 20px;
                            color: #fff;
                        }
                        .dropdown {
                            position: absolute;
                            top: 15px;
                            right: 25px;
                            .dropdownI {
                                font-size: 25px;
                                margin-top: -3px;
                                cursor: pointer;
                            }
                        }
                        .CanCheckOut {
                            position: absolute;
                            top: 15px;
                            right: 25px;
                            width: 16px;
                            height: 16px;
                            border: 1px solid #AAAAAA;
                            border-radius: 3px;
                            cursor: pointer;
                            .checkTrue {
                                font-size: 50px;
                                margin-top: -20px;
                            }
                        }
                        .marginLeftTwenty { margin-left: 20px; }
                        .marginLeftFifty { margin-left: 20px; }
                    }
                    .CanCheckInBox {
                        position: absolute;
                        top: 15px;
                        right: 25px;
                        width: 16px;
                        height: 16px;
                        border: 1px solid #AAAAAA;
                        border-radius: 3px;
                        .checkTrue {
                            font-size: 50px;
                            margin-top: -20px;
                        }
                    }
                    .clinteInfo {
                        width: 100%;
                        height: 48px;
                        background-color: #E5E5E5;
                        display: flex;
                        justify-content: space-between;
                        padding: 5px 25px;
                        line-height: 43px;
                        p {
                            width: 31%;
                        }
                    }
                }
                .userConsumptionEdit:last-child {
                    border-bottom: none;
                }
            }
            .financeInfo {
                width: 100%;
                border-bottom: 1px solid #CECECE;
                padding: 8px 20px;
                .label {
                    display: flex;
                    justify-content: space-between;
                    .tabName {
                        font-size: 14px;
                        color: #000;
                        font-weight: 500;
                    }
                    .addMoer {
                        color: #1987ED;
                        font-size: 14px;
                        cursor: pointer;
                        font-weight: 500;
                        .addThis {
                            color: #1987ED;
                            border: 1px solid #1987ED;
                            width: 18px;
                            height: 18px;
                            line-height: 0;
                        }
                    }
                }

                .financeDetaileInfo {
                    .financeEdit {
                        width: 100%;
                        height: 35px;
                        display: flex;
                        padding: 10px 5px;
                    }
                    .marginLeftEighty {
                        display: inline-block;
                        width: 180px;
                        padding-left: 60px;
                    }
                }
                .financeEdit {
                    width: 100%;
                    height: 45px;
                    display: flex;
                    padding: 10px 5px;
                    .deliteThis {
                        margin-top: 5px;
                        color: #FF0000;
                        border: 1px solid #FF0000;
                        line-height: 18px;
                        width: 18px;
                        height: 18px;
                    }
                }
                .orderSmallPlan {
                    width: 60%;
                    margin-top: 10px;
                    margin-left: 45%;
                    display: flex;
                    justify-content: flex-start;
                    .orderDetaile {
                        color: #000;
                        font-size: 14px;
                        font-weight: 500;
                        margin-left: 15px;
                        .price {
                            color: #F91C60;
                            font-size: 16px;
                        }
                    }
                }
            }
            .orderStatus .orderSmallPlan {
                padding: 0 262px 0 0;
            }
            .orderNote, .userNotify {
                padding: 15px 20px;
                width: 100%;
                color: #000;
                font-weight: 500;
                font-size: 14px;
                .content {
                    color: #aeaeae;
                }
            }
            .userNotify {
                padding: 0 20px;
            }
        }
        .isScorllAndBoxShadow {
            box-shadow: 0px -3px 9px rgba(219, 219, 219, 1)
        }
        .modalFoot {
            position: absolute;
            width: 100%;
            display: flex;
            bottom: 0;
            padding: 5px 165px;
            height: 40px;
            justify-content: space-around;
            .updateCheckIn, .updateOrder, .cancelOrder, .cheOutOrder {
                width: 120px;
                height: 30px;
                border-radius: 19px;
                text-align: center;
                color: #fff;
                font-size: 14px;
                line-height: 30px;
                font-weight: 500;
                cursor: pointer;
            }
            .updateCheckIn {
                background-color: #1F96FC;
            }
            .updateOrder {
                background-color: #EBB309
            }
            .cheOutOrder {
                background-color: #EE3333
            }
            .cancelOrder {
                color: #878787;
                border: 1px solid #AAAAAA;
                background-color: #fff
            }
            /*.leftBtn {*/
            /*width: 40%;*/
            /*display: flex;*/
            /*justify-content: space-between;*/

            /*}*/
            /*.rightBtn {*/
            /*width: 40%;*/
            /*display: flex;*/
            /*justify-content: space-between;*/
            /*}*/
        }
    }
</style>
