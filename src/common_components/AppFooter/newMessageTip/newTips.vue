/***
*footer 有下角新消息提示
****/
<template>
    <div >
       <div :class="['tips-contant']"  v-for='(item, index) in messageArr'  :id="'dom' + index "  :ref="'card' + item.id" :style="{bottom: bottomPosition(index, item) + 'px' }" @mouseenter="mouseenterCard" @mouseleave="mouseleaveCard">
       		<Card  :bordered="false" class="card">
	        	<span class="close-it" @click='close(index)'>×</span>
	            <div style="margin-bottom: 10px">
	            	<span class="tip-flag" :style="{background: typeFunc(item.topic).orderTypeBgColor, boxShadow: typeFunc(item.topic).orderTypeShadow}">···</span>
	            	<!--您有一个新增订单  您有一个订单已被修改  您有一个订单已被取消-->
	            	<span class="order-type"  :style="{color: typeFunc(item.topic).color}">{{returnHotelName(item.innId)}} {{typeFunc(item.topic).detailText}} ！</span>
	            	<span class="look-detail" @click='lookDetial(item)'>查看详情 <Icon type="ios-arrow-forward"  class='self-arrow' /></span>
	            </div>
	            <div class="detail" :style="{background:typeFunc(item.topic).detailBg }">
					<div class="display self-row">
						<div> 
							<span>订单号：{{item.messageContent.orderId}}</span>
							<span class="pre" :style="{background: statusFunc(item.messageContent.orderStatus).bgColor,boxShadow:statusFunc(item.messageContent.orderStatus).bgShadow}">{{statusFunc(item.messageContent.orderStatus).textType}}</span>	
						</div>
						<div class="contactName">{{item.messageContent.contactName}}</div>
					</div>
					<div class="self-row">
						<span>{{item.messageContent.roomType}}</span>
						<span>{{item.messageContent.rooms}}</span>
					</div>
					<div class="display self-row">
						<div>
							<span>{{item.messageContent.start}} ~ {{item.messageContent.end}}</span>
							<Icon class="moon" type="md-moon" />
							<span class="nights">{{item.nights}}晚</span>
						</div>
						<div :class="['channel-logo', getChannelFrom(returnChannelCode(item.messageContent.orderFrom).channelCode).className]">
							<template v-if="!getChannelFrom(returnChannelCode(item.messageContent.orderFrom).channelCode)">
								{{returnChannelCode(item.messageContent.orderFrom).channelName?returnChannelCode(item.messageContent.orderFrom).channelName:'无'}}
								<!-- {{item.channelName.substring(0, 1)}} -->
							</template>
						</div>
						<!-- <div :class="['channel-logo', getChannelFrom(item.orderFrom).className]"></div> -->
					</div>            	
	            </div>
	        </Card>
       	</div>
	    <Modal v-model="modal2">
            <p slot="header" style="text-align:center">
                <Icon type="information-circled"></Icon>
                <span style="font-size:18px;">提示</span>
            </p>
            <div style="text-align:center">
                <p style="font-size:16px;color:#000">是否切换到 <span style="color:#235f92">{{returnHotelName(changeData.innId)}}</span> 门店查看？</p>
            </div>
            <div slot="footer">
                <i-button type="warning" size="large" @click="modal2 = false">取消</i-button>
                <i-button type="primary" size="large" @click="switchHotel">确定</i-button>
            </div>
        </Modal>
    </div>
</template>
<script>
import {
		getChannelFrom,
		setCookie
    } from 'common_libs/util' 
