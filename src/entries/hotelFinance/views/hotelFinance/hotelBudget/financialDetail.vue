
<template>
    <div class="financial-detail">
        <div class="clearfix financial-wrap" style="min-height:50px;">
            <div style="float: right">
                <Select @on-change="changeOrderFromList" multiple  v-model="model1" style="width:200px;position:relative" placeholder="渠道来源：">
                    <Option  multiple  v-for="item in channelArr" :value="item.id" :key="item.id"  >{{ item.channelName }}</Option>
                </Select>
                    <Select multiple @on-change="changeOrderPaymentTypeList"  v-model="model2" style="width:200px;margin-left: 18px;position:relative" placeholder="收支项目：">
                    <Option v-for="item in orderPaymentTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Select  multiple @on-change="changeOrderPaymentList"  v-model="model3" style="width:200px;margin:0 18px;position:relative" placeholder="支付方式：">
                    <Option v-for="item in orderPaymentList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <div style="display: inline-block; position: relative; ">
                    <Poptip  width="233" placement="left">
                            <span @click="outputExcel" class="output">导出报表</span>
                            <DatePicker :open="open" v-if="showMonthPicker" slot="content" :value="monthVal" @on-change="changeMonth" type="month" placeholder="请选择需要导出的月份" style="width: 200px"></DatePicker>
                    </Poptip>
                </div>
            </div>
        </div>
        <div style="margin:0 auto; background: #fff;border-radius: 10px; padding: 0 20px 20px"> 
            <WtDataTable  :dataContent="financialDetail.lists" :cols="cols" 
                          :height="height"  @click='showNoData' id='payWaysID' ></WtDataTable>  

            <TPage  v-show="financialDetail.total > 20"  ref='child' @click='initPage' :total="financialDetail.total"  @curPage="curPageNum"></TPage>
        </div>
        <app-modal
            v-model="modal"
            :footer-hide="true"
            :header-hide="true">
            <template v-if="modalType === 'look'">
                <look-order-detail
                    :data="mainOrderData"
                    @on-switch="handlerSwitch">
                </look-order-detail>
            </template>
            <template v-else="modalType === 'Updatefinance'">
                <update-order-detail
                    :data="mainOrderData"
                    @on-Updatefinance="handlerUpdate">
                </update-order-detail>
            </template>
        </app-modal>
  </div>
</template>

<script>
var fileDownload = require('js-file-download')

import {
    switchMonthToDay
} from 'hotelFinance/libs/util'
import { financeApiService } from '../../../api/API'
import {mapState, mapGetters, mapActions} from "vuex"
import util, {
    formatDate
} from '../../../../../common_libs/util.js'

import WtDataTable from '../shareComponents/tabale.vue'
import TPage from '../shareComponents/tPage.vue'

