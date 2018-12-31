<template>
    <div
        v-if="orderIds.length > 0"
        class="hour-room-nav-wrapper position_x_c"
        @mousemove.stop="onMouseMoveHanlder($event)"
        @mousedown.stop="onMouseDownHanlder($event)"
        :style="{
            width: this.wrapperWidth + 'px'
        }"
    >   
        <ul
            class="hour-room-nav clearfix"
            ref="hourRoomNav"
            @scroll="hourRoomScroll($event)"
            :style="{
                left: scrollLeft + 'px',
                width: contentWidth + 'px'
            }"
        >
            <li
                :class="{
                    'nav-item': true,
                    active: index === activeIndex
                }"
                v-for="(item, index) in orderIds"
                :key="index"
                @click="switchHourRoom(item, index)"
            >钟点房{{ index + 1 }}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'HourRoomNav',
        props: {
            orderIds: {
                type: Array,
                default () {
                    return []
                }
            }
        },
        data () {
            return {
                scrollLeft: 0,
                dragMouseDownTrue: false,
                startOffsetLeft: 0,
                preScrollLeft: 0,
                originScrollLeft: 0,
                activeIndex: 0
            }
        },
        created() {
            document.addEventListener('mouseup', this.onDocumentMouseup)
        },
        destroyed() {
            document.removeEventListener('mouseup', this.onDocumentMouseup)
        },
        computed: {
            wrapperWidth () {
                return this.orderIds.length * 78 >= 440 ?
                    440 : this.orderIds.length * 78
            },
            contentWidth () {
                return this.orderIds.length * 78
            }
        },
        methods: {
            onMouseMoveHanlder (event) {
                event = event || window.event
                if (this.dragMouseDownTrue) {
                    let scrollLeft = this.originScrollLeft + event.pageX - this.startOffsetLeft
                    let minLeft = -(this.contentWidth - this.wrapperWidth)
                    scrollLeft = scrollLeft >= 0 ?
                        0 : scrollLeft <= minLeft ?
                        minLeft : scrollLeft
                    this.scrollLeft = scrollLeft
                }
            },
            onMouseDownHanlder (event) {
                event = event || window.event
                this.dragMouseDownTrue = true
                this.startOffsetLeft = event.pageX
                this.originScrollLeft = this.scrollLeft
            },
            onDocumentMouseup () {
                this.dragMouseDownTrue = false
            },
            switchHourRoom (id, index) {
                this.$emit('on-switch-hour-room', id)
                this.activeIndex = index
            }
        }
    }
</script>

<style lang="scss">
    .hour-room-nav-wrapper {
        $basic-primary: #1F5A8E;
        position: absolute;
        overflow: hidden;
        height: 40px;
        line-height: 36px;
        top: 0;
        background-color: #FBFBFB;
        color: #999999;
        padding: 0 5px;
        font-size: 14px;
        .hour-room-nav {
            width: 570px;
            position: relative;
            .nav-item {
                float: left;
                border-top: 4px solid transparent;
                width: 78px;
                text-align: center;
                cursor: pointer;
                &.active, &:hover {
                    color: $basic-primary;
                    border-color: $basic-primary;
                }
            }
        }
    }
</style>
