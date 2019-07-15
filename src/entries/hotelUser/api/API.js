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
const baseUrl =  '/inn'
/**
 * 客栈管理系统
 * @type {{findRegisterUser: (function(*=)), findUserByName: (function(*=)), editUserInfo: (function(*=)), freezeAccount: (function(*=))}}
 */
export let hotelUserApiSercers = {
  // 获取用户关联的所有客栈
  getAllHotel: (param) => {
    return httpRequestor.get( '/user' + '/get/inn/list', param).catch(err => {
      console.log('请检查网络环境', err);
      alert('服务器请求失败，请检查网络环境。')
    })
  },
  // 获取客户列表
  getClinentList: (param) => {
    return httpRequestor.post( baseUrl + '/clientRelation/statisticsClientDetailList/get', param).catch(err => {
      console.log('请检查网络环境', err);
      alert('服务器请求失败，请检查网络环境。')
    })
  },
  //添加客户
  addClinent: (param) => {
    return httpRequestor.post( baseUrl + '/clientRelation/clientInformationSave/put', param).catch(err => {
      console.log('请检查网络环境', err);
      alert('服务器请求失败，请检查网络环境。')
    })
  },
  //编辑保存客户
  editClinent: (param) => {
    return httpRequestor.post( baseUrl + '/clientRelation/clientInformationEdit/put', param).catch(err => {
      console.log('请检查网络环境', err);
      alert('服务器请求失败，请检查网络环境。')
    })
  },
   //查看客户关系信息
   lookForClinent: (param) => {
    return httpRequestor.get( baseUrl + '/clientRelation/viewClientInformation/get', param).catch(err => {
      console.log('请检查网络环境', err);
      alert('服务器请求失败，请检查网络环境。')
    })
  },
  // 订单记录
  getOrderRemark: (param) => {
    return httpRequestor.get( baseUrl + '/clientRelation/orderRecord/get', param).catch(err => {
      console.log('请检查网络环境', err);
      alert('服务器请求失败，请检查网络环境。')
    })
  },
};
