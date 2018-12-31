<!-- header/订单搜素 -->
<style lang='scss'>
	.head-search {
		font-size:12px;
		color:#666666;
		.s-row-line {
			line-height:28px;
		}
		.order {
			padding: 7px 10px; 
			background:rgba(250,250,250,1);
			border-radius:4px;
			margin-bottom: 5px;
		}
		.order:hover {
			background:rgba(237,237,237,1);
			cursor: pointer;
		}
		.s-row-cont {
			display: flex;
			justify-content:space-between;
		}
		.count {
			text-indent: 10px;
			height: 30px;
			line-height: 40px;
			font-family:MicrosoftYaHei;
			color:rgba(102,102,102,1);
		}
		.name {
			color: #2F6CA3;
			font-size: 14px;
			line-height: 28px;
			display:inline-block; 
			max-width: 150px;

		}
		.phone {
			color: #999999;
			display:inline-block; 
			line-height: 28px;
			margin-left: 5px;
			vertical-align: top;
		}
		.order-type {
			padding: 0px 8px;
			color: #fff;
			border-radius:6px;
			line-height:22px;
			height: 22px;
			
		}
		.money {
			font-size:14px;
			font-family:MicrosoftYaHei;
			color:rgba(225,84,76,1);
		}
		.ivu-icon-md-moon:before {
			color:#DFCB99;
			font-size:14px;
		}
	}
</style>
<template>
	<div class='head-search' >
		<div class='count'>共 <span style="color: #E1544C">{{searchList.length}}</span> 条结果</div>
		<ul style="padding: 10px 6px;">
			<li v-for='item in searchList' class="order" @click.stop='showDetail(item.orderId)' :key="item.id">
				<div class="">
					<div class="s-row-cont" >
						<div >
							<div class="name text-break-1">{{item.contactName}}</div>
							<div class="phone ">{{item.contactPhone}}</div>
						</div>
						<div class="s-row-cont" >
							<!-- 0 预定 1 入住 2 退房 3 取消 -->
							<div class="order-type"  :style="{background: searchStatus(item.status).btnColor,boxShadow: searchStatus(item.status).btnShadow }">{{searchStatus(item.status).btnText}}</div>
						</div>
					</div> 
				</div>
				<div class="s-row-line">
					<div>
						<span>{{item.roomNo}}</span>
						<span>{{item.roomTypeName}}</span>
					</div>
				</div>
				<div class="s-row-line s-row-cont">
					<div>{{item.checkInAt}} ~ {{item.checkOutAt}}</div>
					<div><Icon type="md-moon" style="margin-right:2px" />{{item.nights}}晚</div>
				</div>
				<div class="s-row-line s-row-cont">
					<div >订单号：{{item.orderId}}</div>
					<div class="money">￥{{item.subTotal}}</div>
				</div>
			</li>
			<li v-if="!searchList.length" style="text-align: center;">
				什么都没有搜到！
			</li>
		</ul>
	</div>
</template>
<script>
	import {hotelStatusApiSercers} from '../../../entries/hotelStatus/api/API.js' 
	export default {
		name:'Serach',
		props: ['searchList'],
		data () {
			return {

			}
		},
		methods: {
			showDetail (orderId) {
				hotelStatusApiSercers.getOrderInfoByOrderId(orderId).then(result => {
	                if (result.content && result.code === '000000') {
	                    this.$root.Bus.$emit('on-bus-look-order-detail', result.content, 'look')
	                }
	            })
				
			},
			searchStatus (status) {
				switch (status) {
					case 0 : return {
							btnColor: 'linear-gradient(225deg,rgba(249,191,123,1) 0%,rgba(234,154,112,1) 100%)',
							btnShadow: '2px 2px 6px 0px rgba(234,154,112,0.36)',
							btnText: '预定',
					    }
					case 1 : return {
							btnColor:'linear-gradient(225deg,rgba(91,168,244,1) 0%,rgba(31,135,237,1) 100%)',
							btnShadow: '2px 2px 6px 0px rgba(0,140,247,0.3)',
							btnText: '入住',
						}
					case 2 : return {
							btnColor: 'linear-gradient(270deg,rgba(193,211,223,1) 0%,rgba(154,167,193,1) 100%)',
							btnShadow: '0px 2px 9px 0px rgba(76,136,152,0.15)',
							btnText: '退房',
						}
					case 3 : return {
							btnColor: 'linear-gradient(270deg,rgba(193,211,223,1) 0%,rgba(154,167,193,1) 100%)',
							btnShadow: '0px 2px 9px 0px rgba(76,136,152,0.15)',
							btnText: '取消',
					}
				}
			},
			
		}
	}
</script>
