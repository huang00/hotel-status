/*
 * @Author: huangchao 
 * @Date: 2018-12-12 15:31:16 
 * @Last Modified by: huangchao
 * @Last Modified time: 2018-12-28 11:00:43
 * @describe  订单模态框处理
 */
import { mapMutations, mapActions } from 'vuex'
import {
    deepCopy,
    mainOrderValidate,
    validateField,
    isEmptyObject,
    submitOrderDataFilter,
    mainOrderDataProcess
} from 'common_libs/util'
import {
    hotelStatusApiSercers
} from '../../../api/API'

export default {
    data () {
        return {
            orderDetailsModal: false, // 订单详情模态框
            cancleOrderModal: false,    // 取消订单模态框
            modalType: '',
            mainOrderData: {},
            showLook: true
        }
    },
    computed: {
        hotelOrderList () {
            return this.$store.getters.hotelOrderList
        },
        roomIds () {
            return this.$store.getters.roomList.map(item => item.roomId)
        },
        dateList () {
            return this.$store.getters.dateList
        }
    },
    methods: {
        ...mapMutations([
            'setHotelOrderList',
            'setSuborderList'
        ]),
        ...mapActions([
            'dispatchGetHotelTodayInOrder',
            'dispatchGetHotelTodayOutOrder'
        ]),
        closeOrderDetailsModal () {
            /* 详情模态框关闭 */
            this.hourRoomOrderIds = []
        },
        openPredetermine () {
            /* 预定 */
            this.modalType = 'update'
            this.orderDetailsModal = true
            this.cancleAllChecked()
        },
        openCheckIn () {
            /* 入住 */
            this.modalType = 'check-in'
            this.orderDetailsModal = true
            this.cancleAllChecked()
        },
        handlerUpdate () {
            /* 修改订单 */
            let errObj = mainOrderValidate(this.mainOrderData, validateField)
            console.log('errObj', errObj)
            if (isEmptyObject(errObj)) {
                this.mainOrderData.type = this.mainOrderData.id ? 4: 1
                console.log('验证成功')
                return false
                this.saveOrder(submitOrderDataFilter(this.mainOrderData))
            } else
                this.$root.Bus.$emit('on-order-form-validate', errObj)
        },
        openOrderDetail (data) {
            /* 查看订单 */
            this.cancleAllChecked()
            let { orderId } = data
            if (this.showLook) {
                this.modalType = 'look'
                this.orderDetailsModal = true
                this.mainOrderData =
                    deepCopy(this.hotelOrderList.filter(item => item.id === orderId)[0])
            }
            this.showLook = true
        },
        handlerSwitch (modalType) {
            if (modalType === 'cancle') {
                this.orderDetailsModal = false
                this.cancleOrderModal = true
            } else
                this.modalType = modalType
        },
        onCancleOrder () {
            /* 取消订单 */
            this.orderDetailsModal = true
            this.cancleOrderModal = false
        },
        onConfirmCancleOrder () {
            /* 确定取消订单 */
            let cancleOrder = deepCopy(this.mainOrderData)
            cancleOrder.orderStatus = 5
            cancleOrder.type = 3
            this.saveOrder(submitOrderDataFilter(cancleOrder))
        },
        handlerCheckIn () {
            /* 办理入住 */
            let errObj = mainOrderValidate(this.mainOrderData, validateField)
            if (isEmptyObject(errObj)) {
                let checkInOrder = deepCopy(this.mainOrderData)
                checkInOrder.suborders.map(item => {
                    item.checked && (item.status = 1)
                })
                checkInOrder.type = 2
                this.saveOrder(submitOrderDataFilter(checkInOrder))
            } else
                this.$root.Bus.$emit('on-order-form-validate', errObj)
        },
        handlerCheckOut () {
            /* 办理退房 */
            let checkOutOrder = deepCopy(this.mainOrderData)
            checkOutOrder.suborders.map(item => {
                item.checked && (item.status = 2)
            })
            checkOutOrder.type = 6
            this.saveOrder(submitOrderDataFilter(checkOutOrder))
        },
        saveOrder (mainOrder) {
            let backupsHotelOrderList = deepCopy(this.hotelOrderList)
            hotelStatusApiSercers.hotelOrderSave(mainOrder).then(res => {
                if (res.code === '000000' && res.content) {
                    let needOprMainOrder = mainOrderDataProcess(res.content, this.$store.getters.orderFromList, this.roomIds, this.dateList[0].date)
                    if (!mainOrder.id)
                        backupsHotelOrderList.push(needOprMainOrder)
                    else {
                        for (let i = backupsHotelOrderList.length ; i--;) {
                            if (backupsHotelOrderList[i].id === needOprMainOrder.id) {
                                if (needOprMainOrder.orderStatus === 5)
                                    backupsHotelOrderList.splice(i, 1)
                                else
                                    backupsHotelOrderList.splice(i, 1, needOprMainOrder)
                                break;
                            }
                        }
                    }
                    /* 更新视图 */
                    this.setSuborderList(backupsHotelOrderList)
                    this.setHotelOrderList(backupsHotelOrderList)
                    this.orderDetailsModal = false
                    this.cancleOrderModal = false
                    this.dispatchGetHotelTodayInOrder()
                    this.dispatchGetHotelTodayOutOrder()
                } else if (res.code === '600001') {
                    this.setDragTargetElStyle('origin')
                    alert(res.message)
                }
                this.dragTargetEl = null
                this.thisItem = null
            })
        }
    }
}
