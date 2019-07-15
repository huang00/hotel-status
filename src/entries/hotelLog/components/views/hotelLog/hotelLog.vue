<template>
    <div class="hotelLog">
        <!-- <div class="hotelStatusPageHead">
            <hotel-status-page-head></hotel-status-page-head>
        </div> -->
        <main>
            <template v-if="hotelList.length > 1">
                <Row class="search-head">
                    <Select v-model="type" style="width:200px" placeholder="选择类型" @on-change="typeHandler"
                    >
                        <Option v-for="(item, index) in logTypeList" :value="item.id" :key="index">{{ item.lable }}</Option>
                    </Select>

                    <Select v-model="innId" style="width:200px" placeholder="选择客栈" @on-change="typeHandler('hotel')"
                    >
                        <Option v-for="(item, index) in hotelList" :value="item.innId" :key="index">{{ item.innName }}</Option>
                    </Select>

                    <Select v-model="username" style="width:200px" placeholder="选择操作人" @on-change="typeHandler"
                        :style="{'color':username == '选择操作人' ? '#bbbec4':'#495060'}" 
                    >
                        <Option v-for="(item, index) in operaterList" :value="item.username" :key="index">
                            {{ item.employeeName }}
                        </Option>
                    </Select>
                    <DatePicker type="date" format="yyyy-MM-dd" :value="startDate" :clearable="false"
                        @on-change="startHandler" placeholder="开始日期" 
                        :editable="false" style="width: 200px;margin-left: 20px;">
                    </DatePicker> &nbsp;&nbsp;至&nbsp;&nbsp;
                    <DatePicker type="date" format="yyyy-MM-dd" :value="endDate" :options="disabledDate" :clearable="false"
                        @on-change="endHandler" placeholder="结束日期" 
                        :editable="false" style="width: 200px">
                    </DatePicker>
                </Row>
                <div class="content">
                    <Table :columns="columns" id="logTable" :data="logDataList" :loading="loading"></Table>
                    <Page :current="currentPage" :page-size="pageSize" :total="total" class="pagenation" @on-change="pageHandler"></Page>
                </div>
            </template>
             <template v-else>
                 <div style="width:110px;height:140px;margin:0 auto;padding-top:150px;">
                    <img src="../../../assets/images/no_permission.png" alt="">
                    <p style="text-align:center;color:#A3AFC7;">无操作记录权限!</p>
                </div>
            </template>
            
        </main>
    </div>
