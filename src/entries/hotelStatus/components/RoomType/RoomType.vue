<template>
    <aside class="room-type" :style="{top: scrollTop + 'px'}">
        <ul>
            <li class="room-type-item clearfix"
                v-for="item in roomTypeList" :key="item.roomTypeId">
                <div class="room-type-name">
                    <span class="text-break-3">
                        {{ item.roomTypeName }}
                    </span>
                </div>
                <div class="room-name">
                    <div
                        v-for="(subItem, subIndex) in item.roomList"
                        :key="subItem.roomId"
                        :class="['room-name-item', subIndex === 0 ? 'first':'']"
                    >
                        <span class="text-break-3" :title="subItem.roomNo">
                            {{ subItem.roomNo }}
                        </span>
                    </div>
                </div>
            </li>
        </ul>
    </aside>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'RoomType',
        props: {
            scrollTop: {
                type: Number,
                default: 0
            }
        },
        computed: {
            roomTypeList () {
                return this.$store.getters.roomTypeList
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './roomType';
</style>
