<template>
    <div class="suborder-item padding-l-r-10">
        <!-- 编辑 -->
        <div class="edit" key="100" v-if="edit">
            <div style="margin-bottom: 20px;"
                v-for="(item, index) in data.suborders" :key="index">
                <div class="edit-container" :style="editContainerStyle">
                    <div
                        class="checkbox"
                        v-if="(!hideCheckbox && orderOprType !== 'check-in') || (orderOprType === 'check-in' && !item.fixedNotCheck)"
                        @click="switchChecked(item)"
                    >
                        <Icon type="md-checkmark-circle" size="18" color="#286094" v-if="item.checked"/>
                        <Icon type="md-radio-button-off" size="18" color="#286094" v-else/>
                    </div>
                    <div class="suborder-info flex">
                        <div class="room-type flex-item">
                            <span
                                :class="{
                                    'order-status': true,
                                    'predetermine': item.status === 0,
                                    'check-in': item.status === 1,
                                    'unsubscribe': item.status === 2
                                }"
                                style="margin-left: 3px;"
                            >
                                {{ item.status === 0?'预':item.status === 1? '住':'退' }}
                            </span>
                            <Select
                                style="width:197px;
                                margin-left: 5px;"
                                @on-change="onChangeRoom(item)"
                                :disabled="
                                    !item.checked && orderOprType === 'check-in'
                                "
                                v-model="item.roomId">
                                <Option
                                    v-for="item in roomList" :key="item.id"
                                    :value="item.roomId">
                                    {{item.roomTypeName}}&nbsp;&nbsp;{{ item.roomNo }}
                                </Option>
                            </Select>
                            <span class="wraning" v-if="item.roomIdErrMsg">
                                <span style="font-size: 14px;">
                                    <Icon type="md-alert" />
                                    {{ item.roomIdErrMsg }}
                                </span>
                            </span>
                        </div>
                        <div class="check-in flex-item">
                            <DatePicker
                                :disabled="
                                    orderOprType === 'check-in' ||
                                    (item.status === 2 && !!item.id) ||
                                    item.status === 1 ||
                                    !!data.otaOrderNo
                                "
                                :options="checkInDateOptions"
                                type="date"
                                :clearable="false"
                                :editable="false"
                                placeholder="选择入住时间"
                                v-model="item.checkInDateView"
                                @on-change="handlerNights(item)"
                                style="width: 143px">
                            </DatePicker>
                            <Select
                                @on-change="handlerNights(item)"
                                v-model="item.nights"
                                :disabled="
                                    (!item.checked && orderOprType === 'check-in') ||
                                    (item.status === 2 && !!item.id) ||
                                    !!data.otaOrderNo
                                "
                                style="width:74px; margin-left: 10px;">
                                <Option
                                    v-for="item in 60" :key="item"
                                    :value="item"> {{item}} 晚</Option>
                            </Select>
                        </div>
                        <div class="total-money flex-item">
                            <Input
                                prefix="logo-yen"
                                type="text"
                                placeholder="金额"
                                style="width: 104px;"
                                @on-keyup="validateSuborderAmount(item)"
                                @on-blur="moneyToDecimal2(item, 'suborderAmountView', onBlurSuborderAmount)"
                                :disabled="
                                    (!item.checked && orderOprType === 'check-in') ||
                                    !!data.otaOrderNo
                                "
                                v-model="item.suborderAmountView"
                                class="total-money-input" />
                            <span class="wraning" style="left: 0;" v-if="item.suborderAmountViewErrMsg">
                                <span style="font-size: 14px;">
                                    <Icon type="md-alert" />
                                    {{ item.suborderAmountViewErrMsg }}
                                </span>
                            </span>
                            <template v-if="orderOprType !== 'check-in' && !data.otaOrderNo">
                                <Icon
                                    type="md-remove-circle"
                                    style="cursor: pointer; margin-right: 5px;"
                                    size="25"
                                    color="#D67777"
                                    v-if="
                                        data.suborders.length >= 2 && 
                                        (
                                            !data.otaOrderNo ||
                                            (
                                                data.otaOrderNo &&
                                                item.status === 0
                                            )
                                        )
                                    "
                                    @click="removeRoom(index, item)"/>
                                <Icon
                                    type="md-add-circle"
                                    style="cursor: pointer;"
                                    size="25"
                                    color="#286094"
                                    v-if="index === 0"
                                    @click="addRoom"/>
                            </template>
                        </div>
                    </div>
                    <div
                        class="suborder-client-wrapper"
                        v-for="(subItem, subIndex) in item.clients" :key="subIndex">
                        <div class="suborder-client flex">
                            <div class="user-name flex-item">
                                <i class="iconfont user-name-icon">&#xe720;</i>
                                <Input
                                    :maxlength="inputMaxLen"
                                    :disabled="!item.checked && orderOprType === 'check-in'"
                                    v-model="subItem.name"
                                    style="width: 145px; margin-left: 33px;"
                                    placeholder="入住人姓名"></Input>
                            </div>
                            <div class="id-card flex-item">
                                <Select
                                    :disabled="!item.checked && orderOprType === 'check-in'"
                                    placeholder="证件"
                                    v-model="subItem.identityType"
                                    style="width: 77px;">
                                    <Option
                                        v-for="sunItem in certificatesType" :key="sunItem.value"
                                        :label="sunItem.name"
                                        :value="sunItem.value" />
                                </Select>
                                <Input
                                    style="width: 150px;"
                                    :maxlength="inputMaxLen"
                                    :disabled="!item.checked && orderOprType === 'check-in'"
                                    placeholder="证件号码"
                                    v-model="subItem.identityNo"></Input>
                            </div>
                            <div class="user-phone flex-item">
                                <Input
                                    style="width: 104px;"
                                    :disabled="!item.checked && orderOprType === 'check-in'"
                                    @on-keyup="requiredNumber(subItem, 'phone')"
                                    placeholder="电话号码"
                                    v-model="subItem.phone"
                                    :maxlength="11"></Input>
                            </div>
                            <div
                                class="client-more"
                                v-if="(orderOprType === 'check-in' && item.checked)
                                    || orderOprType !== 'check-in'"
                            >
                                <span
                                    class="opr-client remove-client"
                                    v-if="item.clients.length >= 2"
                                    @click="removeClient(item, subIndex)"></span>
                                <span
                                    class="opr-client add-client"
                                    v-if=" subIndex === 0"
                                    @click="addClient(item)"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 查看 -->
        <div class="look" key="200" v-else>
            <div style="margin-bottom: 10px;"
                v-for="(item, index) in data.suborders" :key="index">
                <div class="look-container" :style="editContainerStyle">
                    <div class="checkbox" @click="switchChecked(item)" v-if="!hideCheckbox && !item.fixedNotCheck">
                        <Icon type="md-checkmark-circle" size="18" color="#286094" v-if="item.checked"/>
                        <Icon type="md-radio-button-off" size="18" color="#286094" v-else/>
                    </div>
                    <div class="suborder-info flex">
                        <div class="room-type flex-item">
                            <span
                                :class="{
                                    'order-status': true,
                                    'predetermine': item.status === 0,
                                    'check-in': item.status === 1,
                                    'unsubscribe': item.status === 2
                                }"
                                style="margin-left: 3px;"
                            >
                                {{ item.status === 0?'预':item.status === 1? '住':'退' }}
                            </span>
                            <span class="room-name">
                                <span class="room-type-name text-break-1" :title="roomFindById(item.roomId)[0].roomTypeName">
                                    {{ roomFindById(item.roomId)[0].roomTypeName }}
                                </span>
                                &nbsp;
                                <span class="room-no-name text-break-1" :title="roomFindById(item.roomId)[0].roomNo">
                                    {{ roomFindById(item.roomId)[0].roomNo }}
                                </span>
                            </span>
                        </div>
                        <div class="check-in flex-item">
                            {{formatDate(item.checkInDateView)}} — {{formatDate(item.checkOutDateView)}}
                            （{{ item.nights }}晚）
                        </div>
                        <div class="total-money flex-item">
                            ¥ {{toDecimal2(item.suborderAmountView)}}
                        </div>
                    </div>
                        <div
                            class="suborder-client-wrapper"
                            :ref="'suborderClientWrapper'+index"
                            style="height: 43px;"
                            v-if="item.clients.length"
                        >
                            <div class="suborder-client flex"
                                v-for="(subItem, subIndex) in item.clients"
                                :key="subIndex">
                                <div class="user-name flex-item">
                                    <i class="iconfont user-name-icon">&#xe720;</i>
                                    <span style="padding-left: 60px;">{{subItem.name}}</span>
                                </div>
                                <div class="id-card flex-item">
                                    <!-- <i class="iconfont id-card-icon">&#xe654;</i> -->
                                    <span :class="['id-card-icon', 'id-card-icon-'+subItem.identityType]"></span>
                                    <span style="padding-left: 15px;">{{subItem.identityNo}}</span>
                                </div>
                                <div class="user-phone flex-item">
                                    <Icon type="ios-call-outline" size="22" color="#9AA7C1" />
                                    {{subItem.phone}}
                                </div>
                                <div class="client-more" v-if="subIndex === 0 && item.clients.length >= 2">
                                    <span class="client-mun">{{item.clients.length}}</span>
                                    <Icon
                                        type="ios-arrow-down"
                                        class="client-mun-icon"
                                        size="25"
                                        color="#1F5A8E"
                                        @click="showMore(item.clients.length, index)"/>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        computedNights,
        formatDate,
        deepCopy,
        TODAY,
        toDecimal2,
        validateRoomRepeat
    } from 'common_libs/util'
    import Base from '../Mixins/base'
    import {
        hotelStatusApiSercers
    } from '../../../../entries/hotelStatus/api/API.js'

    export default {
        name: 'SuborderItem',
        mixins: [Base],
        props: {
            edit: {
                type: Boolean,
                default: true
            },
            data: {
                type: Object,
                default () {
                    return {}
                }
            },
            hideCheckbox: {
                type: Boolean,
                default: true
            },
            orderOprType: { // 订单操作类型（入住办理、编辑订单）
                type: String,
                default: ''
            }
        },
        data () {
            const _this = this
            return {
                computedNights,
                formatDate,
                newSubordersItem: {
                    id: null,
                    checkInDateView: new Date(),
                    checkOutDateView: +new Date() + 24 * 3600000,
                    nights: 1,
                    roomId: null,
                    roomIdErrMsg: '',
                    suborderAmountViewErrMsg: '',
                    suborderAmountView: '',
                    status: 0,
                    details: [],
                    clients: []
                },
                newClientItem: {
                    id: null,
                    name: null,
                    phone: '',
                    identityType: 0,
                    identityNo: ''
                },
                certificatesType: [ // 证件类型
                    {
                        value: 0,
                        name: '身份证'
                    }, {
                        value: 1,
                        name: '护照'
                    }, {
                        value: 2,
                        name: '军官证'
                    }, {
                        value: 3,
                        name: '其他'
                    }
                ],
                checkInDateOptions: {
                    disabledDate (date) {
                        let startDate = new Date(deepCopy(_this.dateList[0]).strDate)
                        let endDate = new Date(deepCopy(_this.dateList[_this.dateList.length - 1]).strDate)
                        startDate.setMonth(startDate.getMonth() - 1)
                        endDate.setMonth(endDate.getMonth() + 2)
                        return date.valueOf() <= startDate.valueOf() - 24 * 3600000 || date.valueOf() >= endDate.valueOf()
                    }
                },
                changedRoomIds: [], // 房间id已经改变的订单集合
                changedCheckInDateIds: []  // 入住时间id已经改变的订单集合
            }
        },
        computed: {
            dateList () {
                return this.$store.getters.dateList
            },
            roomList () {
                return this.$store.getters.roomList
            },
            realpriceList () {
                return this.$store.getters.realpriceList
            },
            editContainerStyle () {
                let paddingLeft = this.hideCheckbox ? 0 : 25
                return {
                    paddingLeft: paddingLeft + 'px'
                }
            }
        },
        created() {
            this.$root.Bus.$on('on-order-form-validate', (errObj) => {
                let subordersErrMsg = errObj.suborders
                if (subordersErrMsg) {
                    this.data.suborders.map((item, index) => {
                        for (let i = 0, len = subordersErrMsg.length; i < len; i++) {
                            let subItem = subordersErrMsg[i]
                            if (subItem.index === index) {
                                for (let key in subItem) {
                                    subItem[key] && 
                                        (item[key+'ErrMsg'] = subItem[key].errMsg)
                                }
                            }
                        }
                    })
                }
            })
            this.data.suborders.map(item => {
                let checkInDate = +new Date(formatDate(item.checkInDateView))
                if (this.orderOprType === 'check-in') {
                    let checkOutDate = +new Date(item.checkOutDateView)
                    let today = +new Date(formatDate(TODAY))
                    if (
                        checkInDate <= today &&
                        item.status === 0
                    ) {
                        item.checked = true // 是否选中该房间
                    }
                    if (
                        today < checkInDate ||
                        item.status === 1 ||
                        item.status === 2
                    ) {
                        item.fixedNotCheck = true  // 固定不能选择
                    }
                } else if (this.orderOprType === 'check-out') {
                    item.checked = item.status === 1 // 是否选中该房间
                    item.fixedNotCheck = item.status !== 1 // 固定不能选择
                } else if (this.orderOprType === 'update') {
                    if (item.status === 1 && !item.clients.length)
                        item.clients.push(Object.assign({}, this.newClientItem))
                }
            })
        },
        methods: {
            roomFindById (roomId) {
                return this.roomList.filter(item => item.roomId === roomId)
            },
            showMore (clientsLen, index) {
                const ref = 'suborderClientWrapper' + index
                const suborderClientWrapperEl = this.$refs[ref][0]
                let height = suborderClientWrapperEl.style.height.slice(0, -2)
                if (height == 43) {
                    this.$refs[ref][0].style.height = clientsLen * 43 + 'px'
                    suborderClientWrapperEl.className = 'suborder-client-wrapper open'
                } else {
                    this.$refs[ref][0].style.height = '43px'
                    suborderClientWrapperEl.className = 'suborder-client-wrapper'
                }
            },
            onBlurSuborderAmount (item) {
                let detailsLen = item.details.length
                let suborderAmountView = 0
                item.details.map(item => {
                    suborderAmountView += item.roomPrice
                })
                let Dvalue = item.suborderAmountView * 100 - suborderAmountView
                let remainder = toDecimal2(Dvalue % detailsLen) - 0 // 余数保留两个小数
                let integer = parseInt(Dvalue / detailsLen)
                item.details.map((item, index) => {
                    item.roomPrice = detailsLen - 1 === index ?
                    item.roomPrice - 0 + remainder + integer
                    : item.roomPrice + integer
                })
                this.reComputedFinance()
            },
            addRoom () {
                /* 添加房间 */
                let newSubordersItem = Object.assign({}, this.newSubordersItem)
                this.data.suborders.unshift(newSubordersItem)
            },
            removeRoom (index, item) {
                /* 删除房间 */
                this.data.suborders.splice(index, 1)
                this.reComputedSuborderAmount(item)
                this.clearAllRoomIdErrMsg()
            },
            addClient (item) {
                /* 添加客户 */
                item.clients.unshift(Object.assign({}, this.newClientItem))
            },
            removeClient (item, index) {
                /* 删除客户 */
                item.clients.splice(index, 1)
            },
            handlerNights (item) {
                item.checkOutDateView = +new Date(item.checkInDateView) + item.nights * 24 * 3600000
                this.checkRoomIsDisAble(item)
                this.changedCheckInDateIds.indexOf(item.id) < 0 &&
                    this.changedCheckInDateIds.push(item.id);

                this.changedRoomIds.indexOf(item.id) < 0 || !item.id ?
                    this.reComputedSuborderAmount(item, false)
                    : this.reComputedSuborderAmount(item)
            },
            switchChecked (item) {
                let allChecked = this.data.suborders.filter(item => item.checked)
                if (allChecked.length === 1 && item.checked)
                    return false
                item.checked = !item.checked
            },
            onChangeRoom (itemData) {
                /* 更改房型 */
                let {roomId, checkInDateView, checkOutDateView, nights, id} = itemData
                this.checkRoomIsDisAble(itemData)
                if (this.changedRoomIds.indexOf(id) < 0)
                    this.changedRoomIds.push(id)
                if (this.changedCheckInDateIds.indexOf(id) < 0 && itemData.id) {
                    itemData.details.map(item => {
                        item.roomId = itemData.roomId
                    })
                } else 
                    this.reComputedSuborderAmount(itemData)
            },
            checkRoomIsDisAble (itemData) {
                let {roomId, checkInDateView, checkOutDateView, id} = itemData
                let params = {
                    id,
                    checkInDate: +new Date(checkInDateView),
                    checkOutDate: +new Date(checkOutDateView),
                    roomId
                }
                hotelStatusApiSercers.checkRoomIsDisAble(params).then(res => {
                    if (res.code === '600001')
                        itemData.roomIdErrMsg = res.message
                    else {
                        itemData.roomIdErrMsg = ''
                        itemData.suborderAmountViewErrMsg = ''
                        this.clearAllRoomIdErrMsg()
                    }
                })
            },
            clearAllRoomIdErrMsg () {
                this.data.suborders.map(item => {
                    if (escape(item.roomIdErrMsg) !== escape('无可用房源'))
                        item.roomIdErrMsg = ''
                })
                validateRoomRepeat(this.data.suborders)
            },
            reComputedSuborderAmount (itemData, changedRoom = true) {
                let {roomId, checkInDateView, nights, id} = itemData
                if (roomId) {
                    let detailsBackups = deepCopy(itemData.details)
                    itemData.details = []
                    let suborderAmountView = 0
                    let roomTypeId = this.roomList.filter(item => item.roomId === roomId)[0].roomTypeId
                    let realPriceList = this.realpriceList.filter(item => item.roomTypeId === roomTypeId)[0].realPriceList
                    for (let i = 0, len = realPriceList.length; i < len; i++) {
                        let item = realPriceList[i]
                        let dateView = formatDate(item.currDate)
                        if (formatDate(checkInDateView) === dateView) {
                            for (let j = 0; j < nights; j++) {
                                item = realPriceList[i + j]
                                dateView = formatDate(item.currDate)
                                let subItem = detailsBackups.filter(sunItem => formatDate(sunItem.checkInDate) === dateView)
                                /* 生成details */
                                let newItem = subItem.length ?
                                    changedRoom ? {
                                        ...subItem[0],
                                        roomPrice: item.realPrice,
                                        checkInDate: item.currDate,
                                    }:
                                    subItem[0]
                                : {
                                    id: null,
                                    roomPrice: item.realPrice,
                                    checkInDate: item.currDate,
                                    roomId: roomId
                                }
                                itemData.details.push(newItem)
                                suborderAmountView += newItem.roomPrice / 100
                            }
                            break;
                        }
                    }
                    itemData.suborderAmountView = suborderAmountView
                    this.reComputedFinance()
                }
            },
            validateSuborderAmount (item) {
                item.suborderAmountViewErrMsg = !item.suborderAmountView ? '订单金额不能为空': ''
            }
        }
    }
</script>

<style lang="scss">
    @import './suborderItem';
</style>