import { newOrderData, mainOrderDataProcess,getCookie } from '../../../../../common_libs/util'
import AppModal from '../../../../../common_components/AppModal/'
import LookOrderDetail from '../../../../../common_components/OrderDetails/Lookfinance/'
import UpdateOrderDetail from '../../../../../common_components/OrderDetails/Updatefinance/'
export default {
    components: { 
        WtDataTable,
        TPage,
        UpdateOrderDetail,
        LookOrderDetail,
        AppModal
    },
    data () {
        return {
            mainOrderData: mainOrderDataProcess(newOrderData,[]),
            modalType: 'look',
            modal:false,
            pageSize:20,
            pageNum: 1,
            height: 80,
            showMonthPicker: false, //是否显示月份选择器
            open: true,
            monthVal: '',
            model1: [],
            model2: [],
            model3: [],
            cols:[
                {
                    title: '操作时间',
                    key: 'createTime',
                    align: 'center',
                    width:160,
                    // fixed: 'left',
                    className: 'operate-time-color for-left-border',
                    render: (h, params) => {
                        let node = []
                        let md = params.row['createTime'].slice(0,5)
                        let hms = params.row['createTime'].slice(5)
                        node.push(
                            h('span', {
                                style: {
                                    fontSize: '14px',
                                    color: '#9AA7C1',
                                }
                            }, md)
                        )
                        node.push(
                            h('span', {
                                style: {
                                    fontSize: '12px',
                                    color: '#9AA7C1',
                                }
                            }, hms)
                        )
                        return h('div', {
                            style: {}
                        }, node)
                    //分开显示表头和内容 文本颜色
                        // return  h('div', [
                        //     h('div', {
                        //         style: {
                        //             color: '#9AA7C1',
                        //             fontSize: '14px',
                        //             with:'100%',
                        //             background: 'blue',
                        //             // borderLeft:'2px solid #215D91'
                        //         },
                        //     }, params.row['createTime'])
                        // ])
                    }
                },
                {
                    title: '渠道来源',
                    key: 'channelName',
                    align: 'center',
                    // width:150,
                    className: 'demo-table-info-column',
                    render: (h, params) => {
                        //分开显示表头和内容 文本颜色
                        return this.cellColor(h, params, 'channelName')
                    }
                },
                {
                    title: '房间号',
                    key: 'roomNum',
                    align: 'center',
                    // width:150,
                    className: 'demo-table-info-column',
                    render: (h, params) => {
                        // console.log(114, params)
                        //分开显示表头和内容 文本颜色
                        let arr = []
                        for(let q = 0;q < params.row.roomNum.length;q++){
                            arr.push(
                                h('div', {
                                    style:{
                                        color:'#9AA7C1FF',
                                        fontSize: '14px',
                                        // 最后添加的div不添加border
                                        borderBottom: q == params.row.roomNum.length - 1 ? '' : '5px solid #fff',
                                    }
                                }, params.row.roomNum[q]),
                            )
                        }
                        // 没有子订单不加border
                        let borderStyle = ''
                        let borderLeft = ''
                        if(params.row.roomNum.length > 1){
                            borderStyle = '5px solid #fff'
                            borderLeft = params.row.checkInOut.length > 1 ? '5px solid #fff' : 'none'
                        }else{
                            borderStyle = ''
                        }
                        return h('div',{
                            style:{
                                borderLeft:borderStyle,
                            }
                        }, arr)
                        // return this.cellColor(h, params, 'roomNum') params.row.roomNum
                    }
                },
                {
                    title: '住离日期',
                    key: 'checkInOut',
                    align: 'center',
                    width:200,
                    className: 'demo-table-info-column',
                    render: (h, params) => {
                        // console.log(148, params)
                        //分开显示表头和内容 文本颜色
                        // 当有子订单的时候聚合
                        let arr = []
                        for(let q = 0;q < params.row.checkInOut.length;q++){
                            arr.push(
                                h('div', {
                                    style:{
                                        color:'#9AA7C1FF',
                                        fontsize:'14px',
                                        // 最后添加的div不添加border
                                        borderBottom: q == params.row.checkInOut.length - 1 ? '' : '5px solid #fff',
                                        
                                    }
                                }, params.row.checkInOut[q]),
                            )
                        }
                        // // 没有子订单不加border
                        let borderStyle = ''
                        if(params.row.checkInOut.length > 1){
                            borderStyle = '5px solid #fff'
                        }else{
                            borderStyle = ''
                        }
                        return h('div',{
                            style:{
                                borderRight:borderStyle,

                            }
                        }, arr)
                    }
                },
                {
                    title: '联系人',
                    key: 'linkManName',
                    align: 'center',
                    // width:115,
                    className: 'demo-table-info-column',
                    render: (h, params) => {
                        //分开显示表头和内容 文本颜色
                        return this.cellColor(h, params, 'linkManName')
                    }
                },
                {
                    title: '联系方式',
                    key: 'contactWay',
                    align: 'center',
                    width:150,
                    className: 'demo-table-info-column',
                    render: (h, params) => {
                        //分开显示表头和内容 文本颜色
                        return this.cellColor(h, params, 'contactWay')
                    }
                },
                {
                    title: '支付方式',
                    key: 'payWayName',
                    align: 'center',
                    // width:120,
                    className: 'demo-table-info-column',
                    render: (h, params) => {
                        //分开显示表头和内容 文本颜色
                        return this.cellColor(h, params, 'payWayName')
                    }
                },
                {
                    title: '收支项目',
                    key: 'payItemName',
                    align: 'center',
                    width:120,
                    className: 'demo-table-info-column',
                    render: (h, params) => {
                        //分开显示表头和内容 文本颜色
                        return this.cellColor(h, params, 'payItemName')
                    }
                },
                {
                    title: '金额',
                    key: 'sumMoney',
                    align: 'center',
                    width:150,
                    className: 'demo-table-info-column',
                    render: (h, params) => {
                        // 区分正负值颜色
                        return h('div', [
                            h('span', {
                                style:{
                                    color: '#86C1E0',
                                }
                            },`￥${params.row['sumMoney']}`),
                        ])
                    }
                },
                {
                    title: '订单明细',
                    key: 'orderDetail',
                    // fixed:'right',
                    align: 'center',
                    width:100,
                    className: 'demo-table-info-column',
                    render: (h, params) => {
                        // 点击获取订单详情
                        return this.clickOrderDetail(h, params, 'orderDetail')
                    }
                },
            ],
      }
    },
    watch: {
        timeStamps: {
            handler (val, oldVal) {
                if (val != oldVal) {
                    this.model1 = []
                    this.model2 = []
                    this.model3 = []
                }
            }
        },
        financialDetail: {
            handler (val, oldVal) {
                if (!val.lists.length) {
                    this.showNoData()
                }
            }
        },
        // timeStamps(val, oldVal) {
        //     console.log(555555555555555,this.orderFromList)
        //     if (val != oldVal) {
        //         this.channelFunc(this.orderFromList)
        //     }
        // },
        // timeStampsMonth(val, oldVal) {
        //     if (val != oldVal) {
        //         this.channelFunc(this.orderFromList)
        //     }
        //     console.log(555555555555555)
        // },
        // orderFromList(val, oldVal) {
        //    this.channelFunc(val)
        // }
    },
    computed: {
        ...mapState(['curDateType']),
        ...mapGetters([
            'timeStamps', 'timeStampsMonth', 'orderFromList', 'orderPaymentTypeList',
            'orderPaymentList', 'financialDetail', 'channelArr'
        ]), // xx 订单支付类型(收支项目) 订单支付方式
    },
    mounted () {
    },
    methods: {
        ...mapActions(['getFinancailDetail']),
        // 每个tableCell 自定义css 和点击事件
        clickOrderDetail(h, params, cur) {
            var _this = this
            return  h('div', [
                h('span', {
                    style: {
                        textDecoration: 'underline',
                        color: '#1F5B8F',
                        fontSize: '14px',
                        cursor: 'pointer'
                    },
                    on: {
                        click: () => {
                            this.modalType = 'look'
                            this.getOrderInfo(params)
                        }
                    }
                }, '订单详情')
            ])
        },
        
        // 根据翻页请求数据
        curPageNum (page) {
            let obj = {
                pageNum: page,
                pageSize: this.pageSize,
                queryType: this.curDateType,
                startDate: this.curDateType == 1 ? formatDate(this.timeStamps[0]) : this.timeStampsMonth[0], 
                endDate: this.curDateType == 1 ? formatDate(this.timeStamps[1]) : this.timeStampsMonth[1],
            }
            if (this.model1.length > 0) {
                obj.channelIds = this.model1
            }
            if (this.model2.length > 0) {
                obj.itemsIds = this.model2
            }
            if (this.model3.length > 0) {
                obj.paywayIds = this.model3
            }
            this.getFinancailDetail(obj)

        },
        initPage () {
            this.$refs.child.initCurPage()
        },
        // 渠道切换
        changeOrderFromList (val) {
            if (this.model1.length > 0) {
                this.model1 = val
                this.model2 = []
                this.model3 = []
            } 
            this.pageNum = 1
            this.initPage()
        },

        // 收支项目切换
        changeOrderPaymentTypeList (val) { 
            if (this.model2.length > 0) {
                this.model1 = []
                this.model2 = val
                this.model3 = []
            } 
            this.pageNum = 1
            this.initPage()
        },
        // 支付方式切换
        changeOrderPaymentList (val) {
            if (this.model3.length > 0) {
                this.model1 = []
                this.model2 = []
                this.model3 = val
            }
            this.pageNum = 1 
            this.initPage()
        },
        changeMonth (val) {
            this.monthVal = val
            this.open = false
        },
        // 导出报表
        outputExcel() { 
            var date = new Date()
            var year = this.monthVal.slice(0,4)
            var curMonth = date.getMonth() + 1
            var tempMonth =  this.monthVal.slice(5, 7)
            var monthArr = switchMonthToDay(tempMonth, year)
            
            var data = {}
            if (this.curDateType == '1') {
                if (this.model1.length > 0) {
                    data.channelIds = this.model1
                }
                if (this.model2.length > 0) {
                    data.itemsIds = this.model2
                }
                if (this.model3.length > 0) {
                    data.paywayIds = this.model3
                }
                data.startDate = formatDate(this.timeStamps[0])
                data.endDate = formatDate(this.timeStamps[1])
                this.showMonthPicker = false
                financeApiService.exportOrderFinancailDetail(data).then(result => {
                    if(result){
                        fileDownload(result, '收支明细详情表_' + data.startDate + '-' + data.endDate + '.csv')
                    }else{
                        this.$Message.error('暂无数据');
                    }
                })
            } else if(this.curDateType == '2'){
                this.open = true
                if (this.monthVal != '') {
                    data = {
                        startDate: `${year}-${monthArr[0]}`,
                    }
                    if (curMonth == tempMonth) {
                        data.endDate = `${year}-${tempMonth}-${date.getDate()}`
                    } else {
                        data.endDate = `${year}-${monthArr[1]}`
                    }
                    if (this.model1.length > 0) {
                        data.channelIds = this.model1
                    }
                    if (this.model2.length > 0) {
                        data.itemsIds = this.model2
                    }
                    if (this.model3.length > 0) {
                        data.paywayIds = this.model3
                    }
                    // 成功导出月流水后 清空已选日期让重新选择后才能再次导出   this.showMonthPicker true
                    financeApiService.exportOrderFinancailDetail(data).then(result => {
                        if(result){
                            fileDownload(result,data.startDate + '-' + data.endDate + '.csv')
                            this.open = false
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
        // 获取订单详情
        getOrderInfo (params) {
            let id = params.row.orderId
			let orderFromList = this.$store.state.orderFromList

            // let id = 2f785
            financeApiService.byIdGetOrderInfoServic(id).then(result => {
                if (!(result.hasOwnProperty('code'))) {
                    this.$Message.error(result.message);
                    return
                }
                if(result.code == '000000'){
                    if(result.content){
                        this.mainOrderData = mainOrderDataProcess(result.content,orderFromList)
                        this.modal = true
                    }else{
                        this.$Message.error('查询订单错误');
                    }
                }else{
                    this.$Message.error(result.message);
                }
            })
        },
        // 修改订单
        handlerSwitch () {
            this.modalType = 'Updatefinance'
        },
        // 更新订单
        handlerUpdate () {
            let data = this.mainOrderData

            let userId =getCookie('userId')
            for(let q = 0;q < data.records.length;q++){
                data.records[q].priceView = Number(data.records[q].priceView)
                data.records[q].price = data.records[q].priceView * 100
            }
            data.userId = userId
            data.type = 4

            financeApiService.updateOrderInfoServic(data).then(result => {
                if (!(result.hasOwnProperty('code'))) {
                    this.$Message.error(result.message);
                    return
                }
                if(result.code == '000000'){
                    this.$Message.success('更新成功！');
                    this.modalType = 'look'
                }else{
                    this.$Message.error(result.message);
                }
            })
        },
            //每个表格颜色
        cellColor(h,params,cur){
            var _this = this
            return  h('div', [
                h('span', {
                    style: {
                        color: '#9AA7C1',
                        fontSize: '14px',
                    },
                }, params.row[cur])
            ])
        },
        showNoData () {
            let emptyBody = document.getElementById('payWaysID').getElementsByClassName('ivu-table-tip')[0];
            emptyBody.innerHTML = '<div class="not-data"><div class="nodata-text">暂无数据 <br/> ...</div></div></div>'
        },
    }
}
</script>
<style>

.financial-detail .ivu-select-multiple .ivu-select-selection .ivu-select-placeholder {
    color: #9AA7C1;
    font-size: 14px;
}
.financial-detail  .ivu-table-cell {
    padding-left: 0;
    padding-right: 0;
}
/*.financial-detail  .ivu-table-cell tbody  {
    font-size: 14px;
}*/
.financial-detail .financial-wrap .ivu-select-selection {
    border:1px solid #235F92;
    border-radius: 8px;
    height: 30px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
/*导出报表*/
.financial-detail .output {
    text-align: right;
    font-size: 14px;
    color: #9AA7C1;
    line-height: 42px;
    border-radius: 20px;
    padding: 7px 26px;
    border: 1px solid #9AA7C1;
    cursor: pointer;
    margin: auto auto 6px 0px;
}
.financial-detail  .financial-wrap .ivu-input {
    border: 0;
}
.financial-detail .ivu-poptip-body {
    padding: 0;
}
.operate-time-color {
    color:#9AA7C1;
    font:  16px/30px 'STHeitiTC';
}
.demo-table-info-column {
    color: #215D91;
    font:  16px/30px 'STHeitiTC'; /*STHeitiTC*/
}
.financial-detail tr>td:first-child.for-left-border  { /* operate-time-color */
    border-left: 2px solid #215D91;
}
.financial-detail th.for-left-border{
    border-left: 2px solid #fff;
}

.financial-detail  table {
    border-collapse: collapse;
}
.financial-detail .ivu-table-fixed, .ivu-table-fixed-right {
    -webkit-box-shadow: 2px 0 6px -2px rgba(0,0,0,0); 
    box-shadow: 2px 0 6px -2px rgba(0,0,0,0); 
}
 /*滚动条样式*/
.financial-detail .ivu-table-overflowX::-webkit-scrollbar {/*滚动条整体样式*/
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 10px;

}
.financial-detail .ivu-table-overflowX::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #fafafa;
}
.financial-detail .ivu-table-overflowX::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 10px;
    background: rgba(0,0,0,0.1);
}

/*滚动条样式*/
.financial-detail .ivu-select-dropdown::-webkit-scrollbar {/*滚动条整体样式*/
    width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
    /*height: 10px;*/

}
.financial-detail .ivu-select-dropdown::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.1);
}
.financial-detail .ivu-select-dropdown::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 6px;
    background: #fafafa;
}
</style>