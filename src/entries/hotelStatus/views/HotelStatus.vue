<template>
    <div class="hotel-status">
        <!-- 上边 时间抽 -->
        <div class="header-wrapper">
            <time-axis :scrollLeft="timeAxisScrollLeft"></time-axis>
        </div>
        <!-- 左边 房型列表 -->
        <div class="room-type-wrapper">
            <room-type :scrollTop="roomTypeScrollTop"></room-type>
            <room-type-full :room-type-list-len="roomTypeListLen" v-if="roomTypeListLen"></room-type-full>
        </div>
        <!-- 时间选择器 -->
        <div class="date-picker-wrapper">
            <date-picker></date-picker>
        </div>
        <!-- 格子 -->
        <main
            class="hotel-status-main"
            @scroll="paperScroll"
            ref="hotelStatusMain"
        >
            <hotel-orders
                v-if="roomTypeListLen"
                :scrollLeft="scrollLeft"
                :scrollTop="scrollTop">
            </hotel-orders>
            <hotel-orders-full
                v-if="roomTypeListLen"
                :room-type-list-len="roomTypeListLen"
            >
            </hotel-orders-full>
            <not-order-data v-if="roomTypeListLen === 0 && showNotData"></not-order-data>
            <hover-show-detail
                :data="suborderDetails"
                :scrollLeft="scrollLeft"
            ></hover-show-detail>
            <opr-tool-tip
                :tool-tip-style="toolTipStyle"
                :is-predetermine="isPredetermine"
                :show-check-in-button="showCheckInButton"></opr-tool-tip>
        </main>
        <!-- 二当家激活后第一次登录提示 -->
        <!-- <app-modal
            v-model="formEr"
            :width="512"
            :height="233"
            :header-hide="true"
            :closable="false"
            :mask-closable="false"
            class="in-first-modal"
        >
            <div class="in-first">
                <p class="title fontSize16 textCent">自动导入客栈</p>
                <div class="content fontSize14 margin_x_c">
                    疯特民宿管家与“二当家”公众号账号互通，已为您自动导入客栈信息！
                </div>
            </div>
            <div slot="footer" class="modal-footer textCent">
                <button class="public-buttons save" @click="formEr = false">确定</button>
            </div>
        </app-modal> -->
        <input type="hidden" v-model="theCurrentNeedToQueryTheStartTime">
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import {
        formatDate,
        setCookie,
        getCookie
    } from 'common_libs/util'
    // import AppModal from 'common_components/AppModal'
    import TimeAxis from '../components/TimeAxis/'
    import RoomType from '../components/RoomType/'
    import RoomTypeFull from '../components/RoomTypeFull/'
    import DatePicker from '../components/DatePicker/'
    import HotelOrders from '../components/HotelOrders/'
    import HotelOrdersFull from '../components/HotelOrdersFull/'
    import NotOrderData from '../components/NotOrderData/'
    import HoverShowDetail from '../components/HoverShowDetail/'
    import OprToolTip from '../components/OprToolTip/'

    export default {
        name: 'hotel-status',
        components: {
            TimeAxis,
            RoomType,
            RoomTypeFull,
            DatePicker,
            HotelOrders,
            HotelOrdersFull,
            NotOrderData,
            HoverShowDetail,
            OprToolTip,
            // AppModal
        },
        data () {
            return {
                screenWidth: document.body.clientWidth,
                screeHeight: document.body.clientHeight,
                timeAxisScrollLeft: 0,
                roomTypeScrollTop: 0,
                scrollLeft: 0,
                scrollTop: 0,
                suborderDetails: {},
                showNotData: false, // 延迟显示 没有数据
                toolTipStyle: {
                    display: 'none'
                },
                showCheckInButton: false,
                isPredetermine: false,
                // formEr: false
            }
        },
        created() {
            setTimeout(() => {
                this.showNotData = true
            }, 500)
            // this.formEr = !!getCookie('formEr')
            // setCookie('formEr', '')
        },
        computed: {
            theCurrentNeedToQueryTheStartTime () {
                let startTime = this.$store.getters.theCurrentNeedToQueryTheStartTime
                let beginDate = formatDate(+new Date(startTime) - 24*3600000*4)
                let endDate = formatDate(+new Date(startTime) + 24*3600000*25)
                if (startTime) {
                    this.getFestivalList({
                        beginDate,
                        endDate
                    })
                    this.getRoomAndPriceList({
                        startDay: beginDate,
                        endDay: endDate
                    })
                    this.getHotelOrderList({
                        startMill: +new Date(beginDate),
                        endMill: +new Date(endDate)
                    })
                }
                return this.$store.getters.theCurrentNeedToQueryTheStartTime
            },
            roomTypeListLen () {
                return this.$store.getters.roomList.length
            }
        },
        methods: {
            ...mapActions([
                'getFestivalList',
                'getRoomAndPriceList',
                'getHotelOrderList'
            ]),
            paperScroll (e) {
                this.roomTypeScrollTop = -(e.target.scrollTop)
                this.timeAxisScrollLeft = -(e.target.scrollLeft)
                this.scrollLeft = e.target.scrollLeft
                this.scrollTop = e.target.scrollTop
            }
        }
    }
</script>

<style lang="scss">
    .hotel-status {
        box-shadow:0px 0px 22px 0px rgba(0,0,0,0.08);
        border-top-left-radius: 5px;
        position: relative;
        padding-left: 225px;
        padding-top: 80px;
        user-select: none;
        .header-wrapper {
            height: 80px;
            position: absolute;
            width: 100%;
            top: 0;
            left: 0;
            padding-left: 225px;
            overflow: hidden;
        }
        .room-type-wrapper {
            width: 225px;
            position: absolute;
            left: 0;
            height: 100%;
            top: 0;
            overflow: hidden;
            padding-top: 80px;
            padding-left: 10px;
            padding-right: 5px;
        }
        .date-picker-wrapper {
            position: absolute;
            width: 225px;
            height: 80px;
            top: 0;
            left: 0;
            border-top-left-radius: 5px;
            padding-top: 10px;
            padding-left: 10px;
            z-index: 100;
            background: white;
            padding-right: 5px
        }
        .hotel-status-main {
            height: calc(100vh - 170px);
            overflow: auto;
            position: relative;
        }
        .Mon {
            border-right: 0 !important;
        }
        .Mon:after {
            content: " ";
            position: absolute;
            height: 100%;
            width: 20px;
            right: 0;
            top: 0;
            background:linear-gradient(270deg,rgba(193,202,217,0.16) 0%,rgba(203,213,230,0) 100%);
        }
        .in-first-modal {
            .in-first {
                .title {
                    color: #215D91;
                }
                .content {
                    color: #666666;
                    width: 347px;
                    margin-top: 30px;
                }
            }
            .modal-footer {
                height: 50px;
                background: #fcfcfc;
                padding: 8px 35px 0;
                border-bottom-left-radius: 6px;
                border-bottom-right-radius: 6px;
            }
        }
    }
</style>
