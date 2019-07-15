<template>
    <footer class="app-footer disabled-select">
        <ul class="today-order">
            <li @click="openTodayModal(1)">
                <Icon type="ios-log-in" size="20" style="font-weight: 600;" />
                今日预到 &nbsp;&nbsp;{{hotelTodayInOrderList.length}}
            </li>
            <li @click="openTodayModal(2)">
                <Icon type="ios-log-out" size="20" style="font-weight: 600;" />
                今日预离 &nbsp;&nbsp; {{hotelTodayOutOrderList.length}}
            </li>
        </ul>

        <div class="remind" @click="openOrderNotice()">
            <Badge :count="totalUnreadMessageCount" :offset="[13, -5]" class-name="remind-badge">
                <Icon type="md-text" color="#fff" size="20" />
            </Badge>
        </div>
        <!-- 今日预离预到弹窗 -->
        <order-modal :data="modalData" ref="orderModal"></order-modal>

        <!-- 订单消息列表 -->
        <order-notice-list v-show="showOrderNoticeList" ref="orderNoticeList"></order-notice-list>
        
        <!-- 最新接收提示信息 -->
        <NewMessageTip  ref="NewMessageTip"></NewMessageTip>
    </footer>
</template>


<script>
    import {mapActions,mapMutations} from 'vuex'
    import OrderModal from './OrderModal/'
    import OrderNoticeList from './OrderNoticeList/'
    import NewMessageTip from './newMessageTip/'
    import AppModal from 'common_components/AppModal/'
    import { getCookie,formatDate,mainOrderDataProcess,deepCopy } from 'common_libs/util'
    import { footerWebsocktServers,publicHttpServer  } from 'api/api'
    import { formateDate } from 'url-config'


    function formatDateTime(inputTime) {
        let date = new Date(inputTime)
        let m = date.getMonth() + 1;  
        m = m < 10 ? ('0' + m) : m;  
        let d = date.getDate();  
        d = d < 10 ? ('0' + d) : d;  
        return m + '-' + d  
    }

    // var sock = new SockJS('http://192.168.0.222:8111/endpointWisely?innId=138');
    // sock.onopen = function() {
    //     console.log('open');
    //     sock.send('test');
    // };
    
    // sock.onmessage = function(e) {
    //     console.log('message', e.data);
    //     sock.close();
    // };
    
    // sock.onclose = function() {
    //     console.log('close');
    // };

    export default {
        name: 'appFooter',
        created() {
            // 今日预离预到
            this.dispatchGetHotelTodayInOrder()
            this.dispatchGetHotelTodayOutOrder()

            // 消息推送
            this.getUnReadMessage({
                messageType: 1,
                pageNum: 1,
                pageSize: this.pageSize
            })
            this.publicSocket = new SockJS(`${this.checkeNvironmentVariable()}:8111/endpointWisely?innId=${getCookie('innId')}`)
            // this.socketConnet(this.publicSocket, '/topic/getResponse')
            this.socketConnet(this.publicSocket, '/user/queue/notifications')

            this.publicSocket.onClose = function() {
                console.log('公有消息socket关闭')
                console.log('再次重新连接')
                this.publicSocket = new SockJS(`${this.checkeNvironmentVariable()}:8111/endpointWisely?innId=${getCookie('innId')}`)
                // this.socketConnet(this.publicSocket, '/topic/getResponse')
                this.socketConnet(this.publicSocket, '/user/queue/notifications')
            }
        },
        components: {
            OrderModal,
            OrderNoticeList,
            NewMessageTip,
            AppModal
        },
        data() {
            return {
                todayOrderModal:true,
                modalData: {
                    type : 1,
                    list : [],
                },
                showOrderNoticeList:false,
                orderNoticeListData: [],
                ftButlerListData: [
                    // {
                    //     id:1,
                    //     title:'直连审核已通过',
                    //     time: '2018-12-08 18:04',
                    //     content: '建立的直连已生效，已关联的房型将自动同步OT连已生效，已关联的房型将自将自动同步OT连已生效，已关联的房型将自将自动同步OT连已生效，已关联的房型将自动同步OT连已关联的房型将自动同步'
                    // }
                ],
                publicSocket:null,
                privateSocket:null,
                // 直连助手
                connectHelperObj: {
                    pageNum: 1,
                    totalPages: 1,
                    nextPage: 1,
                    loading: false
                },
                pageSize: 20,
                totalUnreadMessageCount:0,          //总数
                helperCount:0,                      //直连消息数

                timer:null
            }
        },
        computed: {
            hotelTodayInOrderList() {
                let data = JSON.parse(JSON.stringify(this.$store.state.hotelStatus.hotelTodayInOrderList));
                for(let q = 0;q < data.length;q++){
                    data[q].subTotal = data[q].subTotal/100
                }
                return data;
            },
            hotelTodayOutOrderList() {
                let data = JSON.parse(JSON.stringify(this.$store.state.hotelStatus.hotelTodayOutOrderList));
                for(let q = 0;q < data.length;q++){
                    data[q].subTotal = data[q].subTotal/100
                }
                return data;
            },
            roomIds () {
                return this.$store.getters.roomList.map(item => item.roomId)
            },
            dateList () {
                return this.$store.getters.dateList
            },
            hotelOrderList () {
                return this.$store.getters.hotelOrderList
            },
            userInfo () {
				let userInfo = this.$store.getters.userInfo
				return userInfo
			}
        },
        destroyed () {
            this.publicSocket.close()
        },
        methods: {
            ...mapMutations([
                'setHotelOrderList',
                'setSuborderList'
            ]),
            ...mapActions(['dispatchGetHotelTodayInOrder','dispatchGetHotelTodayOutOrder']),
            openTodayModal(type) {
                let data
                if(type == 1){
                    data = JSON.parse(JSON.stringify(this.hotelTodayInOrderList))
                }else{
                    data = JSON.parse(JSON.stringify(this.hotelTodayOutOrderList))
                }
                for(let q = 0;q < data.length;q++){
                    data[q].checkInAt = formatDateTime(data[q].checkInAt)
                    data[q].checkOutAt = formatDateTime(data[q].checkOutAt)
                    // data[q].orderFrom = '000031'
                }
                this.modalData = {
                    type : type,
                    list : data,
                }
                this.$refs.orderModal.modal = true
            },

            checkeNvironmentVariable() {
                let gBaseUrl = '',
                    hostname = window.location.hostname;
                if (hostname === '192.168.0.222' || hostname === 'localhost' || hostname === '127.0.0.1') {
                    gBaseUrl = 'http://192.168.0.222'
                } else if (hostname === 'dev.wefint.cn' || hostname === 'wefint.cn') {
                    gBaseUrl = 'https://dev.wefint.cn'
                } else {
                    gBaseUrl = 'https://websocket.wefint.com'
                }
                return gBaseUrl
            },

            // 打开消息推送列表
            openOrderNotice () {
                this.showOrderNoticeList = !this.showOrderNoticeList
                this.connectHelperObj = {
                    pageNum: 1,
                    totalPages: 1,
                    nextPage: 1,
                    loading: false
                }
                if(this.showOrderNoticeList){
                    // 获取直连助手数据
                    this.orderNoticeListData = []
                    this.getConnectHelperList({ messageType: 1, pageNum: 1, pageSize: this.pageSize })
                }else{
                    // 消息已读并获取未读消息
                    this.readAllMessage(1).then(result => {
                        this.getUnReadMessage()
                    })
                }
            }, 

            getConnectHelperList (params) {
                /* 获取直连助手数据 */
                let loading = this.connectHelperObj.loading
                if (!loading && this.connectHelperObj.nextPage <= this.connectHelperObj.totalPages) {
                    this.connectHelperObj.loading = true
                    this.getMessageList(params).then(result => {
                        if (result.content && result.code === '000000') {
                            this.readAllMessage(1)
                            this.connectHelperObj.totalPages = result.content.totalPages
                            this.connectHelperObj.pageNum = result.content.pageNum
                            this.connectHelperObj.nextPage = result.content.pageNum + 1
                            if (result.content.pageNum === 1) {
                                this.connectHelperList = []
                            }
                            for(let q = 0;q < result.content.datas.length;q++){
                                result.content.datas[q].messageContent = JSON.parse(result.content.datas[q].messageContent)
                                result.content.datas[q].messageTitle = JSON.parse(result.content.datas[q].messageTitle)
                                result.content.datas[q].nights = this.computedCheckDay(result.content.datas[q].messageContent.start, result.content.datas[q].messageContent.end)
                                result.content.datas[q].createAt = formateDate(new Date()) === formateDate(result.content.datas[q].createAt) ? `今天 ${formateDate(result.content.datas[q].createAt, 'hh:mm')}` : formateDate(result.content.datas[q].createAt, 'MM-dd hh:mm')
                            }
                            // let orderNoticeList = []    //直连助手
                            // let ftButlerList = []       //疯特管家
                            // for(let x = 0;x < result.content.datas.length;x++){
                            //     if(result.content.datas[x].messageType == 1){
                            //         orderNoticeList.push(result.content.datas[x])
                            //     }else{
                            //         ftButlerList.push(result.content.datas[x])
                            //     }
                            // }
                            this.$nextTick(function () {
                                this.orderNoticeListData = this.orderNoticeListData.concat(result.content.datas)
                                this.totalUnreadMessageCount = 0
                                // this.ftButlerListData = ftButlerList
                            })
                        }else{
                            this.$Message.error(result.message)
                        }
                        this.connectHelperObj.loading = false
                    })
                }
            },

            computedCheckDay (startDate, endDate) {
                startDate = +new Date(startDate)
                endDate = +new Date(endDate)
                return (endDate - startDate) / (86400000)
            },

            getMessageList (params) {
                /* 获取消息列表 */
                let defaultParams = {
                    userId: getCookie('userId'),
                    innId: getCookie('innId')
                }
                return footerWebsocktServers.getMessageList({...defaultParams, ...params})
            },

            readAllMessage (messageType) {
                /* 设置已读消息 */
                let params = {
                    userId: getCookie('userId'),
                    innId: getCookie('innId'),
                    messageType
                }
                return footerWebsocktServers.readAllMessage(params)
            },

            getUnReadMessage () {
                /* 获取未读消息 */
                this.getMessageList({
                    pageNum: 1,
                    pageSize: 10,
                    isRead: 0
                }).then(result => {
                    if (result.content && result.code === '000000') {
                        // let list = result.content.datas
                        // for (let i = 0, len = list.length; i < len; i++) {
                        //     let item = list[i]
                        //     item.messageType === 1 ? this.connectHaveUnread = true : this.manageHaveUnread = true
                        // }
                        this.totalUnreadMessageCount = result.content.total
                        this.helperCount = result.content.total
                    }
                })
            },

            getRoomList() {
                let data = {
                    token : common.getToken(),
                    page : this.page,
                    pageSize : this.pageSize
                }
                http.post('/getRoomList',data,function(res){
                    if(res.code == 0){
                        for(let w = 0;w < res.content.length;w++){
                            if(res.content[w].status == 2){
                                res.content.splice(w,1)
                            }
                        }
                    }
                })
            },

            socketConnet (socket, subUrl) {
                let stompClientSelf = Stomp.over(socket);
                stompClientSelf.connect({"innId": getCookie('innId')}, frame => {
                    console.log("=============连接成功============")

                    let dataNew = {
                        id: 922,
                        messageType: 1,
                        messageTitle: "{\"title\":\"您有一条新订单消息\"}",
                        messageContent: "{\"contactName\":\"陈龙1\",\"end\":\"2018-12-25\",\"orderFrom\":6183,\"orderId\":11477,\"orderStatus\":0,\"otaOrderNo\":\"8058161933\",\"remarks\":\"结算总价RMB 67.32元，已减折扣RMB 11.88元（含{出行特惠}11.88元），详细每日价格信息请至EBooking查看;如客人索取发票，请贵酒店开具，金额78.00元。\",\"roomType\":\"超有爱的少女ins风大床房\",\"rooms\":1,\"start\":\"2018-12-24\",\"totalAmount\":7920}",
                        innId: 138,
                        createAt: 1545634676000,
                        topic: 1,
                        deleted: 0,
                        isRead: 0
                    }
                    // setTimeout(() => {
                    //     this.messageCardProcess(dataNew)
                    // },3000)

                    stompClientSelf.subscribe(subUrl, (respnose) => {
                        console.log("=============获取消息============")
                        /* 更新房间订单视图  暂时关闭*/    
                        // 根据返回的订单的id，查询订单的详情,然后添加到房间详情列表，更新房态
                        let orderInfo = JSON.parse(respnose.body)
			            let orderFromList = this.$store.state.orderFromList
                        orderInfo.messageContent = JSON.parse(orderInfo.messageContent)
                        orderInfo.messageTitle = JSON.parse(orderInfo.messageTitle)
                        publicHttpServer.getOrderInforByIdNew(orderInfo.messageContent.orderId).then((res) => {
                            if(res.code === '000000'){
                                let dataInfo = res.content
                                let backupsHotelOrderList = deepCopy(this.hotelOrderList)

                                let needOprMainOrder = mainOrderDataProcess(dataInfo, orderFromList, this.roomIds, this.dateList[0].date)
                                backupsHotelOrderList.push(needOprMainOrder)
                                this.setSuborderList(backupsHotelOrderList)
                                this.setHotelOrderList(backupsHotelOrderList)
                            }
                        })

                        this.messageCardProcess(JSON.parse(respnose.body))
                    });
                });
            },

            messageCardProcess (message) {
                console.log("展示新消息")
                /* 处理获取到的消息 */
                message.messageContent = JSON.parse(message.messageContent)
                message.messageTitle = JSON.parse(message.messageTitle)
                message.isRead = 0
                message.nights = this.computedCheckDay(message.messageContent.start, message.messageContent.end)
                this.$refs.NewMessageTip.pushArr(message)
                // this.$root.Bus.$emit('socket-update-order', message)
                if (message.messageType === 1) {
                    this.orderNoticeListData.unshift(message)
                }
                // if(message.innId == this.userInfo.innId){
                    this.totalUnreadMessageCount++
                // }
                setTimeout(() => {
                    this.autoCloseInfoCard()
                }, 5000)
            },
            
            // 自动关闭消息弹窗
            autoCloseInfoCard () {
                let messageArr = this.$refs.NewMessageTip.messageArr
                if(this.$refs.NewMessageTip.mouseEnterFlag){
                    return
                }

                if (messageArr.length) {
                    // let id = messageArr[0].id
                    // let el = $("#dom0")[0]
                    // el && (el.style.opacity = 0)
                    setTimeout(() => {
                        messageArr.splice(0, 1)
                    },10)
                    console.log("关闭消息")
                }
            },

            onScroll (event) {
                let target = event.target
                if (target.scrollHeight - target.scrollTop === 360) {
                    this.getConnectHelperList({
                        messageType: 1,
                        pageNum: this.connectHelperObj.nextPage,
                        pageSize: this.pageSize
                    })
                }
            },
        }
    }
</script>

<style lang="scss">
    .app-footer {
        position: absolute;
        bottom: 0;
        background: #89A0B1;
        width: 100%;
        height: 40px;
        padding-left: 30px;
        .today-order {
            line-height: 39px;
            li {
                display: inline-block;
                background: #7E96A9;
                font-size: 14px;
                color: white;
                padding: 0 10px;
                margin: 0 10px;
                cursor: pointer;
            }
        }
        .remind {
            user-select: none;
            position: absolute;
            right: 0;
            top: 0;
            line-height: 39px;
            background: #7E96A9;
            text-align: center;
            width: 80px;
            cursor: pointer;
            .remind-badge {
                border: 0;
                height: 17px;
                line-height: 17px;
                padding: 0 4px;
                box-shadow: 0 0 0 1px transparent;
            }
        }
    }
</style>
