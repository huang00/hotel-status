<template>
    <div
        ref="hotelOrders"
        class="hotel-orders"
        @mouseout="activeColumn = null"
    >
        <!-- 构建最底层的格式 -->
        <ul class="room-type-grid clearfix"
            v-for="(item, index) in hotelRoomList"
            :key="index">
            <li
                :class="['room-item-grid grid', 'row'+index, 'column'+subIndex, subItem.weekEn === 0?'Mon':'']"
                v-for="(subItem, subIndex) in item.realPriceList"
                :key="subIndex"
                :clinteY='index'
                :clinteX='subIndex'
                @mousedown.stop="liMouseDownIsTure(index, subIndex, $event)"
                :style="{backgroundColor: activeColumn === subIndex?'#F7FCFF':''}"
                @mouseover.stop="liMouseoverIsTure(index, subIndex)">
                <div
                    class="checked grid-inner-box"
                    v-if="subItem.checked">
                    <span class="mark">
                        <Icon type="md-checkmark" size="22"/>
                    </span>
                </div>
                <div class="room-info grid-inner-box">
                    <p class="text-break-1">{{ item.roomTypeName }}</p>
                    <p class="text-break-1">{{item.roomNo}}</p>
                    <p>¥ {{ subItem.priceView }}</p>
                </div>
            </li>
        </ul>

        <!-- 阴影元素 -->
        <div
            :style="shadowBoxStyle"
            class="shadow-box-wrapper">
            <div :class="{
                'order-base': true,
                'predetermine': orderDetailsData.status === 0,
                'check-in': this.orderDetailsData.status === 1
            }"></div>
        </div>

        <!-- 拖起时标记原始位置的元素 -->
        <div
            :style="dashedBoxStyle"
            class="dashed-box-wrapper">
            <div :class="{
                'order-base': true,
                'predetermine': orderDetailsData.status === 0,
                'check-in': this.orderDetailsData.status === 1
            }">
            </div>
        </div>

        <!-- 订单 -->
        <div
            v-for="item in suborderList"
            :key="item.id"
            class="order-info-wrapper"
            :style="{
                top: item.top + 'px',
                left: item.left + 'px',
                width: item.width + 'px'
            }"
            @click.stop="openOrderDetail(item)"
            @mousedown.stop="dragOrderInfo($event, item)"
            @mouseover.stop="showOrderDetails($event, item)"
            @mouseout.stop="item.showDetails = false">
            <order-info
                :data="item"
            ></order-info>
            <div
                :class="{
                    'impact-remind': true,
                    'arrow-down': true,
                    'show-down': item.top < 75
                }"
                v-if="item.impactRemind"
            >房间已被占用！
            </div>
        </div>

        <!-- 钟点房 -->
        <div
            :class="{
                'hour-room-wrapper': true,
                impact: item.isImpact,
                'special-top': item.top === 0
            }"
            v-for="(item, index) in hourRoomList"
            :key="index + 10000"
            :style="{
                top: item.isImpact ?
                    item.top - 15 + 'px'
                    : item.top + 5 + 'px',
                left: item.hourRoomStyleLeft + 'px'
            }"
            @mouseover.stop="item.hourRoomStyleLeft = item.left + 10"
            @mouseout.stop="item.hourRoomStyleLeft = item.left + 60"
            @click="openHourRoomDetail(item)"
        >
            <span class="icon"></span>
            钟点房
            <Icon type="ios-arrow-forward" />
        </div>

        <div
            class="order-info-wrapper forgery"
            v-if="split"
            :style="{
                top: forgeryOrderData.top + 'px',
                left: forgeryOrderData.left + 'px',
                width: forgeryOrderData.width + 'px'
            }"
        >
            <order-info
                :data="forgeryOrderData"
            ></order-info>
        </div>

        <!-- 详情模态框 -->
        <app-modal
            v-model="orderDetailsModal"
            :footer-hide="true"
            :header-hide="true"
            @on-cancle="closeOrderDetailsModal"
        >
            <!-- 钟点房导航 -->
            <div
                class="hour-room-nav position_x_c"
                v-if="modalType === 'look'"
            >
                <tabs-nav
                    :list="hourRoomOrderIds"
                    @on-change="switchHourRoom"
                ></tabs-nav>
            </div>

            <template v-if="modalType === 'look'">
                <look-order-detail
                    :data="mainOrderData"
                    @on-switch="handlerSwitch">
                </look-order-detail>
            </template>
            <template v-else-if="modalType === 'update'">
                <update-order-detail
                    :data="mainOrderData"
                    @on-update="handlerUpdate">
                </update-order-detail>
            </template>
            <template v-else-if="modalType === 'check-in'">
                <check-in-order-detail
                    :data="mainOrderData"
                    @on-check-in="handlerCheckIn"></check-in-order-detail>
            </template>
            <template v-else-if="modalType === 'check-out'">
                <check-out-order-detail
                    :data="mainOrderData"
                    @on-check-out="handlerCheckOut"></check-out-order-detail>
            </template>
        </app-modal>

        <!-- 取消订单 -->
        <app-modal
            v-model="cancleOrderModal"
            :width="526"
            :height="400"
            @on-cancle="onCancleOrder"
            @on-ok="onConfirmCancleOrder"
            :title="
                !!mainOrderData.otaOrderNo ? '未到 NO SHOW': '取消订单'
            "
        >
            <cancle-order-detail
                :data="mainOrderData"></cancle-order-detail>
        </app-modal>

        <!-- 确认换房 -->
        <app-modal
            v-model="confirmSwitchRoomModal"
            :header-hide="true"
            :width="310"
            :height="150"
            :showCancel="true"
            @on-cancle="onCancleSwitchRoom"
            @on-ok="onConfirmSwitchRoom"
            >
            <div style="
                font-size: 16px;
                color: '#666666';
                font-family:MicrosoftYaHei;
                line-height: 65px;
                text-align: center;"
            >
                确认换房？
            </div>
        </app-modal>
    </div>
