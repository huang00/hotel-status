<template>
    <div class="hotelOrder">
        <main>
            <div class="search-head">
                <Input class="search-input m_r" v-model="condition" icon="ios-search" placeholder="姓名、电话、房间号" style="width: 264px"></Input>
                <Select v-model="dateType" style="width:200px" class="m_r" placeholder="选择类型" @on-change="typeHandler">
                    <Option v-for="item in dateTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <DatePicker type="date" format="yyyy-MM-dd" :value="startDate" :clearable="false"
                    @on-change="startHandler" placeholder="开始日期"
                    :editable="false" style="width: 160px">
                </DatePicker> &nbsp;&nbsp;至&nbsp;&nbsp;
                <DatePicker type="date" format="yyyy-MM-dd" class="m_r" :value="endDate" :options="disabledDate"
                    @on-change="endHandler" placeholder="结束日期" :clearable="false"
                    :editable="false" style="width: 160px">
                </DatePicker>
                <Button type="primary" @click="search">搜索</Button>
            </div>
            <div class="content">
                <Table :columns="columns" ref="orderTable" id="orderTable" :data="orderDataList" @on-row-click="showDetail"></Table>
                <Row style="margin: 20px; margin-right: 0;">
                    <Col :span="12">
                        <div class="total-item">共 <span>{{ total }}</span> 条搜索结果</div>
                    </Col>
                    <Col :span="12">
                        <div class="statistics">
                            <span>汇总：</span> 应收：<span>¥ {{toDecimal2(priceSum/100 || 0)}}</span><br> 需收：<span>¥ {{toDecimal2((priceSum - paidSum)/100 || 0)}}</span> </div>
                    </Col>
                </Row>
                <!-- <Page :current="currentPage" :total="total" :page-size="pageSize" class="pagenation" @on-change="pageHandler"></Page> -->
            </div>
        </main>
        <order-modal v-on:closeModal="closeModal" v-if="openModal" :dataObj="dataObj"></order-modal>
    </div>
