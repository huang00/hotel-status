/**
 * Created with fly.
 * User: z1163764648@qq.com
 * Date: 2018/4/18 0018
 * Time: 11:13
 *
 */
/* eslint-disable*/
import {allPageloaadServers} from '../common_libs/pageonload'; // 引入PageloadServers 类文件

let NowUrlHostName = window.location.host; // 检测主机是否在生产环境/
let PRODUCTION, ADD_IP; // 生产环境变量，单点登录IP地址
NowUrlHostName === 'wefint.com' || NowUrlHostName === 'www.wefint.com' ?
    (PRODUCTION = 'NOPRODUCTION') && (ADD_IP = 'http://192.168.0.131:9001') :// 'http://115.28.115.6:48080'
    (PRODUCTION = 'NOPRODUCTION') && (ADD_IP = 'http://192.168.0.131:9001'); // 'http://192.168.0.11:48080'
let pageloadServer = allPageloaadServers; // 实例化 pageloadServer
/**
 * 所有与登录相关的API模块
 * @type {{loginHttpGetToken: (function(*=, *=)), loginHttpServer: (function(*=, *=))}}
 */
export let LoginApiHttpServers = {
    /**
     *单点登录获取TOKEN
     * @param param  发送请求的参数
     * @return {Promise}
     */
    loginHttpGetToken: (param) => {
        return httpRequestor.post(ADD_IP + '/manage/admin/login', param, (err) => {
            console.log('请检查网络环境', err);
           
        }, false, false)
    },
    /**
     *单点登录 根据TOken查询用户信息
     * @param param  请求的参数 TOKEN
     * @param sucssfunc 成功返回的1方法
     */
    loginHttpServer: (param, sucssfunc) => {
        return pageloadServer.pageloadAjaxHttp('POST', ADD_IP + '/sso/find', param, (err) => {
            console.log('请检查网络环境', err);
           
        }, sucssfunc, false, false)
    },

    /**
     *  单点登录 删除用户信息
     * @param param
     * @param sucssfunc
     */
    logoutHttpServer: (param, sucssfunc) => {
        return pageloadServer.pageloadAjaxHttp('get', ADD_IP + '/sso/delete', param, (err) => {
            console.log('请检查网络环境', err);
           
        }, sucssfunc, true, false)
    }
};

export const publicHttpServer = {
    /* 根据订单id查询订单详情 */
    getOrderInforById: (params) => {
        return httpRequestor.get('/order/findById', params).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    /* 获取订单来源 */
    getHotelOrderFrom: (param) => {
        return httpRequestor.get('/order/from', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    /* 获取订单支付方式 =》 改版后*/
    getHotelOrderPayMent: (param) => {
        return httpRequestor.get('/order/payment', param).catch(err => {
            console.log('请检查网络环境', err);
          
        })
    },
    /* 获取订单支付类型 */
    getHotelOrderAllFinanceType: (param) => {
        return httpRequestor.get('/order/finance/type', param).catch(err => {
            console.log('请检查网络环境', err);
          
        })
    },
    /* 获取所有房型 */
    getHotelAllRoomType: (param) => {
        return httpRequestor.get('/inn/roomtype/findall', param).catch(err => {
            console.log('请检查网络环境', err);
          
        })
    },
    /* 获取一段时间之内的所有价格 */
    getRoomTypeRealPrice: (param) => {
        return httpRequestor.get('/inn/roomtypeprice/realprice', param).catch(err => {
            console.log('请检查网络环境', err);
          
        })
    },
    /* 获取一段时间之内的所有节假日 */
    getFestival: (param) => {
        return httpRequestor.get('/inn/festival/getFestival', param).catch(err => {
            console.log('请检查网络环境', err);
          
        })
    }
}

export const hotelStatusApiSercers = {
    /* 获取一段时间之内的所有订单 */
    getHotelStatusOrder: (param) => {
        return httpRequestor.get('/order/findByDate', param).catch(err => {
            console.log('请检查网络环境', err);
          
        })
    }
}

export let washLinenApiHttpServers = {

    washLinenAddLaundry: (param, sucssfunc) => {
        return pageloadServer.pageloadAjaxHttp('POST', pageloadServer.pageloadUrlConfig('register') + '/laundry/addLaundry', param, (err) => {
            console.log('请检查网络环境', err);
           
        }, sucssfunc, true, false)
    },
    washLinenGetUserOrderStatus: (param, sucssfunc) => {
        return pageloadServer.pageloadAjaxHttp('POST', pageloadServer.pageloadUrlConfig('register') + '/laundry/findLaundryByUserNameAndDate', param, (err) => {
            console.log('请检查网络环境', err);
           
        }, sucssfunc, true, false)
    },

    washLinenFindLaundryPriceList: (param, sucssfunc) => {
        return pageloadServer.pageloadAjaxHttp('POST', pageloadServer.pageloadUrlConfig('register') + '/laundryPrice/findLaundryPriceList', param, (err) => {
            console.log('请检查网络环境', err);
           
        }, sucssfunc, true, false)
    },
    washLinenUpdateLaundryPriceList: (param, sucssfunc) => {
        return pageloadServer.pageloadAjaxHttp('POST', pageloadServer.pageloadUrlConfig('register') + '/laundry/editLaundry', param, (err) => {
            console.log('请检查网络环境', err);
           
        }, sucssfunc, true, false)
    },
    washLinenGetLaundryPriceList: (param, sucssfunc) => {
        return pageloadServer.pageloadAjaxHttp('POST', pageloadServer.pageloadUrlConfig('register') + '/laundryPrice/findLaundryPriceList', param, (err) => {
            console.log('请检查网络环境', err);
           
        }, sucssfunc, true, false)
    },
    washLinenGetLaundryHistoryOrder: (param, sucssfunc) => {
        return pageloadServer.pageloadAjaxHttp('POST', pageloadServer.pageloadUrlConfig('register') + '/laundry/myHistoryOrder', param, (err) => {
            console.log('请检查网络环境', err);
           
        }, sucssfunc, true, false)
    }
};