</template>

<script>
    import AppModal from 'common_components/AppModal/'
    import TabsNav from 'common_components/TabsNav/'
    import LookOrderDetail from 'common_components/OrderDetails/Look/'
    import UpdateOrderDetail from 'common_components/OrderDetails/Update/'
    import CheckInOrderDetail from 'common_components/OrderDetails/CheckIn/'
    import CheckOutOrderDetail from 'common_components/OrderDetails/CheckOut/'
    import CancleOrderDetail from 'common_components/OrderDetails/Cancle/'

    import OrderInfo from './components/OrderInfo/'
    import style from './Mixins/style'
    import dragSelect from './Mixins/dragSelect'
    import dragMove from './Mixins/dragMove'
    import orderDetailsModal from './Mixins/orderDetailsModal'

    import {
        deepCopy,
        newOrderData,
        toDecimal2,
        formatDate,
        TODAY,
        GRIDEHEIGHT,
        GRIDEWIDTH,
        submitOrderDataFilter,
        mainOrderDataProcess
    } from 'common_libs/util'
    import {
        checkIsPredetermine
    } from 'hotelStatus/libs/util'
    import {
        computedRealSelectItems,
        createdOrderData,
        createdSplitData
    } from './dragAndDrop'

    export default {
        name: 'HotelOrders',
        mixins: [style, dragSelect, dragMove, orderDetailsModal],
        props: {
            scrollLeft: {
                type: Number,
                default: 0
            },
            scrollTop: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {
                toDecimal2,
                formatDate,
                activeColumn: null,
                selectMouseDownTrue: false, // 选择时鼠標按下時的狀態
                dragMouseDownTrue: false, // 拖拽时鼠标按下
                selectStartCoorX: 0, // 鼠標開始按下時的X坐標
                selectStartCoorY: 0,
                nowSelectItems: [], // 鼠標托選時所有被選中的元素集合
                realSelectItems: [], // 实际被选中的元素结合
                mainOrderData: {},
                dragTargetEl: null, // 拖拽目标元素
                dragTargetWidth: 0,
                orderDetailsData: {},
                isMove: false,   //是否进行了移动
                confirmSwitchRoomModal: false,
                showCheckInButton: false,
                forgeryOrderData: {},    // 拆分时生成退订的数据
                split: false,
                splitOrderOriginWidth: 0, // 拆分订单原始的宽度
                splitOrderOriginLeft: 0, // 拆分订单原始的left
                hourRoomOrderIds: [],
                downScrollLeft: 0, // 当鼠标按下时的left值
                downScrollTop: 0 // 当鼠标按下时的top值
            }
        },
        components: {
            AppModal,
            TabsNav,
            LookOrderDetail,
            UpdateOrderDetail,
            OrderInfo,
            CheckInOrderDetail,
            CheckOutOrderDetail,
            CancleOrderDetail
        },
        computed: {
            hotelRoomList() {
                return this.$store.getters.roomAndPriceList
            },
            theCurrentNeedToQueryTheStartTime () {
                return this.$store.getters.theCurrentNeedToQueryTheStartTime
            },
            suborderList () {
                return this.$store.getters.suborderList.filter(item => item.isHourRoom !== 1)
            },
            hourRoomList () {
                let suborderList = this.$store.getters.suborderList
                let hourRoomList = []
                /* 筛选钟点房 */
                for (let i = suborderList.length; i--;) {
                    let item = suborderList[i]
                    item.isHourRoom === 1 &&
                        hourRoomList.push({
                            ...item,
                            hourRoomStyleLeft: item.left + 60,
                            isImpact: false,
                            orderIds: [
                                {value: item.orderId, label: '钟点房1'}
                            ]
                        })
                }
                /* 把相同位置的钟点房 加到一个orderIds里面 */
                for (let i = hourRoomList.length; i--;) {
                    let item = hourRoomList[i]
                    for (let k = hourRoomList.length; k--;) {
                        let subItem = hourRoomList[k]
                        if (
                            item.top === subItem.top &&
                            item.left === subItem.left &&
                            item.id !== subItem.id
                        )   item.orderIds.push({
                                value: subItem.orderId,
                                label: `钟点房${item.orderIds.length + 1}`
                            })
                    }
                }
                /* 检测碰撞 */
                for (let k = hourRoomList.length; k--;) {
                    let item = hourRoomList[k]
                    loop:
                    for (let c = suborderList.length; c--;) {
                        let subItem = suborderList[c]
                        let minLeft = subItem.left
                        let maxLeft = subItem.left + subItem.width
                        if (
                            item.top === subItem.top &&
                            item.left >= minLeft &&
                            item.left < maxLeft &&
                            subItem.isHourRoom !== 1
                        ) {
                            item.isImpact = true
                            continue loop;
                        }
                    }
                }
                return hourRoomList
            }
        },
        created() {
            document.addEventListener('mouseup', this.logThisMouseUp)
            this.$root.Bus.$on('on-bus-look-order-detail', (mainOrderData, modalType, callback) => {
                this.mainOrderData = mainOrderDataProcess(mainOrderData, this.$store.getters.orderFromList)
                this.modalType = modalType
                this.orderDetailsModal = true
                callback && callback('success')
            })
        },
        methods: {
            switchHourRoom (item) {
                let orderId = item.value
                this.mainOrderData =
                    deepCopy(this.hotelOrderList.filter(item => item.id === orderId)[0])
            },
            openHourRoomDetail (item) {
                this.hourRoomOrderIds = item.orderIds
                this.openOrderDetail({
                    orderId: item.orderIds[0].value
                })
            },
            onConfirmSwitchRoom () {
                /* 确认换房 */
                let backupsItem = deepCopy(this.thisItem)
                let switchOrder =
                    deepCopy(this.hotelOrderList.filter(item => item.id === backupsItem.orderId)[0])
                let suborderList = switchOrder.suborders
                if (this.split)
                    suborderList.push(createdSplitData(backupsItem).forgery)
                
                for (let i = 0, len = suborderList.length; i < len; i++) {
                    let item = suborderList[i]
                    if (item.id === backupsItem.id) {
                        item.roomId = this.roomIds[item.top / GRIDEHEIGHT]
                        item.left = item.left < 0? 0 : item.left
                        item.checkInDateView = this.dateList[item.left / GRIDEWIDTH].strDate
                        item.checkOutDateView = item.status === 0 ?
                            item.checkInDateView + 24 * 3600000 * item.nights
                            : this.dateList[(item.left - 0 + item.width) / GRIDEWIDTH ].strDate
                        /* 换房 处理details */
                        if (this.split) {
                            item.details = createdSplitData(backupsItem).real.details
                            item.suborderAmountView = createdSplitData(backupsItem).real.suborderAmountView
                        } else {
                            item.details.map((subItem, index) => {
                                subItem.checkInDate = item.checkInDateView + (24 * 3600000 * index)
                            })
                        }
                    }
                }
                switchOrder.type = 5
                this.saveOrder(submitOrderDataFilter(switchOrder))
                this.confirmSwitchRoomModal = false
                this.split = false
            },
            onCancleSwitchRoom () {
                /* 取消换房 */
                if (this.thisItem.status === 1 && this.split) {
                    this.dashedBoxStyle.left = this.splitOrderOriginLeft+'px'
                    this.thisItem.width = this.splitOrderOriginWidth
                }
                this.setDragTargetElStyle('origin')
                this.split = false
                this.dragTargetEl = null
                this.thisItem = null
            },
            cancleAllChecked () {
                /* 取消所有被选中的节点 */
                this.realSelectItems.map(item => {
                    item.checked = false
                    this.toolTipStyle.display = 'none'
                    this.realSelectItems = []
                })
            },
            showOrderDetails (event, item) {
                /* hover显示订单详情 */
                event = event || window.event
                item.showDetails = true
                this.$parent.suborderDetails = item
                if (!this.dragMouseDownTrue && !this.selectMouseDownTrue) {
                    let target = event.target
                    this.setOrderDetailsStyle(target.offsetTop, target.offsetLeft, target.offsetWidth)
                    this.orderDetailsData = item
                }
            },
            hideOrderDetails () {
                this.setOrderDetailsStyle('initial')
            },
            logThisMouseUp () {
                /* 获取到最终选中的items */
                this.realSelectItems = computedRealSelectItems(this.hotelRoomList, this.suborderList)
                /* 创建订单的数据 */
                if (this.realSelectItems.length)
                    this.createdOrderData()
                this.realSelectItems.length ?
                    this.createdOrderData()
                    : this.toolTipStyle.display = 'none'
                this.setDashedBoxStyle('initial')
                this.setShadowBoxStyle('initial')
                if (this.dragTargetEl && this.isMove) {
                    if (
                        this.thisItem.impactRemind ||
                        (
                            this.shadowBoxStyle.top === this.dashedBoxStyle.top &&
                            this.shadowBoxStyle.left === this.dashedBoxStyle.left &&
                            !this.split
                        )
                    ) {
                        if (this.thisItem.status === 1 && this.split) {
                            this.dashedBoxStyle.left = this.splitOrderOriginLeft+'px'
                            this.thisItem.width = this.splitOrderOriginWidth
                        }
                        this.setDragTargetElStyle('origin')
                        this.thisItem.impactRemind = false
                        this.dragTargetEl = null
                        this.thisItem = null
                        this.split = false
                    }
                    else {
                        this.setDragTargetElStyle('change')
                        this.confirmSwitchRoomModal = true
                    }
                }
                this.resetData()
            },
            createdOrderData () {
                /* 计算出toolTip的位置 */
                this.setToolTipStyle()
                let orderData = createdOrderData(this.realSelectItems)
                this.mainOrderData = deepCopy(newOrderData)
                this.mainOrderData.suborders = orderData.suborders
                this.mainOrderData.totalAmountView = orderData.totalAmountView
                this.mainOrderData.subsidyView = orderData.totalAmountView
                this.showCheckInButton = orderData.suborders.every(item => {
                    let checkInDateView = formatDate(item.checkInDateView)
                    this.$parent.isPredetermine = checkIsPredetermine(+new Date(item.checkInDateView))
                    /* 
                        可直接办理入住
                        一、（1）入住时间等于当天时间
                        二、（1）是昨天的入住时间
                            （2）办理时，当前时间是12点之前
                     */
                    let today = +new Date(`${formatDate(TODAY)} 00:00:00`) // 今天零点
                    let yesterday = today - (24 * 3600000)   // 昨天零点
                    let currentTime = +new Date()
                    let todayTwelve = today + (12 * 3600000)    // 今天十二点
                    return checkInDateView === formatDate(TODAY) ||
                        (checkInDateView === formatDate(yesterday) && currentTime < todayTwelve)
                })
            },
            resetData () {
                this.selectMouseDownTrue = false
                this.dragMouseDownTrue = false
                this.isMove = false
                this.tempScrollLeft = 0
                this.tempScrollTop = 0
                this.nowSelectItems = []
                this.$refs.hotelOrders &&
                    this.$refs.hotelOrders.removeEventListener('mousemove', this.handlerMouseMove)
            },
            liMouseoverIsTure (clientY, clientX) {
                this.activeColumn = clientX
                this.selectMouseDownTrue && this.selectNodes(clientY, clientX)
            },
            liMouseDownIsTure (clientY, clientX, event) {
                event = event || window.event
                if (event.button === 0) {
                    this.selectMouseDownTrue = true
                    this.selectStartCoorX = clientX
                    this.selectStartCoorY = clientY
                    this.selectNodes(clientY, clientX)
                }
            },
            dragOrderInfo (event, item) {
                /* moseupdown */
                if (event.button === 0) {
                    item.showDetails = false
                    /* 
                        禁止拖动
                        1、退房订单
                        2、入住订单，并且退房日期小于等于今天
                    */
                    if (
                        item.status === 2 ||
                        (+new Date(formatDate(item.checkOutDateView)) <= +new Date(formatDate(TODAY)) && item.status === 1)
                    ) return false
                    event = event || window.event
                    this.dragMouseDownTrue = true
                    this.dragTargetEl = event.target
                    this.thisItem = item
                    this.dragStartPageX = event.pageX
                    this.dragStartPageY = event.pageY
                    this.dragTargetOffsetLeft = this.dragTargetEl.offsetLeft
                    this.dragTargetOffsetTop = this.dragTargetEl.offsetTop
                    this.forgeryOrderData = createdSplitData(item).forgery
                    /* 拖拽目标元素的宽高及位置 */
                    this.dragTargetWidth = this.dragTargetEl.offsetWidth
                    this.downEventOffsetX = event.offsetX
                    this.downScrollLeft = this.scrollLeft
                    this.downScrollTop = this.scrollTop
                    this.$refs.hotelOrders.addEventListener('mousemove', this.handlerMouseMove)
                }
                event.stopPropagation()
                return false
            }
        },
        watch: {
            theCurrentNeedToQueryTheStartTime (val) {
                this.cancleAllChecked()
                this.$parent.$refs.hotelStatusMain.scrollLeft = 0
            },
            toolTipStyle: {
                handler (val) {
                    this.$parent.toolTipStyle = val
                    this.$parent.showCheckInButton = this.showCheckInButton
                },
                deep: true
            }
        }
    }
</script>

<style lang="scss">
    @import './hotelOrder'
</style>
