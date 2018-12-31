<template>
    <footer class="app-footer disabled-select">
        <ul class="today-order">
            <li @click="openTodayModal(1)">
                <Icon type="ios-log-in" size="20" style="font-weight: 600;" />
                今日预到 &nbsp;&nbsp;{{hotelTodayInOrderList.length}}
            </li>
            <li @click="openTodayModal(2)">
                <Icon type="ios-log-out" size="20" style="font-weight: 600;" />
                今日预离 &nbsp;&nbsp; {{hotelTodayOutOrderList.length}}
            </li>
        </ul>
        <div class="remind" @click="showOrderNoticeList = !showOrderNoticeList">
            <Badge :count="80" :offset="[13, -5]" class-name="remind-badge">
                <Icon type="md-text" color="#fff" size="20" />
            </Badge>
        </div>
        <!-- 今日预离预到弹窗 -->
        <order-modal :data="modalData" ref="orderModal"></order-modal>

        <!-- 订单消息列表 -->
        <order-notice-list v-show="showOrderNoticeList" ref="orderNoticeList"></order-notice-list>
        
        <!-- 最新接收提示信息 -->
        <!-- <NewMessageTip></NewMessageTip> -->
    </footer>
</template>


<script>
    import {mapActions} from 'vuex'
    import OrderModal from './OrderModal/'
    import OrderNoticeList from './OrderNoticeList/'
    import NewMessageTip from './newMessageTip/'
    import AppModal from 'common_components/AppModal/'
    function formatDateTime(inputTime) {
        let date = new Date(inputTime)
        let m = date.getMonth() + 1;  
        m = m < 10 ? ('0' + m) : m;  
        let d = date.getDate();  
        d = d < 10 ? ('0' + d) : d;  
        return m + '-' + d  
    }

    export default {
        name: 'appFooter',
        created() {
            this.dispatchGetHotelTodayInOrder()
            this.dispatchGetHotelTodayOutOrder()
        },
        components: {
            OrderModal,
            OrderNoticeList,
            NewMessageTip,
            AppModal
        },
        data() {
            return {
                todayOrderModal:true,
                modalData: {
                    type : 1,
                    list : [],
                },
                showOrderNoticeList:false,
                orderNoticeListData: [
                    {
                        id:1,
                        orderNo: 9996588745552,
                        orderType: 0,
                        orderStatus: 0,
                        roomType: '双人床房',
                        orderData: '2018-12-04 13:22',
                        checkInData: '2018-09-11',
                        checkOutData: '2018-12-04',
                        name: '周公子',
                        channelCode: '000031',
                        nights: 1,
                        channelName: '美团'
                    }
                ],
                ftButlerListData: [
                    {
                        id:1,
                        title:'直连审核已通过',
                        time: '2018-12-08 18:04',
                        content: '建立的直连已生效，已关联的房型将自动同步OT连已生效，已关联的房型将自将自动同步OT连已生效，已关联的房型将自将自动同步OT连已生效，已关联的房型将自动同步OT连已关联的房型将自动同步'
                    }
                ]
            }
        },
        computed: {
            hotelTodayInOrderList() {
                let data = JSON.parse(JSON.stringify(this.$store.state.hotelStatus.hotelTodayInOrderList));
                for(let q = 0;q < data.length;q++){
                    data[q].subTotal = data[q].subTotal/100
                }
                return data;
            },
            hotelTodayOutOrderList() {
                let data = JSON.parse(JSON.stringify(this.$store.state.hotelStatus.hotelTodayOutOrderList));
                for(let q = 0;q < data.length;q++){
                    data[q].subTotal = data[q].subTotal/100
                }
                return data;
            },
        },
        methods: {
            ...mapActions(['dispatchGetHotelTodayInOrder','dispatchGetHotelTodayOutOrder']),
            openTodayModal(type) {
                let data
                if(type == 1){
                    data = JSON.parse(JSON.stringify(this.hotelTodayInOrderList))
                }else{
                    data = JSON.parse(JSON.stringify(this.hotelTodayOutOrderList))
                }
                for(let q = 0;q < data.length;q++){
                    data[q].checkInAt = formatDateTime(data[q].checkInAt)
                    data[q].checkOutAt = formatDateTime(data[q].checkOutAt)
                    // data[q].orderFrom = '000031'
                }
                this.modalData = {
                    type : type,
                    list : data,
                }
                this.$refs.orderModal.modal = true
            },
        }
    }
</script>

<style lang="scss">
    .app-footer {
        position: absolute;
        bottom: 0;
        background: #89A0B1;
        width: 100%;
        height: 40px;
        padding-left: 30px;
        .today-order {
            line-height: 39px;
            li {
                display: inline-block;
                background: #7E96A9;
                font-size: 14px;
                color: white;
                padding: 0 10px;
                margin: 0 10px;
                cursor: pointer;
            }
        }
        .remind {
            position: absolute;
            right: 0;
            top: 0;
            line-height: 39px;
            background: #7E96A9;
            text-align: center;
            width: 80px;
            cursor: pointer;
            .remind-badge {
                border: 0;
                height: 17px;
                line-height: 17px;
                padding: 0 4px;
                box-shadow: 0 0 0 1px transparent;
            }
        }
    }
</style>
