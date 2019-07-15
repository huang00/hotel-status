/*
 * @Author: huangchao 
 * @Date: 2018-12-11 13:53:05 
 * @Last Modified by: huangchao
 * @Last Modified time: 2019-01-07 14:41:25
 * @describe  样式设置
 */
import {
    computedToolTipStyle
} from '../dragAndDrop'

export default {
    data () {
        return {
            toolTipStyle: { // 提示工具样式
                top: 0,
                left: 0,
                display: 'none'
            },
            shadowBoxStyle: { // 阴影元素样式
                top: 0,
                left: 0,
                width: 0,
                display: 'none'
            },
            dashedBoxStyle: {   // 标记原始位置元素样式
                top: 0,
                left: 0,
                width: 0,
                display: 'none'
            },
            orderDetailsStyle: { // 显示详情元素
                top: 0,
                left: 0,
                width: 0,
                display: 'none'
            }
        }
    },
    methods: {
        setToolTipStyle () {
            let nowSelectedItems = this.nowSelectItems.filter(item => item.checked)
            let maxTop = this.$parent.$refs.hotelStatusMain.getElementsByClassName('hotel-orders')[0].offsetHeight
            this.toolTipStyle = computedToolTipStyle(
                nowSelectedItems.length ?
                    nowSelectedItems: this.realSelectItems,
                    maxTop,
                3000
            )
        },
        setDragTargetElStyle (oprType) {
            let orderInfo = this.dragTargetEl.getElementsByClassName('order-info')[0]
            let orderInfoBack = this.thisItem.status === 1 ?
                'linear-gradient(240deg,rgba(82,173,245,1) 0%,rgba(88,154,238,1) 100%)'
                : 'linear-gradient(240deg,rgba(246,199,155,1) 0%,rgba(234,154,112,1) 100%)'
            let orderInfoShadow = this.thisItem.status === 1 ?
                '0px 0px 6px 0px rgba(82,189,245,0.69)'
                : '0px 0px 6px 0px rgba(172,99,60,0.69)'
            let orderInfoOriginBack = this.thisItem.status === 1 ?
                '#52ADF5'
                : '#EA9A70'
            let orderInfoOriginShadow = 'none'

            if (oprType === 'move') {
                this.dragTargetEl.style.transition = 'initial'
                this.dragTargetEl.style.cursor = 'move'
                this.dragTargetEl.style['z-index'] = '10'
                orderInfo.style['background'] = orderInfoBack
                orderInfo.style['box-shadow'] = orderInfoShadow
            } else {
                this.thisItem.top = oprType === 'origin' ?
                    this.dashedBoxStyle.top.slice(0, -2) - 0
                    : this.shadowBoxStyle.top.slice(0, -2) - 0
                this.thisItem.left = oprType === 'origin' ?
                    this.dashedBoxStyle.left.slice(0, -2) - 0
                    : this.shadowBoxStyle.left.slice(0, -2) - 0
                
                this.dragTargetEl.style.transition = 'all .3s'
                this.dragTargetEl.style.cursor = 'pointer'
                this.dragTargetEl.style['z-index'] = '0'
                orderInfo.style['background'] = orderInfoOriginBack
                orderInfo.style['box-shadow'] = orderInfoOriginShadow
            }
            if (oprType === 'origin') {
                this.$parent.$refs.hotelStatusMain.scrollLeft = this.downScrollLeft
                this.$parent.$refs.hotelStatusMain.scrollTop = this.downScrollTop
            }
        },
        setShadowBoxStyle (initial, initStyle) {
            if (initial === 'initial')
                this.shadowBoxStyle.display = 'none'
            else {
                this.shadowBoxStyle = {
                    display: 'block',
                    width: initStyle.width + 'px',
                    top: initStyle.top + 'px',
                    left: initStyle.left + 'px',
                    background: this.orderDetailsData
                }
            }
        },
        setDashedBoxStyle (initial, initStyle) {
            if (initial === 'initial')
                this.dashedBoxStyle.display = 'none'
            else {
                this.dashedBoxStyle = {
                    display: 'block',
                    width: initStyle.width + 'px',
                    top: initStyle.top + 'px',
                    left: initStyle.left + 'px',
                }
            }
        },
        setOrderDetailsStyle (top, left, width, initial) {
            if (arguments[0] === 'initial')
                this.orderDetailsStyle.display = 'none'
            else {
                this.orderDetailsStyle = {
                    display: 'block',
                    top: top + 55 + 'px',
                    left: left + width - 45 + 'px'
                }
            }
        }
    }
}
