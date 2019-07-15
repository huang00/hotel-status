/* eslint-disable*/

import { getCookie } from 'common_libs/util';
const USERID = getCookie('userId')
const INNID = getCookie('innId')
/**
 * 客栈管理系统
 * @type {{findRegisterUser: (function(*=)), findUserByName: (function(*=)), editUserInfo: (function(*=)), freezeAccount: (function(*=))}}
 */

const linenBaseURL = '/linen';
// 布草接口
export let linenApiService = {
    // get联系人
    getContactor: (param) => {
        return httpRequestor.get(linenBaseURL + '/contact/page', param).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    // 新增联系人
    addContactor: (param) => {
        return httpRequestor.postByFormStr(linenBaseURL + '/contact/add', param).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    // 修改联系人
    updateContactor: (param) => {
        return httpRequestor.postByFormStr(linenBaseURL + '/contact/upd', param).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    // 删除联系人
    delContactor: (param) => {
        return httpRequestor.postByFormStr(linenBaseURL + '/contact/del', param).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    // get优惠券
    getCoupon: (param) => {
        return httpRequestor.get(linenBaseURL + '/coupon/inn/page', param).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    // 提交布草订单
    submitOrder: (param) => {
        return httpRequestor.postByFormStr(linenBaseURL + '/linen-order/add', param).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },

    // 布草订单分页
    getLinenOrderList: (param) => {
        return httpRequestor.get(linenBaseURL + '/linen-order/inn/page', param).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    // 布草订单状态变更(确认/取消/签收)
    setLinenOrder: (param) => {
        return httpRequestor.postByFormStr(linenBaseURL + '/linen-order/op', param).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    // 布草订单详情
    getLinenDetail: (param) => {
        return httpRequestor.get(linenBaseURL + '/linen-order/detail', param).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    // 查看用户是否已经同意过协议
    ifHadAgreeAgreement: (param) => {
        return httpRequestor.get(linenBaseURL + '/linen-agreement/status', {
            ...param,
            userId: USERID
            }).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    getAgreenMent: (param) => {
        return httpRequestor.get(linenBaseURL + '/linen-agreement/find', param).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    // 点击同意布草协议
    agreeLinenAgreement: (param) => {
        return httpRequestor.get(linenBaseURL + '/linen-agreement/agree', {
            ...param,
            innId: INNID,
            userId: USERID
        }).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
     // 查看账单
    lookForAccount: (param) => {
        return httpRequestor.post(linenBaseURL + '/linenClientCheckBillDetail/detail', param).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    //布草变更记录
    getLinenRecords: (params = {}) => {
      return httpRequestor.get(linenBaseURL +'/linenClientOrderChangeRecord/record', params).catch(err => {
        console.log('请检查网络环境', err)
      })
    },
    // 获取布草全部产品
    getLinenProduct: (param) => {
        return httpRequestor.post(linenBaseURL + '/linen-goods/innpage', param).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    }
};