</template>
<script>
    import { getCookie, toDecimal2 } from 'common_libs/util.js'
    import orderModal from '../../common/orderModal/orderModal'
    import { hotelOrderApiServers } from '../../../api/API'

    export default {
        name: 'hotelOrder',
        components: {
            orderModal
        },
        data() {
            const vm = this;
            return {
                condition: '',
                startDate: this.formatDate(new Date()),
                // endDate: '2018-07-31',
                endDate: this.formatDate(new Date()),
                dateType: '1',
                totalPage: 0,
                total: 0,
                currentPage: 1,
                nextPage: 1,
                openModal: false,
                dataObj: {},
                pageSize: 20,
                toDecimal2,
                disabledDate: {
                    disabledDate: (date) => {
                        if (date) {
                            let start = new Date(this.startDate)
                            return date.valueOf() < new Date(start.getFullYear(), start.getMonth(), start.getDate());
                        }
                    }
                },
                dateTypeList: [
                    {
                        value: '1',
                        label: '订单首住日期'
                    },
                    {
                        value: '2',
                        label: '订单在住日期'
                    },
                    {
                        value: '3',
                        label: '订单最晚退房日期'
                    },
                ],
                columns: [
                    {
                        title: '联系人姓名',
                        key: 'contactName',
                        render (h, data) {
                            return h({
                                template: '<div :class="selected">{{contactName}}</div>',
                                data () {
                                    return {
                                        contactName: data.row.contactName
                                    }
                                },
                                computed: {
                                    selected () {
                                        if (this.contactName === vm.condition) {
                                            return 'selected'
                                        }
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '电话',
                        key: 'contactPhone',
                        render (h, data) {
                            return h({
                                template: '<div :class="selected">{{contactPhone}}</div>',
                                data () {
                                    return {
                                        contactPhone: data.row.contactPhone
                                    }
                                },
                                computed: {
                                    selected () {
                                        if (this.contactPhone === vm.condition) {
                                            return 'selected'
                                        }
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '房间',
                        key: 'roomNo',
                        render (h, data) {
                            return h({
                                template: '<div><div v-for="(item, index) in list" :class="selected(item)" :key="index">{{item}}</div></div>',
                                data () {
                                    return {
                                        list: data.row.roomNo
                                    }
                                },
                                methods: {
                                    selected (item) {
                                        if (item === vm.condition) {
                                            return 'selected'
                                        }
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '入住日期',
                        key: 'checkInDate',
                        render (h, data) {
                            return h({
                                template: '<div><div v-for="(item, index) in list" :class="selected(item)" :key="index">{{item}}</div></div>',
                                data () {
                                    return {
                                        list: data.row.checkInDate
                                    }
                                },
                                methods: {
                                    selected (item) {
                                        if (item === vm.startDate && vm.dateType === '1') {
                                            return 'selected'
                                        }
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '退房日期',
                        key: 'checkOutDate',
                        render (h, data) {
                            return h({
                                template: '<div><div v-for="(item, index) in list" :class="selected(item)" :key="index">{{item}}</div></div>',
                                data () {
                                    return {
                                        list: data.row.checkOutDate
                                    }
                                },
                                methods: {
                                    selected (item) {
                                        if (item === vm.endDate && vm.dateType === '3') {
                                            return 'selected'
                                        }
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '应收金额',
                        key: 'totalAmount',
                        render (h, data) {
                            return h({
                                template: '<div>￥ {{toDecimal2(totalAmount)}}</div>',
                                data () {
                                    return {
                                        totalAmount: data.row.totalAmount,
                                        toDecimal2
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '需收/需退',
                        key: 'paidAmount',
                        render (h, data) {
                            return h({
                                template: '<div :class="className(paidAmount)">￥ {{paidAmount>=0?"需收":"需退"}}{{toDecimal2(Math.abs(paidAmount))}}</div>',
                                data () {
                                    return {
                                        paidAmount: data.row.totalAmount-data.row.paidAmount,
                                        toDecimal2
                                    }
                                },
                                methods: {
                                    className (value) {
                                        return Number(value) >= 0? 'plus':'negative'
                                    }
                                }
                            })
                        }
                    }
                ],
                orderDataList: [],
                isLoad: true, //是否要加载数据
                isClearDate: false, //搜索的时候需要清楚掉数据
                count: 0, //加载次数
                priceSum: 0,
                paidSum: 0
            }
        },
        methods: {
            startHandler(date) {
                this.startDate = date;
                let start = new Date(date),
                    end = new Date(this.endDate);
                end < start && (this.endDate = this.startDate)
            },
            endHandler(date) {
                this.endDate = date;
            },
            pageHandler(index) {
                this.currentPage = index
                let params = {
                    condition: this.condition,
                    searchType: this.dateType,
                    begin: +new Date(this.startDate),
                    end: +new Date(this.endDate),
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    userId: getCookie('userId'),
                    innId: getCookie('innId')
                }
                this.getData(params)
            },
            typeHandler(value) {
                console.log('typeValue: ', value)
            },
            search() {
                this.isClearDate = true;
                this.count = 0
                let tableBody = this.$refs.orderTable.$refs.body;
                this.currentPage = 1
                tableBody.scrollTop = 0
                let params = {
                    condition: this.condition,
                    searchType: this.dateType,
                    begin: +new Date(this.startDate),
                    end: +new Date(this.endDate),
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    userId: getCookie('userId'),
                    innId: getCookie('innId')
                }
                this.getData(params)
            },
            showDetail (data) {
                this.dataObj = data;
                this.openModal = true;
            },
            closeModal (boo) {
                this.openModal = !boo;
            },
            formatDate (timeStamp) {
                let date = new Date(timeStamp),
                    year = date.getFullYear(),
                    month = date.getMonth() + 1,
                    day = date.getDate();
                return `${year}-${month}-${day}`
            },
            getData(params) {
                if (!this.isLoad) {
                     return false
                }
                hotelOrderApiServers.findByCondition(params).then(result => {
                    this.isLoad = false
                    let emptyList = []
                    if (result.code === '000000' && result.content) {
                        let list = result.content.orders;
                        this.total = result.content.total
                        this.totalPage = result.content.totalPages
                        this.currentPage = result.content.pageNum
                        this.paidSum = result.content.paidSum
                        this.priceSum = result.content.priceSum

                        for (let i = 0, len = list.length; i < len; i++) {
                            let suborders = list[i].suborders,
                                rooms = [],
                                checkInDates = [],
                                checkOutDates = [];
                            let emptyObj = {
                                contactName: list[i].contactName,
                                contactPhone: list[i].contactPhone,
                                totalAmount: list[i].totalAmount / 100,
                                paidAmount: list[i].paidAmount / 100,
                                id: list[i].id
                            }
                            for (let j = 0, l = suborders.length; j < l; j++) {
                                rooms.push(suborders[j].roomNo)
                                checkInDates.push(this.formatDate(suborders[j].checkInDate))
                                checkOutDates.push(this.formatDate(suborders[j].checkOutDate))
                            }
                            emptyObj.roomNo = rooms
                            emptyObj.checkInDate = checkInDates
                            emptyObj.checkOutDate = checkOutDates
                            emptyList.push(emptyObj)
                        }
                        if (this.isClearDate) {
                            this.orderDataList = emptyList
                            this.isClearDate = false
                        } else {
                            this.orderDataList = this.orderDataList.concat(emptyList)
                        }
                        if (!this.orderDataList.length) {
                            this.notData()
                        }
                    } else if (result.code === '000000' && !result.content) {
                        let list = []
                        this.total = 0
                        this.totalPage = 0
                        this.currentPage = 1
                        this.paidSum = 0
                        this.priceSum = 0
                        this.orderDataList = []
                        this.notData()
                    }
                    this.isLoad = true
                }).catch((err) => {
                    console.log(err)
                    this.isLoad = true
                })
            },
            notData () {
                let emptyBody = document.getElementById('orderTable').getElementsByClassName('ivu-table-tip')[0];
                emptyBody.innerHTML = '<div class="not-data"></div>'
            }
        },
        created() {
            let initParams = {
                condition: this.condition,
                searchType: this.dateType,
                begin: +new Date(this.startDate),
                end: +new Date(this.endDate),
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                userId: getCookie('userId'),
                innId: getCookie('innId')
            };
            this.getData(initParams)
        },
        mounted () {
            //下拉加载
            let that = this
            this.$nextTick(() => {
                let tableBody = this.$refs.orderTable.$refs.body,
                    theUnit = 0,
                    n = 0;
                tableBody.onscroll = function(e) {
                    let scrollTop = tableBody.scrollTop,
                        ratio = scrollTop / 630 || '0.00',
                        filter = /(\d+)\.(\d{1})/,
                        result = filter.exec(ratio);
                    if (result) {
                        theUnit = result[1]
                        n = result[2]
                    }
                    if ( n >= 5) {
                        that.nextPage = that.currentPage + 1
                        if ( that.nextPage <= that.totalPage && that.currentPage >= theUnit && that.totalPage -1 > that.count) {
                            that.count++
                            let initParams = {
                                condition: that.condition,
                                searchType: that.dateType,
                                begin: +new Date(that.startDate),
                                end: +new Date(that.endDate),
                                pageNum: that.nextPage,
                                pageSize: that.pageSize,
                                userId: getCookie('userId'),
                                innId: getCookie('innId')
                            }
                            that.getData(initParams)
                        }
                    }
                }
            })
        }
    }
</script>

<style scoped lang="scss">
    .hotelOrder {
        main {
            // padding-top: 70px;
            width: 90%;
            margin: 0 auto;
            .search-head {
                margin-top: 50px;
                .m_r { margin-right: 35px; }
            }
            .content {
                margin-top: 32px;
                .pagenation {
                    margin-top: 30px;
                    text-align: center;
                }
                .total-item {
                    span { color: #FA2E2E; }
                }
                .statistics {
                    text-align: right;
                    span { font-family:MicrosoftYaHei; }
                    span:nth-child(2), span:last-child {
                        font-size: 16px;
                        display: inline-block;
                        min-width: 120px;
                        text-align: left;
                    }
                    span:first-child {
                        color:rgba(0,0,0,1);
                        font-size: 18px;
                    }
                    span:nth-child(2) { color:rgba(0,0,0,1); }
                    span:last-child { color:#F9966F; }
                }
            }
        }
    }
</style>
