/*
 * @Author: huangchao 
 * @Date: 2018-12-12 09:41:56 
 * @Last Modified by: huangchao
 * @Last Modified time: 2019-01-03 10:06:03
 * @describe  拖动移动
 */
import {
    computedShadowBoxNextCoor,
    computedImpact
} from '../dragAndDrop'
import {
    GRIDEWIDTH,
    GRIDEHEIGHT,
    formatDate,
    TODAY
} from 'common_libs/util'
 
 export default {
     data () {
         return {
            dragTargetOffsetTop: 0, // 拖拽目标元素offsetTop
            dragTargetOffsetLeft: 0, // 拖拽目标元素offsetLeft
            dragStartPageX: 0, // 开始拖拽时的pageX
            dragStartPageY: 0, // 开始拖拽时的pageY
            shadowBoxLeftCurLocation: 0, // 记录阴影元素上次左边的距离
            shadowBoxLeftPreLocation: 0,    // 记录阴影元素当前左边的距离
            shadowBoxTopCurLocation: 0, // 记录阴影元素上次上边的距离
            shadowBoxTopPreLocation: 0,    // 记录阴影元素当前上边的距离
            bodyOffsetWidth: document.body.offsetWidth,
            bodyOffsetHeight: document.body.offsetHeight,
            tempScrollLeft: 0, // 拖拽时滚动left的距离
            tempScrollTop: 0, // 拖拽时滚动top的距离
            thisItem: null,
            moveMinLeft: 0,
            moveMaxLeft: 0,
            downEventOffsetX: 0
         }
     },
     methods: {
        handlerMouseMove (event) {
            console.log('move')
            /* mousedown 事件 */
            event = event || window.event
            let pageX = event.pageX
            let pageY = event.pageY
            let moveX = pageX - this.dragStartPageX
            let moveY = pageY - this.dragStartPageY
            if (Math.abs(moveX) > 0 || Math.abs(moveY) > 0)  {
                !this.isMove && this.splitOrder()
                this.setDragTargetElStyle('move')
                this.showLook = false
                this.isMove = true
                this.thisItem.showDetails = false

                let top = this.dragTargetOffsetTop + this.tempScrollTop + moveY
                let left = this.dragTargetOffsetLeft + this.tempScrollLeft + moveX
                let maxLeft = 3000 - this.thisItem.width
                let maxTop = this.$refs.hotelOrders.offsetHeight - 80

                top = top <= 0
                    ? 0: top >= maxTop
                    ? maxTop: top
                left = left <= 0
                    ? 0: left >= maxLeft
                    ? maxLeft: left
                    
                this.thisItem.top = top
                this.thisItem.left = left
                
                this.setShadowBoxLocation(moveX, moveY, {
                    maxLeft, maxTop
                })
            }
            event.stopPropagation()
            return false
        },
        splitOrder () {
            let item = this.thisItem
            let initStype = {
                top: this.dragTargetOffsetTop,
                left: this.dragTargetOffsetLeft,
                width: this.thisItem.width
            }
            /* 订单拆分 */
            if (item.status === 1) {
                this.showLook = false
                if (+new Date(formatDate(item.checkInDateView)) < +new Date(formatDate(TODAY)) && 
                    +new Date(formatDate(item.checkOutDateView)) > +new Date(formatDate(TODAY))
                ) {
                    this.splitOrderOriginWidth = this.dragTargetWidth
                    this.splitOrderOriginLeft = this.dragTargetOffsetLeft
                    this.split = true
                    initStype.left = this.forgeryOrderData.left - 0 + this.forgeryOrderData.width
                    initStype.width = this.splitOrderOriginWidth - this.forgeryOrderData.width
                    this.moveMinLeft = this.moveMaxLeft = initStype.left - 0
                    this.thisItem.width = this.splitOrderOriginWidth - this.forgeryOrderData.width
                    this.dragTargetOffsetLeft = this.downEventOffsetX <= this.forgeryOrderData.width ?
                        this.dragTargetOffsetLeft + parseInt(this.downEventOffsetX / GRIDEWIDTH) * GRIDEWIDTH
                        : this.dragTargetOffsetLeft + this.forgeryOrderData.width
                } else
                    this.moveMinLeft = this.moveMaxLeft = this.dragTargetOffsetLeft
            }
            /* 设置相关元素的样式 */
            this.setShadowBoxStyle('active', initStype)
            this.setDashedBoxStyle('active', initStype)
            this.setOrderDetailsStyle('initial')
        },
        setShadowBoxLocation (moveX, moveY, {maxLeft, maxTop}) {
            let minLeft = 0
            /* 订单拆分 */
            if (this.thisItem.status === 1) {
                maxLeft = this.moveMaxLeft
                minLeft = this.moveMinLeft
            }
            /* ota 闪住订单 */
            if (this.thisItem.isOtaOrder) {
                minLeft = maxLeft = this.dragTargetOffsetLeft
            }
            /* 计算阴影的位置 */
            let shadowBoxTop = computedShadowBoxNextCoor(moveY + this.tempScrollTop, this.dragTargetOffsetTop, 'top', 0, maxTop)
            let shadowBoxLeft = computedShadowBoxNextCoor(moveX + this.tempScrollLeft, this.dragTargetOffsetLeft, 'left', minLeft, maxLeft)
            this.shadowBoxStyle.top = shadowBoxTop + 'px'
            this.shadowBoxStyle.left = shadowBoxLeft + 'px'
            
            /* 计算碰撞 */
            this.thisItem.impactRemind = computedImpact(this.thisItem.id, shadowBoxTop, shadowBoxLeft, this.thisItem.width, this.suborderList)
            
            /* 元素滚动 */
            this.shadowBoxLeftPreLocation = this.shadowBoxLeftCurLocation
            this.shadowBoxLeftCurLocation = shadowBoxLeft
            this.shadowBoxTopPreLocation = this.shadowBoxTopCurLocation
            this.shadowBoxTopCurLocation = shadowBoxTop

            let offsetLeftConst = GRIDEWIDTH / 2 // 每次左偏移量
            let offsetTopConst = GRIDEHEIGHT / 2 // 每次左偏移量
            // 375 是菜单 加上 房型列表的宽度 left
            if (this.shadowBoxLeftCurLocation >= this.shadowBoxLeftPreLocation && shadowBoxLeft + this.thisItem.width + 375 >= this.bodyOffsetWidth) {
                this.$parent.$refs.hotelStatusMain.scrollLeft += offsetLeftConst
                this.tempScrollLeft += offsetLeftConst
            }
            if (this.shadowBoxLeftCurLocation <= this.shadowBoxLeftPreLocation && this.shadowBoxLeftCurLocation <= this.scrollLeft && this.scrollLeft > 0) {
                this.$parent.$refs.hotelStatusMain.scrollLeft -= offsetLeftConst
                this.tempScrollLeft -= offsetLeftConst
            }
            
            // 130(页头 加上 时间轴的高度) + 80(的元素高度) + 40(可以增强灵敏度) top
            if (this.shadowBoxTopCurLocation >= this.shadowBoxTopPreLocation && shadowBoxTop + 250 >= this.bodyOffsetHeight) {
                this.$parent.$refs.hotelStatusMain.scrollTop += offsetTopConst
                this.tempScrollTop += offsetTopConst
            }
            if (this.shadowBoxTopCurLocation <= this.shadowBoxTopPreLocation && this.shadowBoxTopCurLocation - 20 <= this.scrollTop && this.scrollTop > 0) {
                this.$parent.$refs.hotelStatusMain.scrollTop -= offsetTopConst
                this.tempScrollTop -= offsetTopConst
            }
        }
     },
    watch: {
        scrollLeft (val) {
            this.bodyOffsetWidth = document.body.offsetWidth + val
        },
        scrollTop (val) {
            this.bodyOffsetHeight = document.body.offsetHeight + val
        }
    }
 }
