<template>
    <div
        v-if="data.showDetails"
        :style="hoverShowDetailsStyle"
        @mouseover.stop="data.showDetails = true"
        @mouseout.stop="data.showDetails = false"
        :class="{
            'order-details-box': true,
            overflow: data.left + data.width + 300 >= 3000
        }">
        <div class="check-in-info">
            <span class="font-weight">{{formatDate(data.checkInDate)}}</span>
            入住 —
            <span class="font-weight">{{data.checkOutDateView}}</span>
            退房&nbsp;&nbsp;&nbsp;
            <span
                class="order-type"
                :style="{
                    'background-color': data.status === 0 ? '#EA9A70' : data.status === 1 ? '#52ADF5': '#C7C7C7'
                }"
            >
                {{
                    data.status === 0 ? 
                    '预'
                    : data.status === 1 ?
                    '住': '退'
                }}
            </span>
        </div>
        <div class="order-price">
            订单金额&nbsp;
            <span class="font-weight">¥ {{toDecimal2(data.totalAmountView)}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            需补房费&nbsp;
            <span class="font-weight">¥ {{
                toDecimal2(data.totalAmountView - data.depositView - data.paidAmountView)
            }}</span>
        </div>
    </div>
</template>

<script>
import {
    toDecimal2,
    formatDate
} from 'common_libs/util'

export default {
    name: 'HoverShowDetail',
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        },
        scrollLeft: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            toDecimal2,
            formatDate
        }
    },
    computed: {
        hoverShowDetailsStyle() {
            //1.鼠标所在位置的订单
            //2.滚动条所在位置最后一天
            //3.查看订单的开始日期跟结束日期
            //4.订单的最后一天 是否能在后侧显示
            //如果可以则显示 
            //如果不可以 判断订单开始日期是否能在滚动条所在位置的最开始日期显示
            //如果可以 则在前面显示如果不可以则在中间显示
            let minLeft = this.data.left
            let maxLeft = this.data.left + this.data.width
            let maxHeight = this.$parent.$refs.hotelStatusMain.getElementsByClassName('hotel-orders')[0].offsetHeight
            let orderViewWidth = this.$parent.$refs.hotelStatusMain.offsetWidth // 订单区域可视宽度
            let top = this.data.top + 60
            let left = this.data.left + this.data.width - 50
            let bodyHeight = document.body.offsetHeight - 110
            let orderDistanceSpaceLeft = minLeft - this.scrollLeft // 到左边的距离
            let orderDistanceSpaceRight = orderViewWidth - maxLeft + this.scrollLeft // 到右边的距离

            if (orderDistanceSpaceLeft < 280 && orderDistanceSpaceRight < 280)
                left = parseInt(orderViewWidth / 2) + this.scrollLeft
            else if (orderDistanceSpaceRight < 280)
                left =  this.data.left - 275
                
            top = top + 86 >= maxHeight && top + 86 >= bodyHeight ?
                this.data.top - 65 : top
            return {
                top: top + 'px',
                left: left + 'px'
            }
        }
    }
}
</script>

<style lang="scss">
    .order-details-box {
        position: absolute;
        min-width:335px;
        padding-right: 5px;
        height:86px;
        background:rgba(0,0,0,0.62);
        border-radius:4px;
        color: #DEDFDF;
        font-size: 14px;
        font-family:MicrosoftYaHei-Bold;
        padding-top: 15px;
        padding-left: 18px;
        z-index: 10;
        .font-weight {
            font-weight:bold;
            color: white;
        }
        .check-in-info {
            .order-type {
                width: 22px;
                height: 22px;
                border-radius: 6px;
                display: inline-block;
                line-height: 22px;
                text-align: center;
                color: white;
            }
        }
        .order-price {
            margin-top: 13px;
        }
    }
</style>

