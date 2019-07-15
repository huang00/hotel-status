<!--收支流水/支付方式流水-->
<template>
    <div class="ch-should-get">
        <p class="top-table-title">渠道应收款</p>
        <div class="wrap">
            <WtDataTable :cols="cols" :dataContent="allOrderFromListListData"></WtDataTable>
            <div class="all">
                <Row>
                    <Col span="6" class="all-title">总计</Col>
                    <Col span="6" class="all-order">{{allOrderNum.orderNum}}</Col>
                    <Col span="6" class="all-room-night">{{allOrderNum.dayRoomNum}}</Col>
                    <Col span="6" class="all-room-mon">￥{{allOrderNum.oughtAmount.toFixed(2)}}</Col>
                </Row>
            </div>
        </div>
    </div>
</template>

<script>

    import WtDataTable from '../../shareComponents/tabale.vue'
    import util, {
        formatDate
    } from '../../../../../../common_libs/util'
    import { financeApiService } from '../../../../api/API'
    function compare(property,property2){
        return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            // 当应收房费相等时，用订单数来做排序
            if((value2 - value1) == 0){
                return b[property2] - a[property2]
            }else{
                return value2 - value1;
            }
        }
    }

    export default {
        name: 'chShouldGet',
        components: {
            WtDataTable
        },
        computed: {
            // 渠道列表
            orderFromList () {
                let data = JSON.parse(JSON.stringify(this.$store.getters.orderFromList))
                return data
            },

            allOrderFromList () {
                return this.myOrderFromListData.concat(this.orderFromListData)
            },

            // 渠道应收款数据
            channelReList () {
                let data = JSON.parse(JSON.stringify(this.$store.getters.channelReList))
                for(let q = 0;q < data.length;q++){
                    data[q].oughtAmount = data[q].oughtAmount / 100
                }

                // return orderFromList
                return data
            },

            // 总计
            allOrderNum () {
                let channelReList = this.$store.getters.channelReList
                let total = {
                    orderNum : 0,
                    dayRoomNum : 0,
                    oughtAmount : 0
                }
                for(let z = 0;z < channelReList.length;z++){
                    total.orderNum += Number(channelReList[z].orderNum)
                    total.dayRoomNum += Number(channelReList[z].dayRoomNum)
                    total.oughtAmount += Number(channelReList[z].oughtAmount) / 100
                }
                return total
            }
        },
        mounted() {
            // financeApiService.getFinancailDetailServic(payload).then(result => {
            //     console.log(111666, payload)
            //     commit('GETFINANCAILDETAIL', payload)
            // })
            // console.log(1111111)
            this.commonTurn(this.orderFromList)
        },
        data:function(){
            return {
                util,
                cols:[
                    {
                        title: '渠道名称',
                        key: 'channelName',
                        align: 'center',
                        ellipsis: true,
                        className: 'demo-table-info-column for-left-border',
                        render: (h, params) => {
                            return h('div',  [
                                h('div', {
                                    style:{
                                        color:'#9AA7C1FF',
                                        width: '100%',
                                        borderLeft:'2px solid #215D91'
                                    }
                                }, params.row['channelName']),
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
                ],
                dataContent: [
                    {name:'去哪儿',orderNum:'34',roomNight:'3',getRoomMon:'400',},
                    {name:'携程',orderNum:'13',roomNight:'2',getRoomMon:'123.1',},
                    {name:'途牛',orderNum:'13',roomNight:'2',getRoomMon:'123.1',},
                    {name:'飞猪',orderNum:'13',roomNight:'2',getRoomMon:'123.44',},
                    {name:'艺龙',orderNum:'13',roomNight:'2',getRoomMon:'124.56',},
                    {name:'美团',orderNum:'13',roomNight:'2',getRoomMon:'123.56',},
                    {name:'途家',orderNum:'13',roomNight:'2',getRoomMon:'123.56',},
                    {name:'阿里',orderNum:'13',roomNight:'2',getRoomMon:'123.56',},
                    {name:'自来客',orderNum:'13',roomNight:'2',getRoomMon:'123.56',},
                    {name:'其他',orderNum:'13',roomNight:'2',getRoomMon:'123.56',},
                ],
                orderFromListData:[],
                myOrderFromListData:[],
                allOrderFromListListData:[]
            }
        },
        methods: {
            // 渠道来源 myOrderFromListData => 自定义渠道   orderFromListData => 默认渠道     myOrderFromArr => 判断删掉的渠道是否有订单，没有订单且删掉的渠道不显示
            commonTurn(data) {
                if(data.length > 0){
                    this.orderFromListData = []
                    this.myOrderFromListData = []
                    let myOrderFromArr = []
                    for(let q = 0;q < data.length;q++){
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
                            let allOrderFromListListData = this.orderFromListData.concat(this.myOrderFromListData)
                            for(let v = 0;v < allOrderFromListListData.length;v++){
                                allOrderFromListListData[v].dayRoomNum = 0
                                allOrderFromListListData[v].orderNum = 0
                                allOrderFromListListData[v].oughtAmount = 0
                            }
                            for(let x = 0;x < allOrderFromListListData.length;x++){
                                for(let c = 0;c < this.channelReList.length;c++){
                                    if(allOrderFromListListData[x].id == this.channelReList[c].channelId){
                                        allOrderFromListListData[x].dayRoomNum = this.channelReList[c].dayRoomNum
                                        allOrderFromListListData[x].orderNum = this.channelReList[c].orderNum
                                        allOrderFromListListData[x].oughtAmount = this.channelReList[c].oughtAmount
                                    }
                                }
                            }
                            this.allOrderFromListListData = allOrderFromListListData
                            this.allOrderFromListListData = this.allOrderFromListListData.sort(compare('oughtAmount','orderNum'))

                        }else{
                            console.log('渠道订单详情自定义渠道获取失败')
                            this.$Message.error(result.message);
                        }
                    })
                }
            },
            // 每个tableCell 自定义css 和点击事件
            clickCell (h, params, cur) {
                var _this = this
                if (params.row[cur] == '-') {
                    return h('div', [
                        h('span', '-')
                    ])
                } else {
                    return  h('div', [
                        h('span', {
                            style: {
                                textDecoration: 'underline',
                                color: this.colorMatch(params.row[cur], cur),
                                fontSize: '18px',
                                fontWeight: 'nomal',
                                lineHeight: '50px',
                            },
                            on: {
                                click: () => {
                                    _this.$refs.payWaysDetailPannel.showPannel = true
                                }
                            }
                        }, params.row[cur])
                    ])
                }

            },
            //匹配文本颜色显示
            colorMatch(val, cur) {
                val = parseInt(val)
                if (cur == 'total') {
                    return '#1F5B8F'
                } else if (cur == 'date') {
                    return '#9AA7C1'
                }else if (val > 0 ) {
                    return '#85C1E0'
                } else if (val < 0) {
                    return '#E78069'
                } else if(val == 0){
                    return '#9AA7C1'
                }

            }
        },
        watch: {
            orderFromList: {
                handler (data) {
                    this.commonTurn(data)
                },
                deep: true
            },
            allOrderFromListListData: {
                handler (data) {
                    if(data.length == 0){
                        let emptyBody = document.querySelector(".ch-should-get .tab-share .ivu-table-tip")
                        emptyBody.innerHTML = '<div class="not-data"><div class="nodata-text">暂无数据<br/> ...</div></div>'
                    }
                },
                deep: true
            },
            channelReList: {
                handler (data) {
                    this.commonTurn(this.orderFromList)
                },
                deep: true
            }
        }
    }
</script>

<style  lang="scss">
    .ch-should-get{
        .top-table-title{
            font-size: 16px;
            color: #2B6496FF;
            margin: 40px 0 20px 0;
        }
        .for-left-border .ivu-table-cell {
            padding-left: 0;
            padding-right: 0;
        }
        .wrap{
            padding-left:20px;
            background:#fff;
            overflow: hidden;
            .ivu-table-wrapper{
                .ivu-table-body{
                    height: 435px;
                    overflow-y: auto;
                    overflow-x: hidden;
                }
            }
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
                font:  16px 'STHeitiTC'; /*STHeitiTC*/
                line-height: 42px;
            }
            .demo-table-info-getRoomMon{
                color: #215D91FF;
                font:  16px/30px 'STHeitiTC'; /*STHeitiTC*/
            }
            .ivu-table-body .demo-table-info-orderNum{
                color: #9AA7C1FF;
                font:  14px/30px 'STHeitiTC'; /*STHeitiTC*/
            }
            .ivu-table-body .demo-table-info-roomNight{
                color: #9AA7C1FF;
                font:  14px/30px 'STHeitiTC'; /*STHeitiTC*/
            }
            .ivu-table-body .demo-table-info-getRoomMon{
                color: #6BB4DAFF;
                font:  14px/30px 'STHeitiTC'; /*STHeitiTC*/
            }
            .ivu-table-body{
                .for-left-border{
                    font:  14px/30px 'STHeitiTC'; /*STHeitiTC*/
                }
                .demo-table-info-column {
                    font:  14px 'STHeitiTC'; /*STHeitiTC*/
                    line-height: 42px;
                }
            }
            .ivu-table-row {
                line-height: 30px;
                /*background-color: #fafafa;*/
                margin-bottom: 10px;
                color: #85C1E0;
                font-size: 16px;
                font-family: 'MicrosoftYaHei';
            }
            .all{
                text-align:center;
                height:42px;
                line-height:42px;
                background:#9AA7C1FF;
                color: #fff;
                .all-title,.all-order,.all-room-night{
                    font:  16px/42px 'STHeitiTC'; /*STHeitiTC*/
                    color: #FFFFFFFF
                }
                .all-room-mon{
                    font:  16px/42px 'STHeitiTC'; /*STHeitiTC*/
                    color: #FFFFFFFF
                }
            }
        }
        
        
    }
    


</style>

