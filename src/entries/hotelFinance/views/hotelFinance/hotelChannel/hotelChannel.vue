<!--渠道-->
<template>
    <div class="hotel-channel">
        <div class="table-nav">
            <span @click="changeShow(0)" :class="active0Class" class="nav-pub nav-l">渠道汇总</span>
            <span @click="changeShow(1)"  :class="active1Class" class="nav-pub nav-r">订单明细</span>

            <div style="float:right;">
                <Select @on-change="dateType" v-model="typeValue" placeholder="请选择类型" style="width:128px;text-align:center">
                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <img src="../../../assets/calendar.png" alt="" class="calendarIcon">
                <DatePicker :clearable="false" :editable="false" @on-change="dateChange" :value="dateValue" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="请选择开始日期和结束日期" style="width: 318px;"></DatePicker>
            </div>
        </div>
        <ul class="date-range">
            <li v-for="(item, $index) in dateList">
                <span class="small-line">|</span>
                <span @click="chooseDateRange(item)" :class="{'dateRangeCur':item.ifActive,'unDateRangeCur':!item.ifActive}" class="text-pointer">{{item.text}}</span>
            </li>
        </ul>
        <div v-show="showChannelAll">
            <!-- 渠道汇总 -->
            <ChShouldGet slot="chShouldGet" ref="chShouldGet"></ChShouldGet>
            <ChDayShouldGet slot="chDayShouldGet" ref="chDayShouldGet"></ChDayShouldGet>
        </div>
        <div v-show="!showChannelAll">
            <!-- 订单明细 -->
            <OrderInfo slot="orderInfo" ref="orderInfo"></OrderInfo>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {mapState, mapActions} from "vuex"
    import ChShouldGet from './ChannelAll/chShouldGet'
    import ChDayShouldGet from './ChannelAll/chDayShouldGet.vue'
    import OrderInfo from './orderInfo.vue'

    import util, {
        formatDate
    } from 'common_libs/util'
    import { financeApiService } from '../../../api/API'

    export default {
        name: 'hotelChannel',
        components:{
            ChShouldGet,
            ChDayShouldGet,
            OrderInfo
        },
        data() {
            return {
                showChannelAll: true,
                active0Class: 'pay-active',
                active1Class: 'pay-status  border-l',
                typeValue: 1,
                typeList: [
                    {label: '按退房日期',value: 1},
                    {label: '按入住日期',value: 2}
                ],
                // dateValue: this.$store.getters.timeStampsChannel,
                dateList: [
                    {text: '今天',  cur:'today'},
                    {text: '昨天',  cur:'yestoday'},
                    {text: '本周',  cur:'thisWeek'},
                    {text: '本月',  cur:'thisMonth'},
                    {text: '过去7天', cur:'pastSevenDays'},
                    {text: '过去30天',cur:'pastThirtyDays'},
                ],
            }
        },
        computed: {
            // 选中的渠道日应收渠道id集合
            channelDayIds () {
                return this.$store.getters.channelDayIds
            },
            // 选中的渠道订单详情渠道id集合
            channelOrderInfoIds () {
                return this.$store.getters.channelOrderInfoIds
            },
            dateValue () {
                let arr = []
                let timeStampsChannel = this.$store.getters.timeStampsChannel
                arr = [this.timestampToTime(timeStampsChannel[0]),this.timestampToTime(timeStampsChannel[1])]
                return arr
            }
        },
        mounted () {
            const todayDate = new Date()  
            const monthFirstDay = new Date(new Date().setDate(1))                       //获取本月第一天

            this.$store.dispatch('channeldate', this.typeValue)
            // let timeStamps = [new Date(this.timestampToTime(monthFirstDay)).getTime(),new Date(this.timestampToTime(todayDate)).getTime() + 24 * 60 * 60 * 1000 - 1]
            // let timeStamps = this.dateValue
            // this.$store.dispatch('timeStampsChannel', timeStamps)

            // let obj = {
            //     startDate: formatDate(timeStamps[0]),
            //     endDate: formatDate(timeStamps[1]),
            //     queryType: 1,
            //     pageSize: 20,
            //     pageNum: 1
            // }
            // this.getChannelReList(obj)                          //渠道应收款
            // this.getChannelOrderDetailList(obj)                 //渠道订单明细
            // this.getDetailTotalAmountData(obj)                  //渠道订单明细列表应收房费总金额


            // this.getChannelDayReListData()
            this.update()
        },
        methods: {
            ...mapActions(['getChannelReList','getChannelDayReList','getChannelOrderDetailList']),
            // 更新所有数据
            update () {
                this.getChannelReListData()                     //渠道应收款
                this.getChannelDayReListData()                  //渠道日应收
                this.getChannelOrderDetailListData()            //渠道订单详情列表
                this.getDetailTotalAmountData()                 //渠道订单明细列表应收房费总金额
                this.$refs.orderInfo.getOrderFromList()         //获取渠道订单详情渠道
                this.$refs.chDayShouldGet.getOrderFromList()    //获取渠道日应收渠道
            },

            // 切换tab
            changeShow (index) {
                if (index == 0) {
                    this.showChannelAll = true
                    this.active0Class = 'pay-active'
                    this.active1Class = 'pay-status  border-l'
                } else {
                    this.showChannelAll = false
                    this.active0Class = 'pay-status'
                    this.active1Class = 'pay-active '
                }
            },

            // 选中自定义日期
            chooseDateRange (item) {
                this.$nextTick(function () {
                    this.dateList.forEach(function (item) {
                        Vue.set(item,'ifActive',false)
                    })
                    Vue.set(item,'ifActive',true);
                })
                this.matchDate(item.cur)
            },

            // 日期匹配
            matchDate (cur) {
                const todayDate = new Date()  
                const yesterday = this.getDay(-1)                                           //昨日
                const todayWeekDate = todayDate.getDay()                                    //获取今日星期几
                const monthFirstDay = new Date(new Date().setDate(1))                       //获取本月第一天
                switch (cur) {
                    case 'today' : 
                        this.upDateCommon([this.timestampToTime(todayDate.getTime()),this.timestampToTime(todayDate.getTime())])
                        break
                    case 'yestoday' : 
                        this.upDateCommon([this.timestampToTime(yesterday.getTime()),this.timestampToTime(yesterday.getTime())])
                        break
                    case 'thisWeek' : 
                        // 周日情况
                        if(todayWeekDate == 0){
                            this.upDateCommon([this.timestampToTime(this.getDay(-6).getTime()),this.timestampToTime(todayDate.getTime())])
                            return
                        }
                        // 周一情况
                        if(todayWeekDate == 1){
                            this.upDateCommon([this.timestampToTime(todayDate.getTime()),this.timestampToTime(todayDate.getTime())])
                            return
                        }
                        // 其他日期
                        let agoOtherDay = this.getDay(-(Number((todayWeekDate - 1))))
                        this.upDateCommon([this.timestampToTime(agoOtherDay.getTime()),this.timestampToTime(todayDate.getTime())])
                        break
                    case 'thisMonth' : 
                        this.upDateCommon([this.timestampToTime(monthFirstDay.getTime()),this.timestampToTime(todayDate.getTime())])
                        break
                    case 'pastSevenDays' : 
                        this.upDateCommon([this.timestampToTime(this.getDay(-7).getTime()),this.timestampToTime(yesterday.getTime())])
                        break
                    case 'pastThirtyDays' : 
                        this.upDateCommon([this.timestampToTime(this.getDay(-30).getTime()),this.timestampToTime(yesterday.getTime())])
                        break
               }
            },

            upDateCommon(dateValue) {
                let timeStamps = [dateValue[0], dateValue[1]]
                this.$store.dispatch('timeStampsChannel', timeStamps)
                this.$refs.chDayShouldGet.tPage.pageNum = 1
                this.$refs.orderInfo.tPage.pageNum = 1
                this.update()        
            },

            // 格式化为页面显示时间
            timestampToTime(date) {
                var now = new Date(date);
                var yy = now.getFullYear();      //年
                var mm = now.getMonth() + 1;     //月
                var dd = now.getDate();          //日
                var clock = yy + "/";
                if(mm < 10) clock += "0";
                clock += mm + "/";
                if(dd < 10) clock += "0";
                clock += dd + "";
                return clock
            },

            //    -1 代表前一天，-2前两天...  获取前num天的日期
            getDay(num, str) {
                let today = new Date();
                let nowTime = today.getTime();
                let ms = 24*3600*1000*num;
                today.setTime(parseInt(nowTime + ms));
                return today
                // let oYear = today.getFullYear();
                // let oMoth = (today.getMonth() + 1).toString();
                // if (oMoth.length <= 1) oMoth = '0' + oMoth;
                // let oDay = today.getDate().toString();
                // if (oDay.length <= 1) oDay = '0' + oDay;
                // return oYear + str + oMoth + str + oDay;
            },

            // 选择退房日期、入住日期类型
            dateType (val) {
                this.$store.dispatch('channeldate', val)
                this.$refs.chDayShouldGet.tPage.pageNum = 1
                this.$refs.orderInfo.tPage.pageNum = 1
                this.update()            
            },

            // 选择日期切换
            dateChange(date) {
                date[0] = util.timeStampTransformation(date[0]) - 8 * 60 * 60 * 1000
                date[1] = util.timeStampTransformation(date[1]) + 16 * 60 * 60 * 1000 - 1
                if(date[1] - date[0] > 31 * 24 * 60 * 60 * 1000){
                    this.$Message.error('日期范围不能大于31天，请重新选择')
                    return
                }
                let timeStamps = [date[0], date[1]] 
                this.$store.dispatch('timeStampsChannel', timeStamps)
                this.$refs.chDayShouldGet.tPage.pageNum = 1
                this.$refs.orderInfo.tPage.pageNum = 1

                for(let q = 0;q < this.dateList.length;q++){
                    Vue.set(this.dateList[q],'ifActive',false)
                }
                this.update()            
            },
            
            // 渠道应收列表
            getChannelReListData() {
                let obj = {
                    startDate: formatDate(this.$store.getters.timeStampsChannel[0]),
                    endDate: formatDate(this.$store.getters.timeStampsChannel[1]),
                    queryType: this.$store.getters.channeldate,
                    channelId: this.$store.getters.channelDayIds,
                }
                if(obj.channelId.length == 0){
                    delete obj.channelId
                }
                if(obj.startDate && obj.endDate){
                    this.getChannelReList(obj)                  
                }else{
                    console.log('日期错误:',obj)
                }
            },

            // 渠道日应收列表
            getChannelDayReListData() {
                let obj = {
                    startDate: formatDate(this.$store.getters.timeStampsChannel[0]),
                    endDate: formatDate(this.$store.getters.timeStampsChannel[1]),
                    queryType: this.$store.getters.channeldate,
                    channelId: this.$store.getters.channelDayIds,
                    pageSize: 20,
                    pageNum: this.$refs.chDayShouldGet.tPage.pageNum
                }
                if(obj.channelId.length == 0){
                    delete obj.channelId
                }
                if(obj.startDate && obj.endDate){
                    this.getChannelDayReList(obj)                  
                }else{
                    console.log('日期错误:',obj)
                }
            },

            // 渠道订单明细
            getChannelOrderDetailListData() {
                let obj = {
                    startDate: formatDate(this.$store.getters.timeStampsChannel[0]),
                    endDate: formatDate(this.$store.getters.timeStampsChannel[1]),
                    queryType: this.$store.getters.channeldate,
                    channelId: this.$store.getters.channelOrderInfoIds,
                    pageSize: 20,
                    pageNum: this.$refs.orderInfo.tPage.pageNum
                }
                if(obj.channelId.length == 0){
                    delete obj.channelId
                }
                if(obj.startDate && obj.endDate){
                    this.getChannelOrderDetailList(obj)          
                }else{
                    console.log('日期错误:',obj)
                }
            },
            
            // 获取渠道订单详情总价
            getDetailTotalAmountData() {
                let obj = {
                    startDate: formatDate(this.$store.getters.timeStampsChannel[0]),
                    endDate: formatDate(this.$store.getters.timeStampsChannel[1]),
                    queryType: this.$store.getters.channeldate,
                    channelId: this.$store.getters.channelOrderInfoIds,
                }
                if(obj.channelId.length == 0){
                    delete obj.channelId
                }
                if(obj.startDate && obj.endDate){
                    financeApiService.getDetailTotalAmountServic(obj).then(result => {
                        if (!(result.hasOwnProperty('code'))) {
                            this.$Message.error(result.message);
                            return
                        }
                        if(result.code == '000000'){
                            this.$refs.orderInfo.totalAmount = Number(result.content) / 100
                        }else{
                            this.$Message.error(result.message);
                        }
                    })
                }else{
                    console.log('日期错误:',obj)
                }
            }
        },
        watch: {
            channelDayIds: {
                handler (data) {
                    this.getChannelDayReListData(data)
                },
                deep: true
            },
            channelOrderInfoIds: {
                handler (data) {
                    this.getChannelOrderDetailListData(data)
                },
                deep: true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .hotel-channel{
        padding: 20px 20px 40px 20px;
        // .ivu-select{
        //     .ivu-select-selection{
        //         border-radius: 20px
        //     }
        // }
        .calendarIcon{
            width: 28px;
            height: 26px;
            margin: 0 17px;
            vertical-align: middle
        }
        .date-range {
            font-size:14px;
            overflow: hidden;
            clear: both;
            float: right;
            .text-pointer {
                cursor: pointer;
            }
            .dateRangeCur {
                color: #235F92;
                font-weight: 700
            }
            .unDateRangeCur {
                color: #9AA7C1;
            }
            .small-line {
                margin: 0 6px;
            }
            li {
                float: left;
            }
            li:first-child .small-line {
                display: none;
            }
        }
        .table-nav {
            width:100%;
            margin: 0px auto 0;
        }
        .nav-pub {
            font-size: 16px;
            cursor: pointer;
            line-height: 42px;
        }
        .nav-l {
            border-radius: 21px 0 0 21px;
            border-right: 0;
        }
        .nav-r {
            border-radius:0 20px 20px 0;
            border-left: 0;
            margin-left: -4px;
        }
        .pay-active {
            color: #fff;
            padding: 8px 26px;
            border: 0;
            background: linear-gradient(left, #9AA7C1, #C7D3EC);
        }
        .pay-status {
            background: #fff;
            color:#9AA7C1;
            padding: 7px 26px;
            border: 1px solid #9AA7C1;
        }
        .border-l {
            border-left: 0;
        }
    }

</style>