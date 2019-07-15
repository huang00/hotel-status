<template>
    <aside class="room-type room-type-full">
        <ul>
            <li class="room-type-item clearfix"
                style="background: #F7F7F7;"
                v-for="(item, index) in 1" :key="index"
            >
                <div class="room-type-name">
                    <div
                        :style="{
                            'margin-top': roomTypeFullHeight,
                            height: '100%'
                        }"
                    >
                        <div style="background: #eaeaea; height: 10px; width: 55px;"></div>
                        <div style="background: #eaeaea; height: 10px; width: 55px; margin-top: 10px;"></div>
                        <div style="background: #eaeaea; height: 10px; width: 40px; margin-top: 10px;"></div>
                    </div>
                </div>
                <div class="room-name">
                    <div
                        v-for="(subItem, subIndex) in 15"
                        :key="subIndex + 10"
                        :class="['room-name-item', subIndex === 0 ? 'first':'']"
                    >
                        <div>
                            <div style="background: #eaeaea; height: 10px; width: 55px;"></div>
                            <div style="background: #eaeaea; height: 10px; width: 40px; margin-top: 10px;"></div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </aside>
</template>

<script>
import { GRIDEHEIGHT } from 'common_libs/util'

export default {
    name: 'RoomTypeFull',
    props: {
        roomTypeListLen: {
            type: Number,
            default: 0
        }
    },
    computed: {
        roomTypeFullHeight () {
            return (document.body.offsetHeight - 190) - GRIDEHEIGHT * this.roomTypeListLen - 50 + 'px'
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '../RoomType/roomType';
    .room-type-full {
        .room-name-item:after {
            background: #F1F1F1 !important;
        }
    }
</style>
