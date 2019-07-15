import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import hotelFinance from './modules/state'
import publicState from 'common_store/state'

Vue.use(Vuex)

// 格式化为页面显示时间
function timestampToTime(date) {
    var now = new Date(date);
    var yy = now.getFullYear();      //年
    var mm = now.getMonth() + 1;     //月
    var dd = now.getDate();          //日
    var clock = yy + "/";
    if(mm < 10) clock += "0";
    clock += mm + "/";
    if(dd < 10) clock += "0";
    clock += dd + "";
    return clock
}

const state = {
    ...publicState,
    // 收支流水
    curDateType: 1, //收支总览日期选择类型（日/月/年） 默认值为 1(日),2(月)
    timeStamps: [], // start and end timeStamps arr
    timeStampsMonth: [], // start and end timeStamps arr
    paywayPieChart: [],     //收支饼状图数据
    paywayBarChart: [],     //收支柱状图数据
    

    // 渠道对账
    channelDateType: 1,                 //渠道日期选择类型     默认值为1(按退房日期)，2(按入住日期)
    timeStampsChannel: [new Date(new Date().setDate(1)).getTime(),new Date().getTime()],              //渠道日期 开始已经结束日期

    channelDayIds: [],                   //渠道日应收ID集合
    channelOrderInfoIds: [],             //渠道订单明细ID集合

    channelReList: [],                  //渠道应收款
    channelDayReList: {
        datas:[],
        total:0
    },                                  //渠道日应收
    channelOrderDetailList: {
        datas:[],
        total:0
    },         //渠道订单详情

    // 收支以及明细
    channelArr:[],
    earnAndPay: {
        lists:[],
        total:0,
    },
    financialDetail: {
        lists:[],
        total:0,
    },
    financialPayWayDetail: {
        lists:[],
        total:0,
    },
    earnAndPayList:[],//支付方式流水
    earnAndPayListTotal: null,//支付方式流水
    financialDetailList:[],//收支明细详情
    financialDetailListTotal:null,//收支明细详情

}
const store = new Vuex.Store({
    strict: window.gDevEnv,
    state,
    getters,
    actions,
    mutations,
    modules: {
        hotelFinance
    }
})

// 让vuex支持webpack热更新
if (module.hot) {
    module.hot.accept([
        // state不支持热更新
        './getters',
        './actions',
        './mutations',
        './modules/state',
    ], () => {
        store.hotUpdate({
            // 获取更新后的模块。因为 babel 6 的模块编译格式问题，这里需要加上 .default
            getters: require('./getters').default,
            actions: require('./actions').default,
            mutations: require('./mutations').default,
            modules: {
                events: require('./modules/state').default,
            }
        })
    })
}

export default store
