<!--渠道订单明细-->
<template>
    <div class="order-info">
        <!-- 渠道总应收显示 -->
        <p class="show-data-wrap">
            <span class="left">渠道订单明细</span>
            <span class="right">共{{total}}个订单，应收房费 <span>￥{{totalAmount ? totalAmount : 0}}</span></span>
        </p>
        <div class="channel-list">
            <div class="allChannelWrap">
                <div class="channel-item-body">
                    <div class="channel-item" @click="allChannel = true">
                        <span class="item-icon">
                            <Icon v-show="allChannel" type="md-checkbox" />
                            <Icon v-show="!allChannel" type="md-square-outline" />
                        </span>
                        <span></span>
                        <span class="channel-item-text">全部渠道</span>
                    </div>
                </div>
            </div>
            <div class="channel-item-wrap">
                <div>
                    <p class="default-des" @click="openDefault = !openDefault">
                        默认渠道
                        <Icon type="ios-arrow-up rotate" style="margin-bottom:2px" :class="[openDefault?'rotate':'rotateDown']"/>
                    </p>
                    <div class="channel-item-body" v-show="openDefault">
                        <div class="channel-item" :title="item.channelName" v-for="(item,index) in orderFromListData" :key="item.itemText" @click="chooseType(item.id,index,item.value)">
                            <span class="item-icon">
                                <Icon v-show="item.value == 0" type="md-square-outline" />
                                <Icon v-show="item.value == 1" type="md-checkbox" />
                            </span>
                            <span>
                                <img :src="item.src" alt="" v-show="item.src">
                                <span class="myChannelIcon"  v-show="!item.src">
                                    {{ item.channelName ? item.channelName.slice(0, 1):'' }}
                                </span>
                            </span>
                            <span class="channel-item-text">{{item.channelName}}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <p class="default-des"  @click="openMyChan = !openMyChan">
                        自定义渠道
                        <Icon type="ios-arrow-up rotate" style="margin-bottom:2px" :class="[openMyChan?'rotate':'rotateDown']"/>
                    </p>
                    <div class="channel-item-body" v-show="openMyChan">
                        <div class="channel-item" v-for="(item,index) in myOrderFromListData" :key="item.itemText" @click="chooseMyType(item.id,index,item.value)">
                            <span class="item-icon">
                                <Icon v-show="item.value == 0" type="md-square-outline" />
                                <Icon v-show="item.value == 1" type="md-checkbox" />
                            </span>
                            <span>
                                <span class="myChannelIcon">
                                    {{ item.channelName ? item.channelName.slice(0, 1):'' }}
                                </span>
                            </span>
                            <span class="channel-item-text">{{item.channelName}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <p class="top-table-title">
                <span class="output" @click="exportData">导出报表</span>    
            </p>
            
            <!-- 数据表格 -->
            <div class="wrap">
                <WtDataTable :cols="cols" :dataContent="channelOrderDetailListCon"></WtDataTable>
                <Page v-show="Number(total) > 20" :total="total" :current="tPage.pageNum" :page-size="20" 
                placement="top" @on-change="curPageNum"
                prev-text="上一页" next-text="下一页" class="pageWrap"></Page>
            </div>
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
    import util, {
        formatDate
    } from '../../../../../common_libs/util'

    // 渠道icon
    import xiecheng from '../../../assets/xiecheng.png'
    import xianjin from '../../../assets/xianjin.png'
    import zhifubao from '../../../assets/zhifubao.png'
    import weixin from '../../../assets/weixin.png'
    import yinlian from '../../../assets/yinlian.png'
    import qne from '../../../assets/qne.png'
    import meituan from '../../../assets/meituan.png'
    import yl from '../../../assets/yl.png'
    import feizhu from '../../../assets/feizhu.png'
    import qita from '../../../assets/qita.png'
    import bk from '../../../assets/bk.png'
    import tc from '../../../assets/tc.png'
    import lvmm from '../../../assets/lvmm.png'
    import mfw from '../../../assets/mfw.png'
    import tuniu from '../../../assets/tuniu.png'
    import tujia from '../../../assets/tujia.png'
    import yiqiyou from '../../../assets/yiqiyou.png'
    import airbnb from '../../../assets/airbnb.png'
    import xzdz from '../../../assets/xzdz.png'
    import agoda from '../../../assets/agoda.png'


    import { newOrderData,deepCopy,mainOrderDataProcess,getCookie } from 'common_libs/util'
    import UpdateOrderDetail from 'common_components/OrderDetails/Updatefinance/'
    import AppModal from 'common_components/AppModal/'
    import LookOrderDetail from 'common_components/OrderDetails/Lookfinance/'

    import { financeApiService } from '../../../api/API'
    export default {
        name: 'orderInfo',
        components:{
            WtDataTable,
            UpdateOrderDetail,
            LookOrderDetail,
            AppModal
        },
        computed: {
            // 渠道列表
            orderFromList () {
                let data = JSON.parse(JSON.stringify(this.$store.getters.orderFromList))
                return data
            },
            // 渠道订单详情数据
            channelOrderDetailListCon () {
                let data = JSON.parse(JSON.stringify(this.$store.getters.channelOrderDetailList.datas))
                for(let q = 0;q < data.length;q++){
                    data[q].oughtAmount = Number(data[q].oughtAmount) / 100
                }
                return data
            },
            // 选中的渠道id
            channelOrderInfoIds () {
                return this.$store.getters.channelOrderInfoIds
            },
            total () {
                return this.$store.getters.channelOrderDetailList.total
            }
        },
        data() {
            return {
                newOrderData,
                modal:false,
                modalType:'look',
                util,
                typeValue: '1',
                typeList: [
                    {
                        label: '按退房日期',
                        value: '1'
                    },
                    {
                        label: '按入住日期',
                        value: '2'
                    }
                ],
                totalAmount:0,
                mainOrderData: mainOrderDataProcess(newOrderData,[]),
                allChannel:true,
                openDefault: true,
                openMyChan: false,
                channelItemList:[],

                orderFromListData:[],
                myOrderFromListData:[],
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
                        width: 200,
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
                    pageSize: 5,
                    pageTotal: 0,
                    initPage: 1
                },
            }
        },
        mounted() {
            // this.getOrderFromList()
        },
        methods: {
            ...mapActions(['setChannelOrderInfoIds']),
            // 获取渠道列表
            getOrderFromList () {
                let data = JSON.parse(JSON.stringify(this.$store.getters.orderFromList))
                this.commonTurn(data)
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
                this.tPage.pageNum = page
                this.$parent.getChannelOrderDetailListData()
            },

            // 选中默认渠道
            chooseType(id,index,value) {
                this.tPage.pageNum = 1
                if(value == 0){
                    this.orderFromListData[index].value = 1
                    let storeData = {
                        id : id,
                        type : 1
                    }
                    this.setChannelOrderInfoIds(storeData)
                }else{
                    this.orderFromListData[index].value = 0
                    let storeData = {
                        id : id,
                        type : 2
                    }
                    this.setChannelOrderInfoIds(storeData)
                }

                this.$parent.getDetailTotalAmountData()
                let flag = false
                for(let c = 0;c < this.orderFromListData.length;c++){
                    if(this.orderFromListData[c].value == 1){
                        flag = true
                    }
                }
                for(let c = 0;c < this.myOrderFromListData.length;c++){
                    if(this.myOrderFromListData[c].value == 1){
                        flag = true
                    }
                }
                if(flag){
                    this.allChannel = false
                }else{
                    this.allChannel = true
                }
            },

            // 选中自定义渠道
            chooseMyType(id,index,value) {
                this.tPage.pageNum = 1
                if(value == 0){
                    this.myOrderFromListData[index].value = 1
                    let storeData = {
                        id : id,
                        type : 1
                    }
                    this.setChannelOrderInfoIds(storeData)
                }else{
                    this.myOrderFromListData[index].value = 0
                    let storeData = {
                        id : id,
                        type : 2
                    }
                    this.setChannelOrderInfoIds(storeData)
                }

                this.$parent.getDetailTotalAmountData()
                let flag = false
                for(let c = 0;c < this.myOrderFromListData.length;c++){
                    if(this.myOrderFromListData[c].value == 1){
                        flag = true
                    }
                }
                for(let c = 0;c < this.orderFromListData.length;c++){
                    if(this.orderFromListData[c].value == 1){
                        flag = true
                    }
                }
                if(flag){
                    this.allChannel = false
                }else{
                    this.allChannel = true
                }
            },

            // 选中所有渠道
            chooseAllChannel() {
                this.allChannel = !this.allChannel
            },

            // 渠道列表  myOrderFromListData => 自定义渠道   orderFromListData => 默认渠道   myOrderFromArr => 判断删掉的渠道是否有订单，没有订单且删掉的渠道不显示
            commonTurn(data) {
                if(data.length > 0){
                    this.orderFromListData = []
                    this.myOrderFromListData = []
                    let myOrderFromArr = []
                    for(let q = 0;q < data.length;q++){
                        data[q].src = this.getChannelIcon(data[q].channelCode)
                        data[q].value = 0
                        if(data[q].channelType == 2){
                            // this.myOrderFromListData.push(data[q])
                            myOrderFromArr.push(data[q])
                        }else{
                            this.orderFromListData.push(data[q])
                        }
                    }
                    this.getMyChannelList(myOrderFromArr)
                }
            },

            // 过滤自定义渠道，判断删掉的渠道是否有订单，没有订单且删掉的渠道不显示
            getMyChannelList(myOrderFromArr) {
                let res
                let channelArr = []
                for(let q = 0;q < myOrderFromArr.length;q++){
                    channelArr.push(myOrderFromArr[q].id)
                }
                let obj = {
                    startDate: formatDate(this.$store.getters.timeStampsChannel[0]),
                    endDate: formatDate(this.$store.getters.timeStampsChannel[1]),
                    queryType: this.$store.getters.channeldate,
                    channelId: channelArr,
                }
                if(obj.channelId.length == 0){
                    this.myOrderFromListData = []
                }else{
                    financeApiService.getOrderCustomChannelServic(obj).then(result => {
                        if (!(result.hasOwnProperty('code'))) {
                            console.log('渠道订单详情自定义渠道获取失败')
                            this.$Message.error(result.message);
                            return
                        }
                        if(result.code == '000000'){
                            // 添加图标、添加选择框值、渠道id
                            for(let x = 0;x < result.content.length;x++){
                                result.content[x].src = this.getChannelIcon(result.content[x].channelCode)
                                result.content[x].value = 0
                                result.content[x].id = result.content[x].channelId
                            }
                            // result.content去掉未删除的渠道
                            for(let q = 0;q < myOrderFromArr.length;q++){
                                for(let z = 0;z < result.content.length;z++){
                                    if(myOrderFromArr[q].deleted == 0){
                                        if(myOrderFromArr[q].id == result.content[z].channelId){
                                            result.content.splice(z,1)
                                            z--
                                        }
                                    }
                                }
                            }
                            // myOrderFromArr去掉删除的渠道
                            for(let m = 0;m < myOrderFromArr.length;m++){
                                if(myOrderFromArr[m].deleted == 1){
                                    myOrderFromArr.splice(m,1)
                                    m--
                                }
                            }
                            // 连接result.content和myOrderFromArr，返回给myOrderFromListData
                            this.myOrderFromListData = myOrderFromArr.concat(result['content'])
                        }else{
                            console.log('渠道订单详情自定义渠道获取失败')
                            this.$Message.error(result.message);
                        }
                    })
                }
            },

            // 获取对应的渠道Icon
            getChannelIcon(channelCode) {
                let res = null
                switch(channelCode){
                    case '000001':
                        res = xiecheng;
                        break;
                    case '000002':
                        res = xiecheng;
                        break;
                    case '000003':
                        res = xiecheng;
                        break;
                    case '000011':
                        res = qne;
                        break;
                    case '000012':
                        res = qne;
                        break;
                    case '000021':
                        res = yl;
                        break;
                    case '000022':
                        res = yl;
                        break;
                    case '000031':
                        res = meituan;
                        break;
                    case '000041':
                        res = feizhu;
                        break;
                    case '000051':
                        res = bk;
                        break;
                    case '000061':
                        res = tc;
                        break;
                    case '000071':
                        res = lvmm;
                        break;
                    case '000081':
                        res = mfw;
                        break;
                    case '000091':
                        res = tuniu;
                        break;
                    case '000101':
                        res = tujia;
                        break;
                    case '000111':
                        res = yiqiyou;
                        break;
                    case '000121':
                        res = airbnb;
                        break;
                    case '000131':
                        res = xzdz;
                        break;
                    case '000141':
                        res = agoda;
                        break;
                }
                return res
            },

            // 导出报表
            exportData() {
                let data = {
                    startDate: formatDate(this.$store.getters.timeStampsChannel[0]),
                    endDate: formatDate(this.$store.getters.timeStampsChannel[1]),
                    queryType: this.$store.getters.channeldate,
                    channelId : this.channelOrderInfoIds
                }
                if(data.channelId.length == 0){
                    delete data.channelId
                }
                financeApiService.exportOrderListServic(data).then(result => {
                    if(result){
                        fileDownload(result,'渠道订单明细表_' + data.startDate + '-' + data.endDate + '.csv')
                    }
                })
            },
        },
        watch:{
            allChannel: {
                handler (val) {
                    if(val){
                        let storeData = {
                            type : 3
                        }
                        this.setChannelOrderInfoIds(storeData)
                        this.$parent.getDetailTotalAmountData()
                        for(let q = 0;q < this.orderFromListData.length;q++){
                            this.orderFromListData[q].value = 0
                        }
                        for(let q = 0;q < this.myOrderFromListData.length;q++){
                            this.myOrderFromListData[q].value = 0
                        }
                    }
                },
                deep: true
            },
            orderFromList: {
                handler (data) {
                    this.commonTurn(data)
                },
                deep: true
            },
            channelOrderDetailListCon: {
                handler (data) {
                    if(data.length == 0){
                        let emptyBody = document.querySelector(".order-info .tab-share .ivu-table-tip")
                        emptyBody.innerHTML = '<div class="not-data"><div class="nodata-text">暂无数据<br/> ...</div></div>'
                    }
                },
                deep: true
            }
        }
    }
