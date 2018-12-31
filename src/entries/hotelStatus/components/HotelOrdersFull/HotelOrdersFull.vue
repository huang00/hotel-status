<template>
    <div
        class="hotel-orders-full"
        :style="{
            height: hotelOrdersFullHeight
        }"
    >
        <!-- 构建最底层的格式 -->
        <ul
            class="room-type-grid clearfix"
            v-for="(item, index) in 15"
            :key="index"
        >
            <li
                :class="{
                    'room-item-grid': true,
                    grid: true,
                    Mon: subItem.weekEn === 0
                }"
                v-for="(subItem, subIndex) in hotelRoomList[0].realPriceList"
                :key="subIndex"
            >
            </li>
        </ul>
    </div>
</template>

<script>
import { GRIDEHEIGHT } from 'common_libs/util'

export default {
    name: 'HotelOrdersFull',
    props: {
        roomTypeListLen: {
            type: Number,
            default: 0
        }
    },
    computed: {
        hotelOrdersFullHeight () {
            return `calc(100vh - ${this.roomTypeListLen * GRIDEHEIGHT + 190}px)`
        },
        hotelRoomList() {
            let roomAndPriceList = this.$store.getters.roomAndPriceList
            return roomAndPriceList.length ?
                roomAndPriceList 
                :[{realPriceList: []}]
        }
    }
}
</script>

<style lang="scss">
    .hotel-orders-full {
        min-width: 3000px;
        // min-height: 80px;
        overflow: hidden;
        .grid {
            height: 80px;
            width: 100px;
            border-right: 1px solid #F8F8F8;
            border-top: 1px solid #F8F8F8;
            padding: 5px;
            position: relative;
            z-index: -1;
            .grid-inner-box {
                height: 70px;
                width: 90px;
                position: absolute;
                top: 5px;
                left: 5px;
            }
        }
        .room-type-grid {
            .room-item-grid {
                float: left;
            }
        }
    }
</style>