import {
	hotelStatusApiSercers
} from 'hotelStatus/api/API'
import {
	publicHttpServer
} from '@/api/api'
export default {
	name: 'newTips',
	data () {
		return {
			getChannelFrom,
			messageArr: [],
			mouseEnterFlag:false,
			modal2:false,
			changeData:{}
		}
	},
	mounted () {
		// 最早的消息显示最上层
		this.messageArr.reverse()
	},
	watch: {
	},
	computed: {
		hotelList () {
			let hotelList = this.$store.getters.hotelList
			return hotelList
		},
		userInfo () {
			let userInfo = this.$store.getters.userInfo
			return userInfo
		}
	},
	methods: {
		//test 新消息来
		pushArr (message) {
			var _this = this
			sleep(10)
			function sleep(numberMillis) {
				// console.log(140)
			    var now = new Date();
			    var exitTime = now.getTime() + numberMillis;
			    while (true) {
			        now = new Date();
			        if (now.getTime() > exitTime) {
			        	// _this.messageArr.unshift({
						// 	channelName: "自来客" ,
						// 	checkInAt: 1545019200000,
						// 	checkOutAt: 1545278400000,
						// 	contactName: "fffff",
						// 	contactPhone: "",
						// 	id: 12654,
						// 	nights: 2,
						// 	orderId: 10060,
						// 	otaOrderNo: null,
						// 	roomNo: "105",
						// 	roomTypeName: "dd",
						// 	status: 2,
						// 	subTotal: 30000,
						// 	channelCode: '000003',
						// 	type: 'cancel',
						// })
						_this.messageArr.push(message)
			            return;
			        }
			    }
			}
		},
		//查看详情
		lookDetial (item) {
			let orderId = item.messageContent.orderId
			// 不是当前客栈的订单
			if(item.innId != this.userInfo.innId){
				this.changeData = item;
				this.modal2 = true;
				return;
			}
			//取消的订单无法点击
			if(item.topic == 2){
				this.$Message.error('取消的订单无法查看！')
				return
			}
			hotelStatusApiSercers.getOrderInfoByOrderId(orderId).then(result => {
                if (result.content && result.code === '000000') {
                    this.$root.Bus.$emit('on-bus-look-order-detail', result.content,'look', (res) => {
                        console.log('订单详情')
                    })
                }else{
                    this.$Message.error(result.message)
                }
            })
		},
		//关闭按钮
		close (index) {
			this.messageArr.map((item, i) => {
				if (i == index) {
					this.messageArr.splice(i,1)
				}
			})
		},
		//每条信息距离底部的位置
		bottomPosition (index, item) {
			let num = this.messageArr.length - index - 1
			return num * 145 + 60
		},
		/*type: add  edit cancel*/
		typeFunc (type) {
			switch (type) {
				case 1 : return {
					orderTypeBgColor: 'linear-gradient(225deg,rgba(91,168,244,1) 0%,rgba(31,135,237,1) 100%)',    /*tip-flag背景颜色*/
					orderTypeShadow: '2px 2px 6px 0px rgba(0,140,247,0.3)',    /* tip-flag背景阴影*/
					orderTypeColor: '#008CF7',    /*tip-flag 消息类型文本颜色*/
					color: '#008CF7',    /*您有一个 xx 订单文本颜色*/
					detailText: '有一个新增订单',    /*订单类型文本*/
					detailBg:  'rgba(245,249,250,1)',   /*消息主体框背景色*/
				}
				case 2 : return {
					orderTypeBgColor: '#EAEAEA',
					orderTypeColor: '#000',
					color:'##666',
					detailText: '有一个订单已被取消',
					detailBg: 'rgba(250,250,250,1)',

				}
				case 3 : return {
					orderTypeBgColor: 'linear-gradient(231deg,rgba(255,210,90,1) 0%,rgba(255,175,45,1) 100%)',
					orderTypeShadow: '2px 2px 6px 0px rgba(245,166,35,0.34)' ,
					orderTypeColor: '#F5A623', 
					color:'#43BD64',
					detailText: '有一个订单已被修改',
					detailBg:  'rgba(254,252,248,1)',
				}
			}
		},
		/*status : 0 == 预定 1 == 入住 2 == 入住*/
		statusFunc (status) {
			switch (status) {
				case 0 : return {
					bgColor: 'linear-gradient(231deg,rgba(255,210,90,1) 0%,rgba(255,175,45,1) 100%)',    /*订单类型 角标背景色*/
					bgShadow: '2px 2px 6px 0px rgba(245,166,35,0.34)',
					textType: '预',
				} 
				case 1 : return {
					bgColor: 'linear-gradient(225deg,rgba(91,168,244,1) 0%,rgba(31,135,237,1) 100%)',
					bgShadow: '2px 2px 6px 0px rgba(0,140,247,0.3)' ,
					textType: '住' ,
				}  
				case 2 : return {
					bgColor: 'linear-gradient(225deg,rgba(91,168,244,1) 0%,rgba(31,135,237,1) 100%)',
					bgShadow: '2px 2px 6px 0px rgba(0,140,247,0.3)' ,
					textType: '住',
				}
				case 3 : return {
					bgColor: 'linear-gradient(225deg,rgba(91,168,244,1) 0%,rgba(31,135,237,1) 100%)',
					bgShadow: '2px 2px 6px 0px rgba(0,140,247,0.3)' ,
					textType: '住',
				}
			}
		},
		mouseenterCard() {
			this.mouseEnterFlag = true
		},
		mouseleaveCard() {
			this.mouseEnterFlag = false
			setTimeout(() => {
				this.$parent.autoCloseInfoCard()
			}, 5000)
		},

		// 根据渠道daid返回渠道信息
		returnChannelCode(id) {
			let list = this.$store.state.orderFromList
			let result = { channelCode: '',channelName:'' }
			for(let z = 0;z < list.length;z++){
				if(id == list[z].id){
					result = list[z]
				}
			}
			return result
		},

		// 返回客栈名
		returnHotelName(id) {
			let hotelList = this.hotelList;
			let res = ''
			for(let z = 0;z < hotelList.length;z++){
				if(id == hotelList[z].innId){
					res = hotelList[z].innName
				}
			}
			return res
		},

		// 切换客栈
		switchHotel () {
			publicHttpServer.switchHotel({
				innId: this.changeData.innId
			}).then(res => {
				if (res.code === '000000' && res.content) {
					let { token, innId, userId } = res.content
					setCookie('token', token)
					setCookie('innId', innId)
					setCookie('userId', userId)
					window.location.reload()
				}else{
					alert(res.message)
				}
			})
		}
	},
}
</script>
<style lang="scss">
	.tips-contant {
		transition: all 1s;
        /* bottom: 50px; */
        right: 20px;
		position: fixed;
		z-index: 101;
        /* border: 1px solid blue; */
        width: 485px;
		border-radius:4px;
        box-shadow:2px 2px 8px 0px rgba(0,0,0,0.12);
        .card{
            /* border: 1px solid red; */
        }
        .tip-flag {
        	display: inline-block;
        	vertical-align: middle;
        	width:16px;
			height:14px;
			font-size: 12px;
			color: #fff;
			font-weight: 600;
			text-align:center;
			line-height: 14px;
			background:linear-gradient(225deg,rgba(91,168,244,1) 0%,rgba(31,135,237,1) 100%);
			box-shadow:2px 2px 8px 0px rgba(0,0,0,0.12);
			border-radius:4px;
        }
        .order-type {
        	font-size: 14px;
			margin: auto 10px;
			margin-left: 4px;
        }
        .look-detail {
        	color: #999;
        	font-size: 12px;
        	cursor: pointer;
        }
        .self-arrow {
        	color: #999;
        	vertical-align: text-top;
        	font-size: 14px;
        }
        .close-it{
			position: absolute;
			display: inline-block;
			right: 3px;
			top: 4px;
			width:18px;
			height:18px;
			text-align: center;
			line-height: 18px;
			font-size: 18px;
			font-weight: 500;
			color: #D8D8D8;
			cursor: pointer;
        }
        .detail {
        	padding: 3px 10px;
			color: #666;
			font-size: 12px;
			color: #666666FF;
        	.display {
        		display:flex;
        		justify-content: space-between;
        	}
        	.self-row {
				line-height: 24px;
				.contactName{
					color: #999999FF
				}
				.nights{
					color: #666666FF;
					font-weight:600;
				}
				.moon{
					color:#DFCB99;
					margin-left: 20px;
					margin-top:-2px
				}
        	}
        	.channel-logo {
        		width: 24px;
				height:24px;
				background-color:rgba(234,234,234,1);
				border-radius: 12px;
        	}
        	.pre {
        		width:22px;
				height:22px;
				color: #fff;
				text-align: center;
				line-height: 22px;
				border-radius:6px;
				font-size:12px;
				margin-left: 5px;
        		display:inline-block;
				font-family:MicrosoftYaHei;
        	}
        }
    }
</style>