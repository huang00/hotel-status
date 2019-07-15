<!--收支流水/支付方式流水-->
<template>
    <div class="ch-day-should-get">
        <p class="top-table-title">
            <span class="top-table-title-left">渠道日应收</span>
            <!-- <span class="output">导出报表</span>     -->
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
                    <p class="default-des" @click="openMyChan = !openMyChan">
                        自定义渠道
                        <Icon type="ios-arrow-up rotate" style="margin-bottom:2px" :class="[openMyChan?'rotate':'rotateDown']"/>
                    </p>
                    <div class="channel-item-body"  v-show="openMyChan">
                        <div class="channel-item" :title="item.channelName" v-for="(item,index) in myOrderFromListData" :key="item.itemText" @click="chooseMyType(item.id,index,item.value)">
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
        <div class="wrap">
            <WtDataTable :cols="cols" :dataContent="channelDayReListCon"></WtDataTable>
            <Page v-show="Number(total) > 20" :total="total" :current="tPage.pageNum" :page-size="20" 
              placement="top" @on-change="curPageNum"
              prev-text="上一页" next-text="下一页" class="pageWrap"></Page>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from "vuex"
    import WtDataTable from '../../shareComponents/tabale.vue'
    import util, {
        formatDate
    } from '../../../../../../common_libs/util'
    import { financeApiService } from '../../../../api/API'

    // 渠道icon
    import xiecheng from '../../../../assets/xiecheng.png'
    import xianjin from '../../../../assets/xianjin.png'
    import zhifubao from '../../../../assets/zhifubao.png'
    import weixin from '../../../../assets/weixin.png'
    import yinlian from '../../../../assets/yinlian.png'
    import qne from '../../../../assets/qne.png'
    import meituan from '../../../../assets/meituan.png'
    import yl from '../../../../assets/yl.png'
    import feizhu from '../../../../assets/feizhu.png'
    import qita from '../../../../assets/qita.png'
    import bk from '../../../../assets/bk.png'
    import tc from '../../../../assets/tc.png'
    import lvmm from '../../../../assets/lvmm.png'
    import mfw from '../../../../assets/mfw.png'
    import tuniu from '../../../../assets/tuniu.png'
    import tujia from '../../../../assets/tujia.png'
    import yiqiyou from '../../../../assets/yiqiyou.png'
    import airbnb from '../../../../assets/airbnb.png'
    import xzdz from '../../../../assets/xzdz.png'
    import agoda from '../../../../assets/agoda.png'

    export default {
        name: 'chDayShouldGet',
        components: {
            WtDataTable,
        },
        computed: {
            // 渠道列表
            orderFromList () {
                let data = JSON.parse(JSON.stringify(this.$store.getters.orderFromList))
                return data
            },
            // 表格数据
            channelDayReListCon () {
                let data = JSON.parse(JSON.stringify(this.$store.getters.channelDayReList.datas))
                for(let q = 0;q < data.length;q++){
                    data[q].oughtAmount = Number(data[q].oughtAmount) / 100
                }
                return data
            }, 
            // 选中的渠道id
            channelDayIds () {
                return this.$store.getters.channelDayIds
            },
            total () {
                return this.$store.getters.channelDayReList.total
            }
        },
        data:function(){
            return {
                xiecheng,
                util,
                allChannel:true,
                cols:[
                    {
                        title: '日期',
                        key: 'date',
                        align: 'center',
                        ellipsis: true,
                        width:200,
                        className: 'demo-table-info-column for-left-border',
                        render: (h, params) => {
                            return h('div',  [
                                h('div', {
                                    style:{
                                        color:'#9AA7C1FF',
                                        width: '100%',
                                        borderLeft:'2px solid #215D91'
                                    }
                                }, params.row['date']),
                            ])
                        },
                    },
                    {
                        title: '订单数',
                        key: 'orderNum',
                        align: 'center',
                        className: 'demo-table-info-orderNum',
                    },
                    {
                        title: '间夜数',
                        key: 'dayRoomNum',
                        align: 'center',
                        className: 'demo-table-info-roomNight',
                    },
                    {
                        title: '应收房费',
                        key: 'oughtAmount',
                        align: 'center',
                        className: 'demo-table-info-getRoomMon',
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
                        title: '查看订单',
                        fontSize: 14,
                        key: 'checkOrderInfo',
                        align: 'center',
                        className: 'demo-table-info-getRoomMon',
                        render: (h, params) => {
                            // 点击获取订单详情
                            return this.clickOrderInfo(h, params, 'checkOrderInfo')
                        }
                    },
                ],
                dataContent: [
                    {id:0,date:'08-15',orderNum:33,roomNight:22,getRoomMon:3451},
                    {id:1,date:'08-15',orderNum:33,roomNight:22,getRoomMon:3451},
                    {id:2,date:'08-15',orderNum:33,roomNight:22,getRoomMon:3451},
                    {id:3,date:'08-15',orderNum:33,roomNight:22,getRoomMon:3451},
                    {id:4,date:'08-15',orderNum:33,roomNight:22,getRoomMon:3451},
                    {id:5,date:'08-15',orderNum:33,roomNight:22,getRoomMon:3451},
                    {id:6,date:'08-15',orderNum:33,roomNight:22,getRoomMon:3451},
                    {id:7,date:'08-15',orderNum:33,roomNight:22,getRoomMon:3451},
                    {id:8,date:'08-15',orderNum:33,roomNight:22,getRoomMon:3451},
                    {id:9,date:'08-15',orderNum:33,roomNight:22,getRoomMon:3451},
                    {id:10,date:'08-15',orderNum:33,roomNight:22,getRoomMon:3451},
                ],
                tPage: {
                    pageNum: 1,
                    pageSize: 20,
                    pageTotal: 140,
                    initPage: 1
                },

                // 默认渠道
                openDefault:true,
                // 自定义渠道
                openMyChan:false,

                indeterminate: true,
                checkAll: false,
                checkAllGroup: ['携程预付'],
                channelTypeList:[
                    '携程预付',
                    '携程现付',
                    '携程闪付',
                    '飞猪',
                    '美团',
                    '去哪儿预付',
                    '去哪儿现付',
                    '去哪儿闪付',
                    '艺龙预付',
                    '艺龙现付',
                    '阿里',
                    '一起游',
                    '自来客',
                    '马蜂窝',
                ],

                channelItemList:[
                    {
                        src : xiecheng,
                        itemText : '携程预付',
                        value: 0,
                        id:1
                    },
                    {
                        src : xiecheng,
                        itemText : '携程现付',
                        value: 0,
                        id:2
                    },
                    {
                        src : xiecheng,
                        itemText : '携程闪付',
                        value: 0,
                        id:3
                    },
                    {
                        src : qne,
                        itemText : '去哪儿预付',
                        value: 0,
                        id:4
                    },
                    {
                        src : qne,
                        itemText : '去哪儿现付',
                        value: 0,
                        id:5
                    },
                    {
                        src : yl,
                        itemText : '艺龙预付',
                        value: 0,
                        id:6
                    },
                    {
                        src : yl,
                        itemText : '艺龙现付',
                        value: 0,
                        id:7
                    },
                    {
                        src : xiecheng,
                        itemText : '小猪短租',
                        value: 0,
                        id:8
                    },
                    {
                        src : feizhu,
                        itemText : '飞猪',
                        value: 0,
                        id:9
                    },
                    {
                        src : xiecheng,
                        itemText : '自来客',
                        value: 0,
                        id:10
                    },
                    {
                        src : meituan,
                        itemText : '美团',
                        value: 0,
                        id:11
                    },
                    {
                        src : yl,
                        itemText : '一起游',
                        value: 0,
                        id:12
                    },
                ],

                orderFromListData:[],
                myOrderFromListData:[],
            }
        },
        mounted() {
            // let storeData = {
            //     type : 3
            // }
            // this.setChannelDayIds(storeData)

            // this.getOrderFromList()
            this.getChoosedChannel()
        },
        methods: {
            ...mapActions(['setChannelDayIds']),
            // 选中选中过的渠道
            getChoosedChannel () {
                for(let q = 0;q < this.orderFromListData.length;q++){
                    for(let m = 0;m < this.channelDayIds.length;m++){
                        if(this.orderFromListData[q].id == this.channelDayIds[m]){
                            this.orderFromListData[q].value = 1
                            this.allChannel = false
                        }
                    }
                }

                for(let z = 0;z < this.myOrderFromListData.length;z++){
                    for(let x = 0;x < this.channelDayIds.length;x++){
                        if(this.myOrderFromListData[z].id == this.channelDayIds[x]){
                            this.myOrderFromListData[z].value = 1
                            this.allChannel = false
                        }
                    }
                }
            },
            // 获取渠道列表
            getOrderFromList () {
                let data = JSON.parse(JSON.stringify(this.$store.getters.orderFromList))
                this.commonTurn(data)
            },
            // 每个tableCell 自定义css 和点击事件
            clickOrderInfo (h, params, cur) {
                var _this = this
                return  h('div', [
                    h('span', {
                        style: {
                            textDecoration: 'underline',
                            color: Number(params.row.orderNum) == 0 ? '#ccc' : '#1F5B8F',
                            fontSize: '14px',
                            cursor: Number(params.row.orderNum) == 0 ? '' : 'pointer',
                        },
                        on: {
                            click: () => {
                                if(Number(params.row.orderNum) == 0){
                                    return
                                }
                                let ids = this.$store.getters.channelDayIds
                                let date = params.row.date.substring(0,10)
                                let queryType = this.$store.getters.channeldate
                                this.$router.push({
                                    path: '/dayAllOrder',
                                    query: {
                                        date: date,
                                        ids: JSON.stringify(ids),
                                        queryType: queryType
                                    }
                                });
                            }
                        }
                    }, '查看订单')
                ])
            },
            // 根据翻页请求数据
            curPageNum (page) {
                this.tPage.pageNum = page
                this.$parent.getChannelDayReListData()
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
                    this.setChannelDayIds(storeData)
                }else{
                    this.orderFromListData[index].value = 0
                    let storeData = {
                        id : id,
                        type : 2
                    }
                    this.setChannelDayIds(storeData)
                }

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
                    this.setChannelDayIds(storeData)
                }else{
                    this.myOrderFromListData[index].value = 0
                    let storeData = {
                        id : id,
                        type : 2
                    }
                    this.setChannelDayIds(storeData)
                }

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

            // 选中全部渠道
            chooseAllChannel() {
                this.allChannel = !this.allChannel
            },

            // 渠道来源 myOrderFromListData => 自定义渠道   orderFromListData => 默认渠道     myOrderFromArr => 判断删掉的渠道是否有订单，没有订单且删掉的渠道不显示
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
                            console.log(this.myOrderFromListData)
                        }else{
                            console.log('渠道订单详情自定义渠道获取失败')
                            this.$Message.error(result.message);
                        }
                    })
                }
            },

            // 获取对应图标
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
        },
        watch: {
            tPage: {
                handler (val) {
                    console.log(val)
                },
            },
            allChannel: {
                handler (val) {
                    if(val){
                        let storeData = {
                            type : 3
                        }
                        this.setChannelDayIds(storeData)
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
            channelDayReListCon: {
                handler (data) {
                    if(data.length == 0){
                        let emptyBody = document.querySelector(".ch-day-should-get .tab-share .ivu-table-tip")
                        emptyBody.innerHTML = '<div class="not-data"><div class="nodata-text">暂无数据<br/> ...</div></div>'
                    }
                },
                deep: true
            },
        }
    }
</script>

<style  lang="scss">
    .ch-day-should-get{
        margin-top: 60px;
        
        .top-table-title{
            font-size: 14px;
            color: #9AA7C1FF;
            margin: 40px 0 10px 0;
            display: flex;
            justify-content: space-between;
            .top-table-title-left{
                font-size: 16px;
                color: #2B6496FF
            }
            .output {
                text-align: right;
                font-size: 16px;
                color: #9AA7C1;
                border-radius: 20px;
                padding: 3px 26px;
                border: 1px solid #9AA7C1;
                cursor: pointer;
            }
        }
        .for-left-border .ivu-table-cell {
            padding-left: 0;
            padding-right: 0;
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
            clear: both;
            background:#fff;
            margin-top: 30px;
            .demo-table-info-orderNum{
                color: #215D91FF;
                font:  16px/30px 'STHeitiTC'; /*STHeitiTC*/
            }
            .demo-table-info-roomNight{
                color: #215D91FF;
                font:  16px/30px 'STHeitiTC'; /*STHeitiTC*/
            }
            .demo-table-info-column {
                color: #215D91FF;
                font:  16px/30px 'STHeitiTC'; /*STHeitiTC*/
            }
            .demo-table-info-getRoomMon{
                color: #215D91FF;
                font:  16px/30px 'STHeitiTC'; /*STHeitiTC*/
            }
            .ivu-table-body {
                .demo-table-info-orderNum{
                    color: #9AA7C1FF;
                    font:  14px/30px 'STHeitiTC'; /*STHeitiTC*/
                }
                .demo-table-info-roomNight{
                    color: #9AA7C1FF;
                    font:  14px/30px 'STHeitiTC'; /*STHeitiTC*/
                }
                .demo-table-info-getRoomMon{
                    color: #6BB4DAFF;
                    font:  14px/30px 'STHeitiTC'; /*STHeitiTC*/
                }
                .demo-table-info-column {
                    color: #9AA7C1FF;
                    font:  14px/42px 'STHeitiTC'; /*STHeitiTC*/
                }
            }
            .ivu-table-row {
                line-height: 30px;
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

