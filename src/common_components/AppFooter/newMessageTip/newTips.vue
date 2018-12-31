/***
*footer 有下角新消息提示
****/
<template>
    <div >
       <div :class="['tips-contant']" v-for='(item, index) in messageArr'  :id="'dom' + index "  :style="{bottom: bottomPosition(index, item) + 'px' }">
       		<Card  :bordered="false" class="card">
	        	<span class="close-it" @click='close(index)'>×</span>
	            <div style="margin-bottom: 10px">
	            	<span class="tip-flag" :style="{background: typeFunc(item.type).orderTypeBgColor, boxShadow: typeFunc(item.type).orderTypeShadow}">···</span>
	            	<!--您有一个新增订单  您有一个订单已被修改  您有一个订单已被取消-->
	            	<span class="order-type"  :style="{color: typeFunc(item.type).color}">{{typeFunc(item.type).detailText}}</span>
	            	<span class="look-detail" @click='lookDetial(item.orderId)'>查看详情 <Icon type="ios-arrow-forward"  class='self-arrow' /></span>
	            </div>
	            <div class="detail" :style="{background:typeFunc(item.type).detailBg }">
					<div class="display self-row">
						<div> 
							<span>订单号：{{item.orderId}}</span>
							<span class="pre" :style="{background: statusFunc(item.status).bgColor,boxShadow:statusFunc(item.status).bgShadow}">{{statusFunc(item.status).textType}}</span>	
						</div>
						<div>{{item.contactName}}</div>
					</div>
					<div class="self-row">
						<span>{{item.roomTypeName}}</span>
						<span>{{item.roomNo}}</span>
					</div>
					<div class="display self-row">
						<div>
							<span>2018-10-25 ~ 2018-10-27</span>
							<Icon style='color:#DFCB99; margin-left: 20px' type="md-moon" />
							<span>{{item.nights}}晚</span>
						</div>
						<div :class="['channel-logo', getChannelFrom(item.channelCode).className]"></div>
					</div>            	
	            </div>
	        </Card>
       </div>
    </div>
</template>
<script>
import {
        getChannelFrom
    } from 'common_libs/util'
import {hotelStatusApiSercers} from '../../../entries/hotelStatus/api/API.js'    
export default {
	name: 'newTips',
	data () {
		return {
			getChannelFrom,
			messageArr: [
				{
					channelName: "自来客",
					checkInAt: 1545019200000,
					checkOutAt: 1545278400000,
					contactName: "周公子11111",
					contactPhone: "",
					id: 12652,
					nights: 3,
					orderId: 2786,
					otaOrderNo: null,
					roomNo: "1间101",
					roomTypeName: "豪华房",
					status: 0,
					subTotal: 50000,
					channelCode: '000001',
					type: 'add',
				},
				{
					channelName: "自来客",
					checkInAt: 1545019200000,
					checkOutAt: 1545278400000,
					contactName: "dawn2222",
					contactPhone: "",
					id: 12653,
					nights: 2,
					orderId: 2881,
					otaOrderNo: null,
					roomNo: "102",
					roomTypeName: "cc",
					status: 2,
					subTotal: 30000,
					channelCode: '000031',
					type: 'edit',
				},
				{
					channelName: "自来客",
					checkInAt: 1545019200000,
					checkOutAt: 1545278400000,
					contactName: "dawn33333",
					contactPhone: "",
					id: 12654,
					nights: 2,
					orderId: 2880,
					otaOrderNo: null,
					roomNo: "105",
					roomTypeName: "dd",
					status: 2,
					subTotal: 30000,
					channelCode: '000041',
					type: 'cancel',
				}
			]
		}
	},
	mounted () {
		// 最早的消息显示最上层
		this.messageArr.reverse()
		this.pushArr()
	},
	watch: {
		// 逐条删除messageArr数据
		messageArr (val, oldVal) {
			if (val.length > 0) {
				setTimeout( () => {
					// this.messageArr.pop()
				}, 3000)
			}
		},
	},
	methods: {
		//test 新消息来
		pushArr () {
			var _this = this
			sleep(2000)
			function sleep(numberMillis) {
				// console.log(140)
			    var now = new Date();
			    var exitTime = now.getTime() + numberMillis;
			    while (true) {
			        now = new Date();
			        if (now.getTime() > exitTime) {
			        	_this.messageArr.unshift({
							channelName: "自来客" ,
							checkInAt: 1545019200000,
							checkOutAt: 1545278400000,
							contactName: "fffff",
							contactPhone: "",
							id: 12654,
							nights: 2,
							orderId: 10060,
							otaOrderNo: null,
							roomNo: "105",
							roomTypeName: "dd",
							status: 2,
							subTotal: 30000,
							channelCode: '000003',
							type: 'cancel',
						})
			            return;
			        }
			    }
			}
		},
		//查看详情
		lookDetial (orderId) {
			//test 新消息来
			// this.pushArr()
			// let orderId = '2786'
			hotelStatusApiSercers.getOrderInfoByOrderId(orderId).then(result => {
                if (result.content && result.code === '000000') {
                    this.$root.Bus.$emit('on-bus-look-order-detail', result.content, (res) => {
                        console.log('订单详情')
                    })
                }else{
                    this.$Message(result.message)
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
			let num = index - this.messageArr.length
			return num * (-10) + 49 
		},
		/*type: add  edit cancel*/
		typeFunc (type) {
			switch (type) {
				case 'add' : return {
					orderTypeBgColor: 'linear-gradient(225deg,rgba(91,168,244,1) 0%,rgba(31,135,237,1) 100%)',    /*tip-flag背景颜色*/
					orderTypeShadow: '2px 2px 6px 0px rgba(0,140,247,0.3)',    /* tip-flag背景阴影*/
					orderTypeColor: '#008CF7',    /*tip-flag 消息类型文本颜色*/
					color: '#008CF7',    /*您有一个 xx 订单文本颜色*/
					detailText: '您有一个新增订单',    /*订单类型文本*/
					detailBg:  'rgba(245,249,250,1)',   /*消息主体框背景色*/
				}
				case 'edit' : return {
					orderTypeBgColor: 'linear-gradient(231deg,rgba(255,210,90,1) 0%,rgba(255,175,45,1) 100%)',
					orderTypeShadow: '2px 2px 6px 0px rgba(245,166,35,0.34)' ,
					orderTypeColor: '#F5A623', 
					color:'#F5A623',
					detailText: '您有一个订单已被修改',
					detailBg:  'rgba(254,252,248,1)',
				}
				case 'cancel' : return {
					orderTypeBgColor: '#EAEAEA',
					orderTypeColor: '#000',
					color:'#000',
					detailText: '您有一个订单已被取消',
					detailBg: 'rgba(254,252,248,1)',

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
			}
		},
	},
}
</script>
<style lang="scss">
	.tips-contant {
        /* bottom: 50px; */
        right: 20px;
        position: fixed;
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
        	padding: 10px;
        	color: #666;
        	.display {
        		display:flex;
        		justify-content: space-between;
        	}
        	.self-row {
        		line-height: 30px;
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