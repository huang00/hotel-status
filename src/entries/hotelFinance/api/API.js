/* eslint-disable*/

import { getCookie } from 'common_libs/util';
import {Message} from 'iview';

/**
 * 客栈管理系统
 * @type {{findRegisterUser: (function(*=)), findUserByName: (function(*=)), editUserInfo: (function(*=)), freezeAccount: (function(*=))}}
 */

// const financeBaseURL = '/linen';
// 财务接口
export let financeApiService = {
    //  收支流水表/支付流水
    getEarnAndPayServic: (param) => {
        return httpRequestor.post('/statis/payway/reportForms', param).catch(err => {
            console.log('请检查网络环境', err);
            Message.error('服务器请求失败，请检查网络环境。')
        })
    },
     /* 收支流水表/支付流水/导出 */          
    exportOrderEarnAndPay: (param) => {
        return httpRequestor.filePost('/statis/payway/reportFormsExport', param).catch(err => {
            console.log('请检查网络环境', err);
            Message.error('服务器请求失败，请检查网络环境。')
        })
    },
    //  收支流水表/收支明细
    getFinancailDetailServic: (param) => {
        return httpRequestor.post('/statis/payway/reportFormsDetails', param).catch(err => {
            console.log('请检查网络环境', err);
            Message.error('服务器请求失败，请检查网络环境。')
        })
    },
    /* 收支流水表/收支明细/导出 */          
    exportOrderFinancailDetail: (param) => {
        return httpRequestor.filePost('/statis/payway/reportFormsDetailsExport', param).catch(err => {
            console.log('请检查网络环境', err);
            Message.error('服务器请求失败，请检查网络环境。')
        })
    },
     /* 收支流水表/收支明细/渠道过滤*/          
    financailDetailFilterChannel: (param) => {
        return httpRequestor.post('/statis/payway/reportChannelDetails', param).catch(err => {
            console.log('请检查网络环境', err);
            Message.error('服务器请求失败，请检查网络环境。')
        })
    },
    /* 获取收支饼状图数据 */
    getPaywayPieChartServic: (param) => {
        return httpRequestor.post('/statis/payway/pieChart', param).catch(err => {
            console.log('请检查网络环境', err);
            Message.error('服务器请求失败，请检查网络环境。')
        })
    },

    /* 获取收支柱状图数据 */
    getPaywayBarGraphServic: (param) => {
        return httpRequestor.post('/statis/payway/barGraph', param).catch(err => {
            console.log('请检查网络环境', err);
            Message.error('服务器请求失败，请检查网络环境。')
        })
    },
    
    /* 渠道应收款列表 */
    getChannelReListServic: (param) => {
        return httpRequestor.post('/statis/channel/receivable/list', param).catch(err => {
            console.log('请检查网络环境', err);
            Message.error('服务器请求失败，请检查网络环境。')
        })
    },

    /* 渠道每日应收款列表 */
    getChannelDayReListServic: (param) => {
        return httpRequestor.post('/statis/channel/day/receivable/list', param).catch(err => {
            console.log('请检查网络环境', err);
            Message.error('服务器请求失败，请检查网络环境。')
        })
    },

    /* 渠道订单明细列表 */
    getChannelOrderDetailListServic: (param) => {
        return httpRequestor.post('/statis/channel/order/detail/list', param).catch(err => {
            console.log('请检查网络环境', err);
            Message.error('服务器请求失败，请检查网络环境。')
        })
    },

    /* 渠道订单明细导出 */          
    exportOrderListServic: (param) => {
        return httpRequestor.filePost('/statis/channel/order/detail/list/export', param).catch(err => {
            console.log('请检查网络环境', err);
            Message.error('服务器请求失败，请检查网络环境。')
        })
    },

    /* 根据订单id获取订单详情 */          
    byIdGetOrderInfoServic: (param) => {
        return httpRequestor.get('/order/get/'+param).catch(err => {
            console.log('请检查网络环境', err);
            Message.error('服务器请求失败，请检查网络环境。')
        })
    },

    /* 更新订单 */
    updateOrderInfoServic: (param) => {
        return httpRequestor.post('/order/saveOrder', param).catch(err => {
            console.log('请检查网络环境', err);
            Message.error('服务器请求失败，请检查网络环境。')
        })
    },

    /* 渠道订单明细列表应收房费总金额 */
    getDetailTotalAmountServic: (param) => {
        return httpRequestor.post('/statis/channel/order/detail/totalAmount/get', param).catch(err => {
            console.log('请检查网络环境', err);
            Message.error('服务器请求失败，请检查网络环境。')
        })
    },

    /* 渠道日应收订单明细获取自定义渠道 */
    getOrderCustomChannelServic: (param) => {
        return httpRequestor.post('/statis/channel/order/detail/CustomChannel/get', param).catch(err => {
            console.log('请检查网络环境', err);
            Message.error('服务器请求失败，请检查网络环境。')
        })
    },
};
