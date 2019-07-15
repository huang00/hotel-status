<!--收支流水/支付方式流水-->
<template>
     <div class="earn-pay">
          <div style="text-align: right;position: relative; " slot="content">
               <Poptip placement="left" width="233" >
                    <span @click="exportExcel" class="output">导出报表</span>
                    <div slot='content'   >
                      <DatePicker :open="open" v-if="showMonthPicker"   :value="monthVal" @on-change="changeMonth" type="month" placeholder="请选择需要导出的月份" style="width: 200px"></DatePicker>
                    </div>
               </Poptip>
          </div>
          <div class="contant">
               <WtDataTable id="payWaysD" @click="showNoData" :cols="cols"  :dataContent="dataContent"></WtDataTable>
               <TPage  v-show="earnAndPay.total > 20" :total="earnAndPay.total"  @curPage="curPageNum"></TPage>
          </div>
          <input type="hidden" v-model="orderPaymentList">
     </div>
</template>

<script>
var fileDownload = require('js-file-download')
import { mapState, mapActions, mapGetters } from "vuex"
import {
     switchMonthToDay
} from 'hotelFinance/libs/util'
import { financeApiService } from '../../../api/API'
import WtDataTable from '../shareComponents/tabale.vue'
import TPage from '../shareComponents/tPage.vue'
import util, {
     formatDate
} from '../../../../../common_libs/util.js'
export default {
     components: {
          WtDataTable,
          TPage,
     },
     data(){
          return {
               height: 80,
               pageSize:20,
               open: true,
               showMonthPicker: false, //是否显示月份选择器
               monthVal: '',
               checkBox:false,
               cols:[],
               dataContent: []
          }
     },
     watch : {
      earnAndPay : {
        handler (val, oldVal) {
          if (!val.lists.length) {
            this.dataContent = []
          }
        }
      }
     },
     computed: {
          ...mapState(['curDateType']),
          ...mapGetters(['earnAndPay', 'timeStamps', 'timeStampsMonth']),
            // 订单支付方式
          orderPaymentList () {
                //表格中间项
               new Promise(resolve => {
                    if (this.$store.getters.orderPaymentList.length && this.earnAndPay.lists.length) {
                        resolve()
                    }
               }).then(res => {
                    let list = util.objectDeepCopy(this.$store.getters.orderPaymentList) // 表头支付防方式
                    let tempEarnList = util.objectDeepCopy(this.earnAndPay.lists) //表格内容
                    this.dataContent = util.objectDeepCopy(this.earnAndPay.lists)


                    // //补充没有数据的日期
                    // this.timeStamps[0] = new Date(this.timeStamps[0]).setHours(0,0,0,0)
                    // let dateLength = Math.ceil((this.timeStamps[1] - this.timeStamps[0]) / (24 * 60 * 60 * 1000))
                    // let arr = []
                    // for(let q =0;q < dateLength;q++){
                    //      let time = this.timeStamps[1] - q * 24 * 60 * 60 * 1000
                    //      arr.push({
                    //           details:[],
                    //           date:formatDate(time, 'MM-dd'),
                    //           sumMoney:"0",
                    //           timeStamp:time
                    //      })
                    // }
                    // for(let w = 0;w < arr.length;w++){
                    //      for(let c = 0;c < tempEarnList.length;c++){
                    //           if(tempEarnList[c].date == arr[w].date){
                    //                arr[w].date = tempEarnList[c].date
                    //                arr[w].details = tempEarnList[c].details
                    //                arr[w].sumMoney = tempEarnList[c].sumMoney
                    //                arr[w].timeStamp = tempEarnList[c].timeStamp
                    //           }
                    //      }
                    // }
                    // this.dataContent = arr

                    // console.log(61,'内容', tempEarnList)
                    for (let m = 0, len = this.dataContent.length; m < len; m++) {
                         var obj = {}
                         // console.log(62, this.dataContent[m])
                         for (let n = 0, len2 = this.dataContent[m].details.length; n < len2; n++) {
                              // console.log(8888, this.dataContent[m].details[n].payWayId)
                              let payWayId = this.dataContent[m].details[n].payWayId
                              obj[payWayId] = util.changeMoney(this.dataContent[m].details[n].surplus)
                         }
                         let arr = Object.keys(obj)
                         if(arr.length != 0){
                              this.dataContent[m] = Object.assign(this.dataContent[m],obj)
                         }
                    }

                    // console.log(7777, 'this.dataContent', this.dataContent,)
                    // 表格中间部分内容
                    // list.splice(0,5)
                    for (var i = 0, len = list.length; i < len; i++) {
                         var temp = list[i]
                         temp.title =  temp.name
                         temp.key =  temp.id.toString()
                         // console.log(103, list.length, temp.id,  temp.key)
                         var tempKey =  temp.key 
                         if (list.length > 5) {
                            temp.width =  150
                         }
                         temp.className = 'earn-column'

                         temp.render =  (h, params) => {
                              // console.log(105, params)
                              return this.clickCell(h, params, params.column.id.toString())
                         }
                    }
                    // console.log(94, '表头',list)
                    this.cols = util.objectDeepCopy(list)
                         //表格第一行
                    this.cols.unshift({
                         title: '日期',
                         key: 'date',
                         width: 200, //
                         fixed: 'left',
                         className:'earn-column for-left-border',
                         render:(h, params) => {
                              return h('div',  [
                                   h('div', {
                                        style:{
                                             color:'#9AA7C1',
                                             width:'100%',
                                             borderLeft:'2px solid #215D91',
                                             lineHeight: '42px',
                                        }
                                   }, params.row['date']),
                              ])
                         },
                    })
                         //表格最后一行
                    this.cols.push({
                         title: '总计',
                         key: 'sumMoney',
                         width:150,
                         fixed: 'right',
                         className:'earn-column for-left-border',
                         render:(h, params) => {
                            // console.log(124, params)
                              return h('div',  [
                                  h('span', {
                                    style:{
                                      display: 'inline-block',
                                      borderBottom: '1px solid #1F5B8F',
                                      height: '29px',
                                    }
                                  }, [
                                    h('span', {
                                         style:{
                                              color:'#1F5B8F',
                                              width:'100%',
                                              lineHeight: '42px',
                                              cursor:'pointer',
                                         },
                                         on: {
                                              click: () => {
                                                   // 重新打开窗口
                                                   let monthArr = []
                                                   // 跨年判断
                                                  if(params.row.date.slice(0,2) == '01'){
                                                       var curDate = formatDate(this.timeStamps[1], 'yyyy') + '-' + params.row.date
                                                  }else{
                                                       var curDate = formatDate(this.timeStamps[1], 'yyyy') + '-' + params.row.date
                                                  }
                                                   var curDate = formatDate(this.timeStamps[0], 'yyyy') + '-' + params.row.date
                                                   if (this.curDateType == 2) {
                                                     let year = (params.row.date).slice(0, 5)
                                                     let month = (params.row.date).slice(5,7)
                                                     let tempMonth = switchMonthToDay(month, year.slice(0,4))
                                                     monthArr = [year + tempMonth[0], year + tempMonth[1]]
                                                   }
                                                      // console.log(143, monthArr)
                                                   const {href} = this.$router.resolve({
                                                        name: 'payWaysDetail',
                                                        query: {
                                                             queryType: this.curDateType,
                                                             date: this.curDateType == 1 ? curDate : monthArr,
                                                             title: params.column.title,
                                                        }
                                                   })
                                                   window.open(href, '_blank')
                                              }
                                         }
                                    }, params.row['sumMoney']),
                                  ])
                              ])
                        },
                    })
               })
               return this.$store.getters.orderPaymentList
          },
     },
     mounted () {
          let obj = {
              pageNum: 1,
              pageSize: this.pageSize,
              queryType: this.curDateType,
          }
          if (this.curDateType == 2) {
            obj.startDate = this.timeStampsMonth[0].slice(0,7)
            obj.endDate = this.timeStampsMonth[1].slice(0,7)
          } else {
            obj.startDate = formatDate(new Date(new Date().setDate(1)).getTime())
            obj.endDate = formatDate(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
          }
          this.getEarnAndPay(obj)  
          this.total = this.earnAndPay.total
     },
     methods: {
          ...mapActions(['getEarnAndPay']),
               //导出报表
          exportExcel (){
               // console.log('直接导出日流水导出', this.curDateType)
               let data = {
                    queryType: this.curDateType,
               }
               if (this.curDateType == '1') {
                    data.startDate = formatDate(this.timeStamps[0])
                    data.endDate = formatDate(this.timeStamps[1])
                    financeApiService.exportOrderFinancailDetail(data).then(result => {
                         if(result){
                             fileDownload(result,'支付方式流水表_' + data.startDate + '-' + data.endDate + '.csv')
                         }else{
                             this.$Message.error('暂无数据');
                         }
                    })
                    this.showMonthPicker = false
                    
               } else if(this.curDateType == '2'){
                    this.open = true
                    if (this.monthVal != '') {
                         data.startDate = this.monthVal
                         data.endDate = this.monthVal
                        // 成功导出月流水后 清空已选日期让重新选择后才能再次导出   this.showMonthPicker true
                         financeApiService.exportOrderFinancailDetail(data).then(result => {
                              if(result){
                                  this.open = false
                                  fileDownload(result,'支付方式流水表_' + data.startDate + '.csv')
                              }else{
                                  this.$Message.error('暂无数据');
                              }
                         })
                        this.monthVal = ''
                        this.showMonthPicker = false
                    } else {
                        // 选择需要下载的月流水
                        this.showMonthPicker = true
                    }
               }
          },
               //选择需要导出报表的月份
          changeMonth (val) {
               this.monthVal = val
          },
            // 当前处于第几页
          curPageNum (page) {
               console.log('changePage', this.curDateType, formatDate(this.timeStamps[0]), this.timeStampsMonth[1])
               this.getEarnAndPay({
                    pageNum: page,
                    pageSize: this.pageSize,
                    queryType: this.curDateType,
                    startDate: this.curDateType == 1 ? formatDate(this.timeStamps[0]) : this.timeStampsMonth[0], 
                    endDate: this.curDateType == 1 ? formatDate(this.timeStamps[1]):this.timeStampsMonth[1], 
               })
          },
            // 每个tableCell 自定义css 和点击事件
          clickCell (h, params, payWayId) {
               // console.log(777888, params, payWayId)
               if (params.row[payWayId] == undefined) {
                    return h('div', [
                        h('span', '--')
                    ])
               } else {
                    return  h('div', [
                         h('span', {
                          style: {
                            height: '28px',
                            display:'inline-block',
                            borderBottom: `1px solid ${this.colorMatch(params.row[payWayId], payWayId)}`,
                          }
                         },[
                           h('span', {
                              style: {
                                   color: this.colorMatch(params.row[payWayId], payWayId),
                                   fontSize: '14px',
                                   fontWeight: 'nomal',
                                   lineHeight: '42px',
                                   cursor: 'pointer',
                              },
                              on: {
                                    click: () => {
                                        // console.log(262, params)
                                        // 重新打开窗口
                                        // 跨年判断
                                        if(params.row.date.slice(0,2) == '01'){
                                             var curDate = formatDate(this.timeStamps[1], 'yyyy') + '-' + params.row.date
                                        }else{
                                             var curDate = formatDate(this.timeStamps[0], 'yyyy') + '-' + params.row.date
                                        }
                                        const {href} = this.$router.resolve({
                                            name: 'payWaysDetail',
                                                  query: {
                                                        queryType: this.curDateType,
                                                        date: curDate,
                                                        title: params.column.title,
                                                        payWayId: payWayId,
                                                        dateArr: this.timeStampsMonth
                                                  }
                                              })
                                            window.open(href, '_blank')
                                        }
                              }
                         }, params.row[payWayId])
                         ]),  
                         
                    ])
               }

          },
          showTable (payWayId) {
          },
            //匹配文本颜色显示
          colorMatch(money, payWayId) {
               money = parseInt(money)
               if (payWayId == 'sumMoney') {
                    return '#1F5B8F'
               } else if (payWayId == 'date') {
                    return '#9AA7C1'
               }else if (money > 0 ) {
                    return '#85C1E0'
               } else if (money < 0) {
                    return '#E78069'
               } else if(money == 0){
                    return '#9AA7C1'
               }
          },
          showNoData () {
              let emptyBody = document.getElementById('payWaysD').getElementsByClassName('ivu-table-tip')[0];
              emptyBody.innerHTML = '<div class="not-data"><div class="nodata-text">暂无数据 <br/> ...</div></div></div>'
          },
        }
    }
</script>

<style>
    .earn-pay .contant {
        background: #fff;
        width:100%;
        background:rgba(255,255,255,1);
        box-shadow:0px 1px 15px 0px rgba(231,240,245,0.5);
        border-radius:10px;
        padding:0 20px 20px;
    }
    .earn-pay .for-left-border .ivu-table-cell {
        padding-left: 0;
        padding-right: 0;
    }
    /*导出报表*/
    .earn-pay .output {
        text-align: right;
        font-size: 14px;
        color: #9AA7C1;
        line-height: 50px;
        border-radius: 20px;
        padding: 7px 26px;
        border: 1px solid #9AA7C1;
        cursor: pointer;
        margin-bottom: 6px;
    }
    .earn-pay .ivu-poptip-body {
        padding: 0;
    }
    .earn-pay  .ivu-input {
      border: 0;
    }
    .earn-pay .ivu-date-picker {
      float: left;
    }
    .earn-pay .earn-column .ivu-table-cell {
        text-align: center;
        color:#215D91;
        font:  16px/30px 'STHeitiTC';

    }
    .earn-pay .ivu-table-fixed, .ivu-table-fixed-right {
        -webkit-box-shadow: 2px 0 6px -2px rgba(0,0,0,0); 
        box-shadow: 2px 0 6px -2px rgba(0,0,0,0);
    }
    /*滚动条样式*/
    .earn-pay .ivu-table-overflowX::-webkit-scrollbar {/*滚动条整体样式*/
        width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 10px;

    }
    .earn-pay .ivu-table-overflowX::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: #fafafa;
    }
    .earn-pay .ivu-table-overflowX::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 10px;
        background: rgba(0,0,0,0.1);
    }
</style>
