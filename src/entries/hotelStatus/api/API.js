/**
 * Created with fly.
 * User: z1163764648@qq.com
 * Date: 18-5-17
 * Time: 上午9:45
 *
 */

/* eslint-disable*/

import {
    getCookie
} from 'common_libs/util'

const USERID = getCookie('userId')
const INNID = getCookie('innId')

/**
 * 客栈管理系统
 * @type {{findRegisterUser: (function(*=)), findUserByName: (function(*=)), editUserInfo: (function(*=)), freezeAccount: (function(*=))}}
 */
export let hotelStatusApiSercers = {
    getOrderInfoById: (params) => {
        return httpRequestor.get('/order/findById', params).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    getHotelStatusOrder: (param) => {
        return httpRequestor.get('/order/findByDate', param).catch(err => {
            console.log('请检查网络环境', err);
          
        })
    },
    hotelOrderSave: (param) => {
        return httpRequestor.post('/order/saveOrder', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    /* 检测该房型是否可用 */
    checkRoomIsDisAble: (param) => {
        return httpRequestor.get('/order/isUsable', {
            ...param,
            innId: INNID,
            userId: USERID
        }).catch(err => {
            console.log('请检查网络环境', err);
          
        })
    },
    getInnInfo: (param) => {
        return httpRequestor.get('/inn/inn/getInn', param).catch(err => {
            console.log('请检查网络环境', err);
          
        })
    },
    todayIn: (param) => {
        return httpRequestor.get('/order/todayIn', param).catch(err => {
            console.log('请检查网络环境', err);
          
        })
    },
    todayOut: (param) => {
        return httpRequestor.get('/order/todayOut', param).catch(err => {
            console.log('请检查网络环境', err);
          
        })
    },
    waitDispatchRoom: (param) => {
        return httpRequestor.get('/order/findWaitToAssign', param).catch(err => {
            console.log('请检查网络环境', err);
          
        })
    },
    /* 订单搜索 */
    findByContact: (param) => {
        return httpRequestor.get('/order/findByContact', {
            ...param,
            userId: USERID,
            innId: INNID
        }).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    getQuestionAndAnswer: (param) => {
        return httpRequestor.get('/finance/getQuestionAndAnswer', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    findUsableRooms: (param) => {
        /* 获取可用房间 */
        return httpRequestor.get('/order/findUsableRooms', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    confirmDispatchRoom: (param) => {
        /* 确认分房 */
        return httpRequestor.post('/order/assignRoom', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    getOrderInfoByOrderId: (param) => {
        /* 获取可用房间 */
        return httpRequestor.get('/order/get/' + param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
};
