/**
 * Created with fly.
 * User: z1163764648@qq.com
 * Date: 18-5-17
 * Time: 下午12:19
 *
 */
// import {dateCalculation, deepCopy} from 'common_libs/util.js'
// import $ from 'jquery'
import publicMutations from 'common_store/mutations'

export default {
    ...publicMutations,
    // 当前日期选择类型
    CURDATE(state, params) {
        state.curDateType = params
    },
    // 初始化以及时间选择适合的时间戳
    INITTIMESTAMP (state, params) {
        state.timeStamps = params
    },
    INITTIMESTAMPMONTH(state, params) {
        state.timeStampsMonth = params
    },
    // 收支流水表/支付流水
    GETEARNANDPAY (state, payload) {
        state.earnAndPay = payload
    },
    //收支流水/收支明细详情
    GETFINANCAILDETAIL (state, payload) {
        state.financialDetail = payload
    },
    //收支流水/查询对应支付方式收支明细详情
    GETFINANCAILPayWayDETAIL (state, payload) {
        state.financialPayWayDetail = payload
    },
    //收支下拉列表渠道过滤
    SETCHANELIDS (state, payload) {
        state.channelArr = payload
        // console.log(777, payload)
    },
    // 收支流水饼状图数据
    GETPAYWAYPIECHART(state, params) {
        state.paywayPieChart = params
    },
    // 收支流水柱状图数据
    GETPAYWAYBARGRAPH(state, params) {
        state.paywayBarChart = params
    },


    // 渠道

    // 渠道日期选择类型
    CHANNELDATE(state, params) {
        state.channelDateType = params
    },
    // 初始化以及时间选择的时间戳
    TIMESTAMPSCHANNEL (state, params) {
        state.timeStampsChannel = params
    },

    // 渠道应收款
    GETCHANNELRELIST(state, params) {
        state.channelReList = params
    },
    // 渠道日应收款
    GETCHANNELDAYRELIST(state, params) {
        state.channelDayReList = params
    },
    // 渠道订单详情
    GETCHANNELORDERDETAILLIST(state, params) {
        state.channelOrderDetailList = params
    },
    // 渠道日应收ID集合
    CHANNELDAYIDS(state, params) {
        // type : 1 => 添加id   2 => 删除id  3 => 清空id
        if(params.type == 1){
            state.channelDayIds.push(params.id)
        }else if(params.type == 2){
            let index = state.channelDayIds.indexOf(params.id)
            state.channelDayIds.splice(index,1)
        }else{
            state.channelDayIds = []
        }
       
    },
    // 渠道订单详情ID集合
    CHANNELORDERINFOIDS(state, params) {
        // type : 1 => 添加id   2 => 删除id  3 => 清空id
        if(params.type == 1){
            state.channelOrderInfoIds.push(params.id)
        }else if(params.type == 2){
            let index = state.channelOrderInfoIds.indexOf(params.id)
            state.channelOrderInfoIds.splice(index,1)
        }else{
            state.channelOrderInfoIds = []
        }
    },
}