</script>

<style lang="scss">
    .order-info{
        padding-top: 20px;
        .show-data-wrap{
            margin-top: 20px;
            .left{
                display:inline-block;
                width:160px;
                border-right:3px solid #225E91FF;
                font-size:16px;
                color:#2B6496FF;
                vertical-align:middle
            }
            .right{
                vertical-align:middle;
                font-size:14px;
                color:#9AA7C1FF;
                margin-left:14px;
                span{
                    color:#6BB4DAFF
                }
            }
        }
        .top-table-title{
            font-size: 14px;
            color: #9AA7C1FF;
            margin: 10px 0 10px 0;
            text-align: right;
            .top-table-title-left{
                float: left;
            }
            .output {
                font-size: 14px;
                color: #9AA7C1;
                border-radius: 20px;
                padding: 7px 30px;
                border: 1px solid #9AA7C1;
                cursor: pointer;
                user-select: none;
            }
        }
        .channel-list{
            overflow: hidden;
            .all-channel-des{
                text-align:right;
                p{
                    font-size: 20px
                }
            }

            .rotate{
                transition: all 0.5s; 
                transform:rotate(0deg);
            }
            .rotateDown{
                transition: all 0.5s; 
                transform:rotate(180deg);
            }

            .default-des{
                font-size: 16px;
                color:#97A7C4FF;
                cursor:pointer;
                display:inline-block;
                user-select: none;
            }
            .channel-item-body{
                margin-top: 10px;
                overflow: hidden;
                color: #97A7C4FF;
                .channel-item{
                    float: left;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    line-height: 24px;
                    width: 150px;
                    user-select: none;
                    margin-bottom: 10px;
                    margin-right:5px;
                    cursor: pointer;
                    span:nth-child(1){
                        color: #286094FF
                    }
                    span:nth-child(2){
                        font-size: 16px;
                         img{
                            width: 12px;
                            height: 12px;
                            margin:0 6px;
                            vertical-align: middle
                        }
                        .myChannelIcon{
                            display:inline-block;
                            width:16px;
                            height:16px;
                            font-size:12px;
                            margin:0 6px;
                            line-height:16px;
                            background:#CDCDCD99;
                            color:#215D91FF;
                            text-align:center;
                            border-radius:50%
                        }
                    }
                    .channel-item-text{
                        font-size: 14px
                    }
                    .item-icon{
                        font-size: 16px;
                        vertical-align: top;
                        margin-top: -1px;
                        display: inline-block;
                    }
                }
                .channel-item:nth-child(1){
                    margin-left: 0
                }
            }
            
        }
        .wrap{
            padding:0 0 20px 20px;
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
                font:  16px/30px 'STHeitiTC'; /*STHeitiTC*/
            }
            .ivu-table-body{
                .demo-table-info-column {
                    color: #9AA7C1FF;
                    font:  14px/42px 'STHeitiTC'; /*STHeitiTC*/
                }
                .getRoomMon{
                    color: #6BB4DAFF 
                }
            }

            .ivu-table-row {
                line-height: 42px;
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