<!--收支流水/支付方式流水-->
<template>
    <div class="day-all-order">
        <p class="title">
            <span class="dateText">{{date}}</span>
            <span class="output" @click="exportData">导出报表</span>
        </p>
        <!-- 数据表格 -->
        <div class="wrap">
            <WtDataTable :cols="cols" :dataContent="channelOrderDetailListCon"  :width="0"></WtDataTable>
            <Page v-show="Number(total) > 20" :total="total" :current="tPage.pageNum" :page-size="20"
            placement="top" @on-change="curPageNum"
            prev-text="上一页" next-text="下一页" class="pageWrap"></Page>
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
    var fileDownload = require('js-file-download');
    import {mapState, mapActions} from "vuex"
    import WtDataTable from '../shareComponents/tabale.vue'
    import util from '../../../../../common_libs/util'
    import { financeApiService } from '../../../api/API'
    import { newOrderData,deepCopy,mainOrderDataProcess,getCookie } from 'common_libs/util'


    import UpdateOrderDetail from 'common_components/OrderDetails/Updatefinance/'
    import AppModal from 'common_components/AppModal/'
    import LookOrderDetail from 'common_components/OrderDetails/Lookfinance/'



    export default {
        components: {
            WtDataTable,
            UpdateOrderDetail,
            LookOrderDetail,
            AppModal
        },

        data(){
            return {
                newOrderData,
                mainOrderData: mainOrderDataProcess(newOrderData,[]),
                date:'',
                ids:[],
                cols:[
                    {
                        title: '渠道来源',
                        key: 'channelName',
                        align: 'center',
                        ellipsis: true,
                        className: 'demo-table-info-column for-left-border',
                        render: (h, params) => {
                            return h('div',  [
                                h('div', {
                                    style:{
                                        height: '100%',
                                        color:'#9AA7C1FF',
                                        width: '100%',
                                    }
                                }, params.row['channelName']),
                            ])
                        },
                    },
                    {
                        title: '订单号',
                        key: 'orderNo',
                        align: 'center',
                        className: 'demo-table-info-column',
                    },
                    {
                        title: '房间号',
                        key: 'roomNo',
                        align: 'center',
                        className: 'demo-table-info-column',
                        render: (h, params) => {
                            // 当有子订单的时候聚合
                            let arr = []
                            for(let q = 0;q < params.row.roomDetails.length;q++){
                                arr.push(
                                    h('div', {
                                        style:{
                                            color:'#9AA7C1FF',
                                            // 最后添加的div不添加border
                                            borderBottom: q == params.row.roomDetails.length - 1 ? '' : '5px solid #fff'
                                        }
                                    }, params.row.roomDetails[q].roomNum),
                                )
                            }
                            // 没有子订单不加border
                            let borderStyle = ''
                            if(params.row.roomDetails.length > 1){
                                borderStyle = '5px solid #fff'
                            }else{
                                borderStyle = ''
                            }
                            return h('div',{
                                style:{
                                    borderLeft:borderStyle,
                                }
                            },arr)
                        },
                    },
                    {
                        title: '住离时间',
                        key: 'allDate',
                        width: 400,
                        align: 'center',
                        className: 'demo-table-info-column',
                        render: (h, params) => {
                            // 当有子订单的时候聚合
                            let arr = []
                            for(let q = 0;q < params.row.roomDetails.length;q++){
                                arr.push(
                                    h('div', {
                                        style:{
                                            color:'#9AA7C1FF',
                                            // 最后添加的div不添加border
                                            borderBottom: q == params.row.roomDetails.length - 1 ? '' : '5px solid #fff'
                                        }
                                    }, params.row.roomDetails[q].allDate),
                                )
                            }
                            // 没有子订单不加border
                            let borderStyle = ''
                            if(params.row.roomDetails.length > 1){
                                borderStyle = '5px solid #fff'
                            }else{
                                borderStyle = ''
                            }
                            return h('div',{
                                style:{
                                    borderRight:borderStyle,
                                }
                            },arr)
                        },
                    },
                    {
                        title: '联系人',
                        key: 'contactName',
                        align: 'center',
                        className: 'demo-table-info-column',
                    },
                    {
                        title: '应收房费',
                        key: 'oughtAmount',
                        align: 'center',
                        className: 'demo-table-info-column getRoomMon',
                        render: (h, params) => {
                            return h('div',  [
                                h('div', {
                                    style:{
                                        
                                    }
                                },"￥" + util.toDecimal2(Number(params.row['oughtAmount']))),
                            ])
                        },
                    },
                    {
                        title: '订单详情',
                        key: 'checkOrderInfo',
                        align: 'center',
                        className: 'demo-table-info-column',
                        render: (h, params) => {
                            // 点击获取订单详情
                            return this.clickOrderInfo(h, params, 'checkOrderInfo')
                        }
                    },
                ],
                tPage: {
                    pageNum: 1,
                    pageSize: 20,
                    pageTotal: 0,
                    initPage: 1
                },
                modal:false,
                modalType:'look',
                queryType: 1
            }
        },
        computed: {
            // 渠道订单详情数据
            channelOrderDetailListCon () {
                let data = JSON.parse(JSON.stringify(this.$store.getters.channelOrderDetailList.datas))
                for(let q = 0;q < data.length;q++){
                    data[q].oughtAmount = Number(data[q].oughtAmount) / 100
                }
                return data
            },
            total () {
                return this.$store.getters.channelOrderDetailList.total
            }
        },
        created () {
            let query = this.$route.query
            this.date = query.date
            this.ids = JSON.parse(query.ids)
            this.queryType = JSON.parse(query.queryType)

            // let obj = {
            //     startDate: '2018-12-01',
            //     endDate: '2018-12-12',
            //     queryType: 1,
            //     channelId: this.ids,
            //     pageSize: 20,
            //     pageNum: 1
            // }
            let obj = {
                startDate: this.date,
                endDate: this.date,
                queryType: this.queryType,
                channelId: this.ids,
                pageSize: 20,
                pageNum: 1
            }
            this.getOrderList(obj)
        },
        mounted () {

        },
        methods: {
            ...mapActions(['getChannelOrderDetailList']),
            getOrderList(obj) {
                if(obj.channelId.length == 0){
                    delete obj.channelId
                }
                if(obj.startDate && obj.endDate){
                    this.getChannelOrderDetailList(obj)          
                }else{
                    console.log('日期错误:',obj)
                }
            },
            // 点击查看订单
            clickOrderInfo (h, params, cur) {
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
                    }, '查看订单')
                ])
            },

            // 获取订单详情
            getOrderInfo (params) {
                let id = params.row.orderId
			    let orderFromList = this.$store.state.orderFromList

                // let id = 2787
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

            // 根据翻页请求数据
            curPageNum (page) {
                // let obj = {
                //     startDate: '2018-12-01',
                //     endDate: '2018-12-12',
                //     queryType: 1,
                //     channelId: this.ids,
                //     pageSize: 20,
                //     pageNum: page
                // }
                let obj = {
                    startDate: this.date,
                    endDate: this.date,
                    queryType: this.queryType,
                    channelId: this.ids,
                    pageSize: 20,
                    pageNum: page
                }
                this.getOrderList(obj)
            },
            // 导出报表
            exportData() {
                let data = {
                    startDate: this.date,
                    endDate: this.date,
                    queryType: 1,
                    channelId : this.ids
                }
                if(data.channelId.length == 0){
                    delete data.channelId
                }
                financeApiService.exportOrderListServic(data).then(result => {
                    if(result){
                        fileDownload(result,'渠道订单明细表_' + data.startDate + '.csv')
                    }
                })
            }
        },
        watch:{
            channelOrderDetailListCon: {
                handler (data) {
                    if(data.length == 0){
                        let emptyBody = document.querySelector(".day-all-order .tab-share .ivu-table-tip")
                        emptyBody.innerHTML = '<div class="not-data"><div class="nodata-text">暂无数据<br/> ...</div></div>'
                    }
                },
                deep: true
            }
        }
    }
