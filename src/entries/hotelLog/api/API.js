/**
 * Created with fly.
 * User: z1163764648@qq.com
 * Date: 18-5-17
 * Time: 上午9:45
 *
 */

/* eslint-disable*/

import {allPageloaadServers} from '../../../common_libs/pageonload'

allPageloaadServers.pageLoadPublicStyle();


/**
 * 客栈管理系统
 * @type {{findRegisterUser: (function(*=)), findUserByName: (function(*=)), editUserInfo: (function(*=)), freezeAccount: (function(*=))}}
 */
export let hotelLogApiServers = {
    /* 获取用户信息 */
    getInnInfo: (param) => {
        return httpRequestor.get('/inn/inn/getInn', param).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    /* 查询当前的日志类型 */
    getlogtype: () => {
        return httpRequestor.get('/log/logtype/getlogtype').catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    /* 查询用户在一段时间的操作记录 */
    getWefintLog: (param) => {
        return httpRequestor.get('/log/log/getWefintLog', param).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    getQuestionAndAnswer: (param) => {
        return httpRequestor.get('/finance/getQuestionAndAnswer', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    /* 获取客栈列表 */
    getHotelList: (param) => {
        return httpRequestor.get('/user/get/inn/list', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    /* 获取客栈员工列表 */
    getEmployeesList: (param) => {
        return httpRequestor.get('/user/inn/employees', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    /* 新接口 - 日志分页查询 */
    getNewWefintLog: (param) => {
        return httpRequestor.get('/log/log/query/wefintLogPage', param).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    // 查询用户拥有某个权限的所有关联客栈
    getInnListByPermission: (param) => {
        return httpRequestor.get('/user/get/innList/by/permission', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
};

