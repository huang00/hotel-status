<template>
    <transition name="hotel-lists">
        <div class="hotel-list" @click.stop>
            <div class="search-hotel">
                <Input placeholder="客栈名称" class="search-input" v-model="searchValue">
                    <Icon type="ios-search" slot="suffix" size="18"/>
                </Input>
            </div>
            <ul class="list custom-scrollbar">
                <li
                    :class="{
                        item: true,
                        textCent: true,
                        cursPoint: true,
                        active: innId == item.innId
                    }"
                    v-for="item in hotelList"
                    :key="item.innId"
                    @click="switchHotel(item)"
                    :title="item.innName"
                >
                    <span class="text-break-1">
                        {{ item.innName }}
                    </span>
                </li>
                <li class="not-data textCent" v-if="hotelList.length === 0">什么都没有搜到！</li>
            </ul>
        </div>
    </transition>
</template>

<script>
import {
    getCookie
} from 'common_libs/util'

export default {
    name: 'HotelList',
    data () {
        return {
            searchValue: '',
            innId: getCookie('innId')
        }
    },
    computed: {
        hotelList () {
            let hotelList = this.$store.getters.hotelList.filter(item => item.innName.indexOf(this.searchValue) >= 0)
            return hotelList
        }
    },
    methods: {
        switchHotel (item) {
            this.$emit('on-change', item)
        }
    }
}
</script>

<style lang="scss">
    .hotel-list {
        z-index: 1;
        position: absolute;
        top: 55px;
        left: 10px;
        width:180px;
        background: rgba(255,255,255,1);
        box-shadow: 2px 2px 8px 0px rgba(0,0,0,0.12);
        border-radius: 4px;
        padding: 10px;
        overflow: hidden;
        .search-hotel {
            .search-input {
                .ivu-input {
                    background: #F0F0F0;
                    border: 0;
                    border-radius:15px;
                }
            }
        }
        .list {
            margin-top: 10px;
            max-height: 290px;
            overflow: auto;
            margin-right: -5px;
            padding-right: 5px;
            .item {
                padding: 10px 0;
                color: #999999;
                font-weight: 400;
                span {
                    display: inline-block;
                    width: 100%;
                }
                &:hover, &.active {
                    background: #FAFAFA;
                    color: #2F6CA3;
                }
            }
            .not-data {
                line-height: 40px;
                color: #999999;
                font-weight: 400;
            }
        }
    }
    .hotel-lists-enter,
    .hotel-lists-leave-to {
        opacity: 0;
        transform: rotateX(-90deg);
    }

    .hotel-lists-enter-active,
    .hotel-lists-leave-active {
        transform-origin: center top 0px;
        transition: opacity .3s ease, transform .5s ease;
    }
</style>