</script>

<style lang="scss" >
    .day-all-order{
        padding: 20px 20px 98px 20px;
        .title{
            .dateText{
                margin-left: 20px;
                color: #245E91FF;
                font-size: 18px;
            }
            .output {
                float: right;
                font-size: 14px;
                color: #9AA7C1;
                border-radius: 20px;
                padding: 3px 30px;
                border: 1px solid #9AA7C1;
                cursor: pointer;
            }
        }
        .wrap{
            margin-top: 10px;
            padding:20px 0 20px 20px;
            background:#fff;
            table{
                border-collapse: collapse;
            }
            .for-left-border{
                border-left: 2px solid rgb(33, 93, 145)
            }
            .ivu-table-header tr .for-left-border{
                border-left: none
            }
            .ivu-table-cell{
                padding-left: 0;
                padding-right: 0;
            }
            .demo-table-info-column {
                color: #215D91FF;
                font:  16px/50px 'STHeitiTC'; /*STHeitiTC*/
            }
           
            .ivu-table-body{
                .demo-table-info-column {
                    color: #9AA7C1FF;
                    font:  14px/50px 'STHeitiTC'; /*STHeitiTC*/
                }
                .getRoomMon{
                    color: #6BB4DAFF 
                }
            }
            
            .ivu-table-row {
                line-height: 50px;
                /*background-color: #fafafa;*/
                margin-bottom: 10px;
                color: #85C1E0;
                font-size: 18px;
                font-family: 'MicrosoftYaHei';
            }
            .pageWrap{
                text-align: center;
                margin-top: 20px;
            }
        }
    }
</style>

