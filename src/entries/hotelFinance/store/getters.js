/**
 * Created with fly.
 * User: z1163764648@qq.com
 * Date: 18-5-17
 * Time: 上午10:47
 *
 */
import publicGtters from 'common_store/getters'

export default {
    ...publicGtters,
    curDateType: (state) => state.curDateType,                          // 收支流水日流水、月流水类型
    timeStamps: (state) => state.timeStamps,                            // 收支流水开始结束时间
    timeStampsMonth: (state) => state.timeStampsMonth,                            // 收支流水开始结束时间
    paywayPieChart: (state) => state.paywayPieChart,                    // 收支饼状图数据
    paywayBarChart: (state) => state.paywayBarChart,                    // 收支柱状图数据
    earnAndPay: (state) => state.earnAndPay,                    	// 收支流水
    financialDetail: (state) => state.financialDetail,                    // 收支流水明细
    financialPayWayDetail: (state) => state.financialPayWayDetail,                    // 收支流水明细
    channelArr: (state) => state.channelArr,                    // 收支流水明细
    
    
    channeldate: (state) => state.channelDateType,                      // 渠道日期选择类型
    timeStampsChannel: (state) => state.timeStampsChannel,              // 渠道开始时间、结束时间
    channelReList: (state) => state.channelReList,                      // 渠道应收款
    channelDayReList: (state) => state.channelDayReList,                // 渠道日应收款
    channelOrderDetailList: (state) => state.channelOrderDetailList,    // 渠道订单详情
    channelDayIds: (state) => state.channelDayIds,                      // 渠道日应收ID集合
    channelOrderInfoIds: (state) => state.channelOrderInfoIds,          // 渠道订单详情ID集合
}

