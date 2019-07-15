<!--收支流水支付方式详情-->
<template>
    <div class="myself-model">
        <div class="clearfix my-contant">
            <div class="f-l">
                <span class="f-l-icon">
                    <img class="img-icon" :src="imgUrl" alt="">
                </span>
                {{curWhere}}
                <span class="f-date">{{curDate}}</span>
            </div>
            <div class="f-r">
                <Select @on-change="changeOrderFromList" multiple v-model="model1" style="width:200px;" placeholder="渠道来源：">
                    <Option multiple v-for="item in channelArr" :value="item.id" :key="item.id">{{ item.channelName }}
                    </Option>
                </Select>
                <Select multiple @on-change="changeOrderPaymentTypeList" v-model="model2" style="width:200px;margin-left: 18px"
                        placeholder="收支项目：">
                    <Option v-for="item in orderPaymentTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <span @click="outputExcel" class="output">导出报表</span>
            </div>
        </div>
        <div class="contant">
            <WtDataTable  :dataContent="financialPayWayDetail.lists" :cols="cols"
                          :height="height"    ></WtDataTable>
            
            <TPage ref='child' @click='initPage' v-show="financialPayWayDetail.total > 20" :total="financialPayWayDetail.total"   @curPage="curPageNum"></TPage>
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
    import { financeApiService } from '../../../api/API'
    import { newOrderData, mainOrderDataProcess,getCookie } from '../../../../../common_libs/util'
    import { mapState, mapActions, mapGetters } from "vuex"
    import util from '../../../../../common_libs/util.js'


    import SplitTable from './vue-split-table/index.js'
    import WtDataTable from '../shareComponents/tabale.vue'
    import TPage from '../shareComponents/tPage.vue'
    import AppModal from '../../../../../common_components/AppModal/'
    import LookOrderDetail from '../../../../../common_components/OrderDetails/Lookfinance/'
    import UpdateOrderDetail from '../../../../../common_components/OrderDetails/Updatefinance/'

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

    export default {
        data () {
            return {
                mainOrderData: mainOrderDataProcess(newOrderData,[]),
                modalType: 'look',
                modal:false,
                pageSize: 20,
                queryType: 1,
                height: 80,
                curWhere: '',
                curDate: '',
                payWayId: null,
                imgUrl:'',
                model1: [],
                model2: [],
                requstDate: [],
                cols:[
                    {
                        title: '操作时间',
                        key: 'createTime',
                        align: 'center',
                        width: 180,
                        // fixed: 'left',
                        className: 'operate-time-color for-left-border',
                        render: (h, params) => {
                        //分开显示表头和内容 文本颜色
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
                            // return  h('div', [
                            //     h('div', {
                            //         style: {
                            //             color: '#9AA7C1',
                            //             fontSize: '14px',
                            //             with:'100%',
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
                        width:220,
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
                                            fontSize: '14px',
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
                            // return this.cellColor(h, params, 'checkInOut') params.row.checkInOut
                        }
                    },
                    {
                        title: '联系人',
                        key: 'linkManName',
                        align: 'center',
                        className: 'demo-table-info-column',
                        render: (h, params) => {
                            //分开显示表头和内容 文本颜色
                            return this.cellColor(h, params, 'linkManName')
                        }
                    },
                    {
                        title: '联系方式',
                        key: 'contactWay',
                        width:180,
                        align: 'center',
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
        computed: {
            ...mapState(['curDateType']),  
            ...mapGetters(['orderFromList', 'orderPaymentTypeList', 'financialPayWayDetail', 'channelArr']),
            // orderFromList (state, getters) {
            //     console.log(298, state.paywayId, getters)
            // }
        },
        watch: {
            orderFromList (val) {
            // 有订单的自定义渠道获取。
                let channelParam = {
                    startDate: this.requstDate[0],
                    endDate: this.requstDate[1],
                    channelIds: val,
                    paywayIds: this.$route.query.payWayId,
                }
                let channelObj = {
                    data: channelParam,
                    payWay: true
                }
                this.setChannelIds(channelObj)
            }
        },
        components: {
            WtDataTable,
            TPage,
            UpdateOrderDetail,
            LookOrderDetail,
            AppModal
        },
        mounted () {
            //初始化页面数据
            console.log(301)
            var params = this.$route.query
            this.curWhere =  params.title
            this.imgUrl = this.urlFunc (params.title)
            this.queryType = params.queryType
            // console.log(289,params )
            if (params.title == '总计') {
                if (params.queryType == 1) {
                    this.curDate = params.date
                    this.requstDate[0] = params.date
                    this.requstDate[1] = params.date
                } else {
                    this.curDate = params.date[0].slice(0, 7)
                    this.requstDate[0] = params.date[0]
                    this.requstDate[1] = params.date[1]
                }
                let obj = {
                    data: {
                        pageNum: 1, 
                        pageSize: this.pageSize, 
                        queryType: this.queryType, 
                        startDate: this.requstDate[0], 
                        endDate: this.requstDate[1],
                    },
                    detailType: true,
                }
                this.getFinancailDetail(obj)
            } else {
                this.payWayId = params.payWayId
                if (params.queryType == 1) {
                    this.curDate =  params.date
                    this.requstDate[0] = params.date.slice(0, 10)
                    this.requstDate[1] = params.date.slice(0, 10)
                } else {
                    this.curDate =  params.date.slice(5)
                    this.requstDate[0] = params.dateArr[0]
                    this.requstDate[1] = params.dateArr[1]
                }
                let obj = {
                    data: {
                        pageNum: 1, 
                        pageSize: this.pageSize, 
                        queryType: this.queryType, //queryType
                        startDate: this.requstDate[0], 
                        endDate: this.requstDate[1],
                        paywayIds: [params.payWayId],
                    },
                    detailType: true,
                }
                this.getFinancailDetail(obj)
            }
        },
        methods: {
            ...mapActions(['getFinancailDetail', 'setChannelIds']),
            // 根据翻页请求数据
            curPageNum (page) {
                let tempData  = {
                    pageNum: page, 
                    pageSize: this.pageSize, 
                    queryType: this.queryType,
                    startDate: this.requstDate[0], 
                    endDate: this.requstDate[1],
                }
                if (this.model1.length > 0) {
                    tempData.channelIds = this.model1
                }
                if (this.model2.length > 0) {
                    tempData.itemsIds = this.model2
                }
                if (this.curWhere != '总计') {
                    tempData.paywayIds = [this.payWayId]
                } 
                let tempObj = {
                    detailType: true,
                    data: tempData
                }
                console.log('change initPage', tempObj)
                this.getFinancailDetail(tempObj)
            },
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
                                // console.log('当前订单详情点击',cur)
                            }
                        }
                    }, '订单详情')
                ])
            },
            // showNoData () {
            //     let emptyBody = document.getElementById('payWaysD').getElementsByClassName('ivu-table-tip')[0];
            //     emptyBody.innerHTML = '<div class="not-data"><div class="nodata-text">暂无数据 <br/> ...</div></div></div>'
            // },
            // 详情icon
            urlFunc (cur) {
                switch (cur) {
                    case '现金' : return xianjin;
                    case '支付宝' : return zhifubao;
                    case '微信' : return weixin;
                    case '银联' : return yinlian;
                    case '去哪儿代收' : return qne;
                    case '美团代收' : return meituan;
                    case '携程代收' : return xiecheng;
                    case '艺龙代收' : return yl;
                    case '飞猪代收' : return feizhu;
                    case '其他' : return qita;
                    default : return false
                }
            },
            initPage () {
                this.$refs.child.initCurPage()
            },
            // 渠道切换
            changeOrderFromList (val) {
                if (this.model1.length > 0) {
                    this.model1 = val
                    this.model2 = []
                } 
                this.initPage()
            },
            // 收支切换
            changeOrderPaymentTypeList (val) {
                if (this.model2.length > 0) {
                    this.model1 = []
                    this.model2 = val
                } 
                this.initPage()
            },
            // 导出
            outputExcel() {
                var data = {
                    startDate: this.curDate,
                    endDate: this.curDate,
                }
                if (this.curWhere != '总计') {
                    data.paywayIds = [this.payWayId]
                }
                if (this.model1.length > 0) {
                    data.channelIds = this.model1
                }
                if (this.model2.length > 0) {
                    data.itemsIds = this.model2
                }

                financeApiService.exportOrderFinancailDetail(data).then(result => {
                    if(result){
                        fileDownload(result,'收支明细详情表_' + data.startDate + '-' + data.endDate + '.csv')
                    }else{
                        this.$Message.error('暂无数据');
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
            // 获取订单详情
            getOrderInfo (params) {
                let id = params.row.orderId
			    let orderFromList = this.$store.state.orderFromList

                // let id = 2785
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
        }
    }
</script>
<style >
    .myself-model {
        background:#f7f7f7;
        padding: 20px;
    }
    .myself-model .not-data {
        position: relative;
        text-align: center;
        width: 100%;
        color: #999;
        font-size: 14px;
        background: url("../../../assets/分组 11.png") no-repeat center center;
    }
    .myself-model .nodata-text {
        position: absolute;
        left: 48%;
        bottom: 10px;
    }
    .my-contant {
        margin-bottom: 5px;
    }
    .myself-model .contant{
        padding: 0 20px 20px;
        margin-bottom: 5px;
        background: #fff;
        box-shadow:0px 1px 15px 0px rgba(231,240,245,0.5);
        border-radius:10px;
    }
    /*有和无滚动条表格padding设置*/
    /*.myself-model .in-scroll-p {
        padding: 0 0 0 18px;
    }
    .myself-model .no-scroll-p {
        padding: 0 18px;
    }*/
    .myself-model .ivu-table-cell {
        padding-left: 0;
        padding-right: 0;
    }
    .myself-model .ivu-modal-body {
        border-radius: 8px;
    }
    .myself-model .ivu-modal-body {
        background: #fafafa;
    }
    .myself-model .ivu-modal{
        top: 0;
    }
    .myself-model .my-contant .ivu-select-selection {
        border:1px solid #235F92;
        border-radius: 8px;
        height: 30px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .operate-time-color {
        color:#215D91;
        font:  16px/30px 'STHeitiTC'
    }
    .demo-table-info-column {
        color: #215D91;
        font:  16px/30px 'STHeitiTC'; /*STHeitiTC*/
    }
    .myself-model .ivu-select-multiple .ivu-select-selection .ivu-select-placeholder {
        color: #9AA7C1;
        font-size: 16px;
    }
    .myself-model .output {
        text-align: right;
        font-size: 16px;
        color: #9AA7C1;
        line-height: 42px;
        border-radius: 20px;
        padding: 7px 26px;
        border: 1px solid #9AA7C1;
        cursor: pointer;
        margin: auto auto 6px 18px;
    }
    .clearfix:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }
    .myself-model .f-l{
        float: left;
        color: #245E91;
        font-size: 16px;
    }
    .f-l-icon {
        width: 20px;
        height: 27px;
        line-height: 27px;
        display: inline-block;
    }
    .img-icon {
        vertical-align: middle;
    }
    .myself-model .f-date {
        font-size: 14px;
        margin-left: 5px;
    }
    .myself-model .f-r{
        float: right;
    }
    .myself-model tr>td:first-child.for-left-border {
        border-left: 2px solid #215D91;
    }
    .myself-model th.for-left-border{
        border-left: 2px solid #fff;
    }

    .myself-model  table {
        border-collapse: collapse;
    }
    .myself-model .ivu-table-fixed, .ivu-table-fixed-right {
        -webkit-box-shadow: 2px 0 6px -2px rgba(0,0,0,0); 
        box-shadow: 2px 0 6px -2px rgba(0,0,0,0); 
    }
    /*滚动条样式*/
    .myself-model .ivu-table-overflowX::-webkit-scrollbar {/*滚动条整体样式*/
        width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 10px;

    }
    .myself-model .ivu-table-overflowX::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: #fafafa;
    }
    .myself-model .ivu-table-overflowX::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 10px;
        background: rgba(0,0,0,0.1);
    }
        /*滚动条样式*/
    .myself-model .ivu-select-dropdown::-webkit-scrollbar {/*滚动条整体样式*/
        width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
        /*height: 10px;*/

    }
    .myself-model .ivu-select-dropdown::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: rgba(0,0,0,0.1);
    }
    .myself-model .ivu-select-dropdown::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 6px;
       background: #fafafa;
    }
</style>
