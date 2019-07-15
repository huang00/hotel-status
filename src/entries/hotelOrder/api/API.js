/**
 * Created with fly.
 * User: z1163764648@qq.com
 * Date: 18-5-17
 * Time: 上午9:45
 *
 */

/* eslint-disable*/

/**
 * 客栈管理系统
 * @type {{findRegisterUser: (function(*=)), findUserByName: (function(*=)), editUserInfo: (function(*=)), freezeAccount: (function(*=))}}
 */
export let hotelOrderApiServers = {
    //根据关键字、查询类型、日期对订单进行分页查询。
    findByCondition: (param) => {
        return httpRequestor.post('/order/findByCondition', param).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    //根据id查询某个订单详情
    getOrderDetail: (param) => {
        return httpRequestor.get(`/order/${param}`).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    //查询所有支付方式的接口
    getPayment: () => {
        return httpRequestor.get('/order/payment').catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    //查询订单来源
    getOrderFrom: (params) => {
        return httpRequestor.get('/order/from', params).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
};