</template>
<script>
    // import {mapActions} from 'vuex'
    import {getCookie} from 'common_libs/util.js'
    import hotelStatusPageHead from '../../common/hotelStatusPageHead/hotelStatusPageHead.vue'
    import { hotelLogApiServers } from '../../../api/API'

    export default {
        name: 'hotelLog',
        components: {
            hotelStatusPageHead,
        },
        data() {
            return {
                startDate: this.formatDate(new Date()),
                endDate: this.formatDate(new Date()),
                loading: false,
                type: '',
                total: 0,
                totalPage: 0,
                pageSize: 5,
                currentPage: 0,
                disabledDate: {
                    disabledDate: (date) => {
                        if (date) {
                            let start = new Date(this.startDate)
                            return date.valueOf() < new Date(start.getFullYear(), start.getMonth(), start.getDate());
                        }
                    }
                },
                columns: [
                    {
                        title: '客栈名',
                        key: 'innName',
                        // width: '100%'
                    },
                    {
                        title: '类型',
                        key: 'logTypeSubName',
                        // width: '10%',
                    },
                    {
                        title: '平台',
                        key: 'logFrom',
                        // width: '20%',
                    },
                    {
                        title: '版本',
                        key: 'logVersion',
                        // width: '10%'
                    },
                    {
                        title: '内容',
                        key: 'logContent',
                        width: 200,
                        render (h, row) {
                            let str = row.row.logContent
                            return h({
                                template: '<div :ref="ref" class="logContent"></div>',
                                data () {
                                    return {
                                        ref: 'log'+row.index
                                    }
                                },
                                mounted () {
                                    this.$nextTick(() => {
                                        this.$refs[this.ref].innerHTML = str
                                    })
                                }
                            })
                        }
                    },
                    {
                        title: '账号',
                        key: 'userName'
                    },
                    {
                        title: '时间',
                        key: 'logDate',
                        // width: '10%'
                    }
                ],
                logTypeList: [{id: 'all', lable: '全部类型'}],
                logDataList: [],
                logTypeSubId: '',
                hotelList:[{innId: 'all', innName: '全部客栈'}],
                operaterList:[{userId: '', username: '全部操作人',employeeName:'全部操作人'}],
                innName:'',
                username:'',
                innId:""
            }
        },
        methods: {
            startHandler(date) {
                this.startDate = date;
                let start = new Date(date),
                    end = new Date(this.endDate);
                end < start && (this.endDate = this.startDate)
                this.getData()
            },
            endHandler(date) {
                this.endDate = date;
                this.getData()
            },
            pageHandler(index) {
                this.currentPage = index
                this.getData()
            },
            typeHandler(value) {
                // this.logTypeSubId = value
                if(value == 'hotel'){
                    this.username = ""
                    this.operaterList = [{userId: '', username: '全部操作人',employeeName:'全部操作人'}]
                    if(this.innId){
                        this.getOperaterList()
                    }
                }
                this.getData()
            },
            getData() {
                let params = {
                    startDay: this.startDate,
                    endDay: this.endDate,
                    logUid: getCookie('userId'),
                    page: this.currentPage,
                    size: this.pageSize,
                    logTypeSubId: this.type,
                    // innName: this.innName,
                    innId: this.innId,
                    username: this.username,
                    pvalue:'R_OPERATE_LOG'
                };
                if(params.logTypeSubId == 'all'){
                    params.logTypeSubId = ''
                }
                if(params.innId == 'all'){
                    params.innId = ''
                }
                if(params.username == '全部操作人'){
                    params.username = ''
                }
                // this.loading = true
                hotelLogApiServers.getNewWefintLog(params).then(result => {

                    // if (result.code === '000000') {
                        this.logDataList = [];
                        this.currentPage = result.pageNum
                        this.totalPage = result.pages
                        this.total = result.total
                        let list = result.list
                        var emptyList = []
                        if(list){
                            for (let i = 0, len = list.length; i < len; i++) {
                                let emptyObj = {
                                    logTypeSubName: list[i].logTypeSubName,
                                    logFrom: list[i].logFrom,
                                    logVersion: list[i].logVersion,
                                    logContent: list[i].logContent,
                                    logTypeName: list[i].logTypeName,
                                    logDate: this.formatDate(list[i].logDate),
                                    userName: list[i].userName || '',
                                    innName: list[i].innName || '',
                                }
                                emptyList.push(emptyObj)
                            }
                            this.logDataList = emptyList
                        }
                        // else{
                        //     if(result.message){
                        //         if(result.code != '000000'){
                        //             alert(result.message)
                        //         }
                        //     }
                            
                        // }
                        // !emptyList.length && this.notData()
                    // }
                    // this.loading = false
                    
                })
            },
            getLogType () {
                hotelLogApiServers.getlogtype().then(result => {
                    if (result.code === '000000') {
                        let list = result.content
                        for (let i = 0, len = list.length; i < len; i++) {
                            this.logTypeList.push({
                                id: list[i].id,
                                lable: `${list[i].logTypeName}-${list[i].logTypeSubName}`
                            })
                        }
                    }
                })
            },
            formatDate (timeStamp) {
                let date = new Date(timeStamp),
                    year = date.getFullYear(),
                    month = date.getMonth() + 1,
                    day = date.getDate(),
                    hours = date.getHours() < 10? '0' + date.getHours(): date.getHours(),
                    minutes = date.getMinutes() < 10? '0' + date.getMinutes(): date.getMinutes();
                return `${year}-${month}-${day} ${hours}:${minutes}`
            },
            notData () {
                let emptyBody = document.getElementById('logTable').getElementsByClassName('ivu-table-tip')[0];
                emptyBody.innerHTML = '<div class="notData"></div>'
            },
            getHotelList() {
                let data = {
                    pvalue:'R_OPERATE_LOG'
                }
                hotelLogApiServers.getInnListByPermission(data).then(result => {
                    if(result.code == '000000'){
                        let list = result.content
                        for (let i = 0, len = list.length; i < len; i++) {
                            this.hotelList.push({
                                innId: list[i].innId,
                                innName: `${list[i].innName}`
                            })
                        }
                        // this.hotelList = result.content
                    }
                })
            },
            getOperaterList() {
                // let innId = ''
                // for(let z = 0;z < this.hotelList.length;z++){
                //     if(this.hotelList[z].innName == this.innName){
                //         innId = this.hotelList[z].innId
                //     }
                // }
                let data = {
                    innId: this.innId
                }
                this.operaterList = [{userId: '', username: '全部操作人',employeeName:'全部操作人'}]
                hotelLogApiServers.getEmployeesList(data).then(result => {
                    if(result.code == '000000'){
                        let list = result.content
                        for (let i = 0, len = list.length; i < len; i++) {
                            this.operaterList.push({
                                userId: list[i].userId,
                                employeeName: `${list[i].employeeName}`,
                                username: `${list[i].username}`,
                            })
                        }
                        // this.hotelList = result.content
                    }
                })
            }
        },
        created () {
            this.getLogType()
            this.getData();
            this.getHotelList()
        }
    }
</script>

<style scoped lang="scss">
    .hotelLog {
        min-height: 500px;
        .hotelStatusPageHead {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            min-width: 1280px;
            height: 70px;
            justify-content: space-between;
            z-index: 1000;
        }
        main {
            // padding-top: 70px;
            width: 90%;
            margin: 0 auto;
            .search-head {
                margin-top: 50px;
            }
            .content {
                margin-top: 32px;
                .pagenation {
                    margin-top: 30px;
                    text-align: center;
                }
            }
        }
    }
</style>
