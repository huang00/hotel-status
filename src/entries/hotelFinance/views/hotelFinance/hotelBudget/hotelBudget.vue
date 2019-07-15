<!--收支流水-->
<template>
    <div class="hotel-budget">
        <!-- 日流水、月流水选择 -->
        <div class="typeChooseWrap">
            <Select @on-change="dateType" v-model="typeValue" class="selectDate" style="width:128px;text-align:center">
                <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <img src="../../../assets/calendar.png" alt="" class="calendarIcon">
            <DatePicker :clearable="false" :editable="false" @on-change="dateChange" v-show="typeValue == 1" :value="dateValue" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="请选择开始日期和结束日期" style="width: 318px"></DatePicker>
            <DatePicker :clearable="false" :editable="false" @on-change="monthStartChange" v-show="typeValue == '2'" :value="monthStarValue" type="month" placement="bottom-end" placeholder="选择月份" style="width: 200px"></DatePicker>
            <!-- <span v-show="typeValue == '2'" class="lineText">至</span>
            <DatePicker  @on-change="monthEndChange" v-show="typeValue == '2'" :value="monthEndValue" type="month" placement="bottom-end" placeholder="结束月份" style="width: 100px"></DatePicker> -->
        </div>
        <ul class="date-range" :style="{'opacity':typeValue == 1 ? '1':'0'}">
            <li v-for="(item, $index) in dateList">
                <span class="small-line">|</span>
                <span @click="chooseDateRange(item)" :class="{'dateRangeCur':item.ifActive,'unDateRangeCur':!item.ifActive}" class="text-pointer">{{item.text}}</span>
            </li>
        </ul>

        <div class="showNumberWrap">
            <show-number-box v-for="(item,index) in showBoxData" :key="index" :value="item.value" :text="item.text" :imgSrc="item.imgSrc" :borderColor="item.borderColor" :borderShaw="item.borderShaw"></show-number-box>
        </div>
        <div class="echartsShow">
            <echarts-show :showLineData="showLineData"></echarts-show>
        </div>
        <div class="table-nav">
            <span @click="changeShow(0)" :class="active0Class" class="nav-pub nav-l">支付方式流水</span><span @click="changeShow(1)"  :class="active1Class" class="nav-pub nav-r">收支明细详情</span>
        </div>
        
        <EarnAndPay   v-show="showPay"></EarnAndPay>
        <FinancialDetail  v-show="showFinancial" ></FinancialDetail>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {mapState, mapActions} from "vuex"
    import {
        switchMonthToDay
    } from 'hotelFinance/libs/util'

    import BudgetPng from '../../../assets/Budget.png'
    import income from '../../../assets/income.png'
    import expenditure from '../../../assets/expenditure.png'

    import xianjin from '../../../assets/xianjin.png'
    import zhifubao from '../../../assets/zhifubao.png'
    import weixin from '../../../assets/weixin.png'
    import yinlian from '../../../assets/yinlian.png'
    import qne from '../../../assets/qne.png'
    import meituan from '../../../assets/meituan.png'
    import xiecheng from '../../../assets/xiecheng.png'
    import yl from '../../../assets/yl.png'
    import feizhu from '../../../assets/feizhu.png'
    import qita from '../../../assets/qita.png'

    import showNumberBox from '../../../components/showNumberBox/showNumberBox'
    import echartsShow from './echartsShow/echartsShow'

    import EarnAndPay from './earnAndPay.vue'
    import FinancialDetail from './financialDetail.vue'

    import util, {
        formatDate
    } from 'common_libs/util'
    import {
        publicHttpServer,
    } from 'api/api'

    function compareLine(property,property2){
        return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            // 当结余相等时，用收入来做排序
            if((value2 - value1) == 0){
                return b[property2] - a[property2]
            }else{
                return value2 - value1;
            }
        }
    }


    export default {
        name: 'siderMenu',
        components:{
            showNumberBox,
            echartsShow,
            EarnAndPay,
            FinancialDetail,
        },

        data() {
            return {
                pageSize: 20,
                showPay: true,
                showFinancial: false,
                active0Class: 'pay-active',
                active1Class: 'pay-status border-l',
                showBoxData:[
                    {
                        value: 0.00,
                        text: '收支结余',
                        imgSrc: BudgetPng,
                        borderColor: '#6BB4DAFF',
                        borderShaw: '#C7DFED80'
                    },
                    {
                        value: 0.00,
                        text: '收入',
                        imgSrc: income,
                        borderColor: '#7DC475FF',
                        borderShaw: '#F5FEF4FF'
                    },
                    {
                        value: 0.00,
                        text: '支出',
                        imgSrc: expenditure,
                        borderColor: '#E78069FF',
                        borderShaw: '#FDEBE7FF'
                    },
                ],
                typeList: [
                    {label: '日流水',value: 1},
                    {label: '月流水',value: 2}
                ],
                typeValue: 1,
                dateValue: [this.timestampToTime(new Date(new Date().setDate(1))),this.timestampToTime(new Date())],
                monthStarValue: '',
                monthEndValue: '',
                monthStarValueTem: 0,
                monthEndValueTem: 0,
                activeDate: false,
                dateList: [
                    {text: '今天',  cur:'today'},
                    {text: '昨天',  cur:'yestoday'},
                    {text: '本周',  cur:'thisWeek'},
                    {text: '本月',  cur:'thisMonth'},
                    {text: '过去7天', cur:'pastSevenDays'},
                    {text: '过去30天',cur:'pastThirtyDays'},
                ],
                showLineData:[
                    // { title: '现金',value: '400',iconSrc: xianjin},
                ],
                orderPaymentList:[]
            }
        },
        mounted () {
            
            this.$store.dispatch('curdate', this.typeValue)
            var timeStamps = [new Date(new Date().setDate(1)).getTime(), new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1]
            console.log(timeStamps)
            this.$store.dispatch('initTimeStamp', timeStamps)
            var obj = {
                startDate: formatDate(new Date(new Date().setDate(1)).getTime()),
                endDate: formatDate(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1),
                queryType: 1,
            }
            this.getPaywayPieChart(obj)             //收支饼状图数据
            this.getPaywayBarGraph(obj)             //收支柱状图数据
            this.getFinancailDetail(obj)            //收支流水明细
                            // 获取自定义渠道
        },
        computed: {
            ...mapState(['timeStamps', 'timeStampsMonth']),
            // 渠道列表
            orderFromList () {
                return this.$store.getters.orderFromList
            },
            // 收入支出结余
            getShowBoxData () {
                let obj = {
                    resever:0,
                    out:0,
                    surplus:0
                }
                let pieData = JSON.parse(JSON.stringify(this.$store.getters.paywayPieChart))
                for(let q = 0;q < pieData.length;q++){
                    if(pieData[q].name == '收入'){
                        obj.resever = Number(pieData[q].sumMoney.toFixed(2))
                    }
                    if(pieData[q].name == '支出'){
                        obj.out = Number(pieData[q].sumMoney.toFixed(2))
                    }
                }
                obj.surplus = (Number(obj.resever) - Number(obj.out)).toFixed(2)
                return obj
            },
            // 柱状图数据
            paywayBarChart () {
                return this.$store.getters.paywayBarChart
            },
            // 支付方式列表
            // orderPaymentList () {
            //     return this.$store.getters.orderPaymentList
            // },
        },
        methods: {
            ...mapActions(['getEarnAndPay','getPaywayPieChart','getPaywayBarGraph','getFinancailDetail', 'setChannelIds']), 
            // 更新页面上所有数据
            update() {
                this.getPaywayPieChartData()
                this.getPaywayBarGraphData()
                // 获取支付流水
                this.getEarnAndPay({
                    pageNum: 1,
                    pageSize: this.pageSize,
                    queryType: this.typeValue,
                    startDate: this.typeValue == 1 ? formatDate(this.timeStamps[0]) : formatDate(this.timeStamps[0], 'yyyy-MM'),
                    endDate: this.typeValue == 1 ? formatDate(this.timeStamps[1]) : formatDate(this.timeStamps[1], 'yyyy-MM'),
                })
                // 获取收支详情
                this.getFinancailDetail({
                    queryType:this.typeValue,
                    pageNum: 1,
                    pageSize: this.pageSize,
                    startDate: this.typeValue == 1 ? formatDate(this.timeStamps[0]) : this.timeStampsMonth[0],
                    endDate:  this.typeValue == 1 ? formatDate(this.timeStamps[1]) : this.timeStampsMonth[1],
                })
                // 有订单的自定义渠道获取。
                let channelParam = {
                    startDate: this.typeValue == 1 ? formatDate(this.timeStamps[0]) : this.timeStampsMonth[0],
                    endDate: this.typeValue == 1 ? formatDate(this.timeStamps[1]) : this.timeStampsMonth[1],
                    channelIds: this.orderFromList,
                }
                let channelObj = {
                    data: channelParam,
                    payWay: false
                }
                this.setChannelIds(channelObj)
            },
            // 选择日流水、月流水方式
            dateType (val) {
                this.monthStarValue = '2019-07'
                this.monthEndValue = '2019-07'
                this.monthStarValueTem = 0
                this.monthEndValueTem = 0
                this.$store.dispatch('curdate', val)
                if(val == 1){
                    this.matchDate('thisMonth')
                    for(let q = 0;q < this.dateList.length;q++){
                        Vue.set(this.dateList[q],'ifActive',false)
                    }
                }
                if(val == 2){
                    let date = new Date()
                    this.matchDate('thisMonth')
                    this.monthStarValue = date.getFullYear() + '-' + (date.getMonth() + 1)
                    this.monthEndValue = ''
                }
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
                this.$store.dispatch('initTimeStamp', timeStamps)
                for(let q = 0;q < this.dateList.length;q++){
                    Vue.set(this.dateList[q],'ifActive',false)
                }
                this.update()               
            },
            // 选择月份开始
            monthStartChange(date) {
                let timeStampsStart = Number(new Date(date).getTime()) - 8 * 60 * 60 * 1000

                let tempTime = formatDate(timeStampsStart)
                let year = tempTime.slice(0,5)
                let month = tempTime.slice(5,7)
                let startMonthDay =  year + switchMonthToDay(month)[0]
                let endMonthDay = year + switchMonthToDay(month)[1]
                let timeStamps = [timeStampsStart, timeStampsStart] 
                let timeStampsMonth = [startMonthDay, endMonthDay] 
                this.$store.dispatch('initTimeStamp', timeStamps)
                this.$store.dispatch('initTimeStampMonth', timeStampsMonth)
                this.update()
                    
                // this.monthStarValueTem = timeStampsStart
                // if(this.monthEndValueTem){
                //     if(timeStampsStart > this.monthEndValueTem){
                //         alert('结束时间不能小于结束时间')
                //         return
                //     }
                //     let timeStamps = [timeStampsStart, this.monthEndValueTem] 
                //     this.$store.dispatch('initTimeStamp', timeStamps)
                //     this.update()            
                // }
            },
           
            // 选择月份结束 ----暂时弃用   只能选择一个月
            monthEndChange(date) {
                let year = new Date(date).getFullYear()
                let month = new Date(date).getMonth() + 1
                let timeStampsEnd = new Date(year,month,0).getTime() + 24 * 60 * 60 * 1000 - 1
                this.monthEndValueTem = timeStampsEnd
                if(this.monthStarValueTem){
                    if(this.monthStarValueTem > timeStampsEnd){
                        alert('结束时间不能小于结束时间')
                        return
                    }
                    let timeStamps = [this.monthStarValueTem, timeStampsEnd] 
                    this.$store.dispatch('initTimeStamp', timeStamps)
                    this.update()            
                }
            },
            // 点击tab切换
            changeShow (index) {
                if (index == 0) {
                    this.showPay = true
                    this.showFinancial = false
                    this.active0Class = 'pay-active'
                    this.active1Class = 'pay-status  border-l'
                } else {
                    this.showPay = false
                    this.showFinancial = true
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
                        this.dateValue = [this.timestampToTime(todayDate),this.timestampToTime(todayDate)]
                        this.pushInitTimeStamp(this.dateValue)
                        this.update()          
                        break
                    case 'yestoday' : 
                        this.dateValue = [this.timestampToTime(yesterday),this.timestampToTime(yesterday)]
                        this.pushInitTimeStamp(this.dateValue)
                        this.update()          
                        break
                    case 'thisWeek' : 
                        // 周日情况
                        if(todayWeekDate == 0){
                            this.dateValue = [this.timestampToTime(this.getDay(-6)),this.timestampToTime(todayDate)];
                            this.pushInitTimeStamp(this.dateValue)
                            this.update()          
                            return
                        }
                        // 周一情况
                        if(todayWeekDate == 1){
                            this.dateValue = [this.timestampToTime(todayDate),this.timestampToTime(todayDate)]
                            this.pushInitTimeStamp(this.dateValue)
                            this.update()          
                            return
                        }
                        // 其他日期
                        let agoOtherDay = this.getDay(-(Number((todayWeekDate - 1))))
                        this.dateValue = [this.timestampToTime(agoOtherDay),this.timestampToTime(todayDate)]
                        this.pushInitTimeStamp(this.dateValue)
                        this.update()          
                        break
                    case 'thisMonth' : 
                        this.dateValue = [this.timestampToTime(monthFirstDay),this.timestampToTime(todayDate)]
                        this.pushInitTimeStamp(this.dateValue)
                        this.update()          
                        break
                    case 'pastSevenDays' : 
                        this.dateValue = [this.timestampToTime(this.getDay(-7)),this.timestampToTime(yesterday)]
                        this.pushInitTimeStamp(this.dateValue)
                        this.update()          
                        break
                    case 'pastThirtyDays' : 
                        this.dateValue = [this.timestampToTime(this.getDay(-30)),this.timestampToTime(yesterday)]
                        this.pushInitTimeStamp(this.dateValue)
                        this.update()          
                        break
               }
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

            // 更新开始结束时间到store
            pushInitTimeStamp(dateValue) {
                dateValue = JSON.parse(JSON.stringify(dateValue))
                dateValue[0] = util.timeStampTransformation(dateValue[0])
                dateValue[1] = util.timeStampTransformation(dateValue[1]) + 24 * 60 * 60 * 1000 - 1
                let timeStamps = [dateValue[0], dateValue[1]] 
                let timeStampsMonth = [formatDate(dateValue[0]), formatDate(dateValue[1])] 
                this.$store.dispatch('initTimeStamp', timeStamps)
                this.$store.dispatch('initTimeStampMonth', timeStampsMonth)
            },

            // 获取收支饼状图数据
            getPaywayPieChartData() {
                var obj = {
                    startDate: this.$store.getters.curDateType == 1 ? formatDate(this.$store.getters.timeStamps[0]) : formatDate(this.$store.getters.timeStamps[0], 'yyyy-MM'),
                    endDate: this.$store.getters.curDateType == 1 ? formatDate(this.$store.getters.timeStamps[1]) : formatDate(this.$store.getters.timeStamps[1], 'yyyy-MM'),
                    queryType: this.$store.getters.curDateType,
                }
                if(obj.startDate && obj.endDate){
                    this.getPaywayPieChart(obj)          //收支饼状图数据
                }else{
                    console.log('日期错误:',obj)
                }
            },

            // 获取收支饼状图数据
            getPaywayBarGraphData() {
                var obj = {
                    startDate: this.$store.getters.curDateType == 1 ? formatDate(this.$store.getters.timeStamps[0]) : formatDate(this.$store.getters.timeStamps[0], 'yyyy-MM'),
                    endDate: this.$store.getters.curDateType == 1 ? formatDate(this.$store.getters.timeStamps[1]) : formatDate(this.$store.getters.timeStamps[1], 'yyyy-MM'),
                    queryType: this.$store.getters.curDateType,
                }
                if(obj.startDate && obj.endDate){
                    this.getPaywayBarGraph(obj)          //收支饼状图数据
                }else{
                    console.log('日期错误:',obj)
                }
            },

            // 获取对应的Icon图标  根据payments的value值获取icon
            getShowLineIcon(id) {
                let res = null
                switch(id){
                    case '1':
                        res = xianjin
                        break
                    case '2':
                        res = zhifubao
                        break
                    case '3':
                        res = weixin
                        break
                    case '4':
                        res = yinlian
                        break
                    case '5':
                        res = qne
                        break
                    case '6':
                        res = meituan
                        break
                    case '7':
                        res = xiecheng
                        break
                    case '8':
                        res = yl
                        break
                    case '9':
                        res = feizhu
                        break
                    case '10':
                        res = qita
                        break
                }
                return res
            },
        },

        watch: {
            getShowBoxData(data) {
                if(data){
                    this.showBoxData[0].value = Number(data.resever) - Number(data.out)
                    this.showBoxData[1].value = data.resever
                    this.showBoxData[2].value = data.out
                }
            },
            paywayBarChart(data){
                console.log(data)
                this.showLineData = []
                const INNID = util.getCookie('innId')
                publicHttpServer.getHotelOrderPayMent({
                    innId: INNID
                }).then(result => {
                    console.log(2222)
                    this.orderPaymentList = result.content
                    if(data.length > 0){
                        let _data = JSON.parse(JSON.stringify(data))
                        // _data = _data.sort(compareLine('surplus','payIn'))
                        this.showLineData = _data

                        this.showLineData = JSON.parse(JSON.stringify(this.orderPaymentList))
                        for(let w = 0;w < this.showLineData.length;w++){
                            this.showLineData[w].surplus = 0
                        }
                        for(let q = 0;q < this.showLineData.length;q++){
                            for(let w = 0;w < _data.length;w++){
                                if(Number(this.showLineData[q].id) === Number(_data[w].payWayId)){
                                    this.showLineData[q].surplus = _data[w].surplus
                                    this.showLineData[q].payIn = _data[w].payIn
                                }
                            }
                        }

                        for(let q = 0;q < this.showLineData.length;q++){
                            this.showLineData[q].iconSrc = this.getShowLineIcon(this.showLineData[q].value.toString())
                        }
                        this.showLineData.sort(compareLine('surplus','payIn'))
                    }else{
                        for(let z = 0;z < this.orderPaymentList.length;z++){
                            let srcIcon = this.getShowLineIcon(this.orderPaymentList[z].value.toString())
                            this.showLineData.push({
                                iconSrc : srcIcon,
                                name : this.orderPaymentList[z].name,
                                surplus : 0,
                            })
                        }
                    }
                })

            },
            orderFromList (val) { 
                // return 
                let channelParam = {
                    startDate: this.typeValue == 1 ? formatDate(this.timeStamps[0]) : this.timeStampsMonth[0],
                    endDate: this.typeValue == 1 ? formatDate(this.timeStamps[1]) : this.timeStampsMonth[1],
                    channelIds: val,
                }
                let channelObj = {
                    data: channelParam,
                    payWay: false
                }
                this.$store.dispatch('setChannelIds',channelObj)
            }
        },
    }
</script>

<style lang="scss" scoped>
    .hotel-budget{
        padding: 20px 20px 40px 20px;
        .calendarIcon{
            width: 28px;
            height: 26px;
            margin: 0 20px;
            margin-top: 3px;
        }
        .typeChooseWrap{
            display: flex;
            justify-content: flex-end;
            .lineText{
                height: 32px;
                line-height: 32px;
                margin: 0 5px
            }
        }
        .selectDate{
            width:128px;
            // margin-right:20px;
            text-align:center
        }
        .date-range {
            font-size:14px;
            overflow: hidden;
            clear: both;
            margin: 10px 0;
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
        .showNumberWrap{
            overflow: hidden;
            clear: both;
        }
        .echartsShow{
            overflow: hidden;
            clear: both;
        }
        .table-nav {
            width:100%;
            margin: 40px auto 0;
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

    @media screen and (max-width: 1250px) {
        .showNumberWrap{
            overflow: hidden;
            margin:10px 0 27px 0;
            .showNumberBox{
                float: left;
                margin-right: 10px;
                margin-bottom: 10px;
            }
            .showNumberBox:nth-child(3){
                margin-right:0
            }
        }
    }

    @media screen and (min-width: 1250px) {
        .showNumberWrap{
            overflow: hidden;
            margin:10px 0 27px 0;
            .showNumberBox{
                float: left;
                margin-right: 30px;
                margin-bottom: 10px;
            }
            .showNumberBox:nth-child(3){
                margin-right:0
            }
        }
    }

</style>
