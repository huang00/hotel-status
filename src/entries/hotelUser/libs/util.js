/*
 * @Author: huangchao 
 * @Date: 2019-01-09 10:43:47 
 * @Last Modified by: huangchao
 * @Last Modified time: 2019-01-14 14:39:58
 */
import {
    deepCopy,
    formatDate,
    TODAY
} from 'common_libs/util'

/**
 * 订单数据验证，非常重要。
 * @param mainOrder {Object} 主订单数据
 * @param validateField {Array} 需要验证的字段名称集合
 * @returns {Object}
 */
export const validateField = [
    'contactName',
    'otherCastView',
    {
        relationField: 'suborders',
        validateField: [
            'roomId',
            'suborderAmountView',
            {
                relationField: 'clients',
                validateField: [
                    'identityNo'
                ]
            }
        ]
    },
    {
        relationField: 'records',
        validateField: [
            'priceView'
        ]
    }
]

export const reComputedFinance = (mainOrder) => {
    let res = {
        totalAmountView: 0, // 订单总额
        paidAmountView: 0,  // 已收金额
        depositView: 0, // 押金金额
        subsidyView: 0  // 需补金额
    }
    mainOrder = deepCopy(mainOrder)
    let totalAmountView = 0
    mainOrder.suborders.map(item => {
        totalAmountView += item.suborderAmountView - 0
    })
    mainOrder.records.map(item => {
        if (item.priceView) {
            if (item.financeType ===  1 || item.financeType === 2)
                res.paidAmountView += item.priceView - 0
            else if (item.financeType === 3)
                res.depositView += item.priceView - 0
            else if (item.financeType === 6)
                res.depositView -= item.priceView - 0
            else
                res.paidAmountView -= item.priceView - 0
        }
    })
    res.totalAmountView = totalAmountView + (mainOrder.otherCastView - 0)
    res.subsidyView = res.totalAmountView - res.paidAmountView - res.depositView - mainOrder.otherCastView
    return res
}

/* 判断是否为预定 （要么就是补录） */
export const checkIsPredetermine = (checkInDate) => {
    /* 
        预定条件:
        1、入住时间大于等于昨天
        2、操作时间小于今天十二点
        或者
        1、入住时间大于等于今天
    */
    let res = false
    let today = +new Date(`${formatDate(TODAY)} 00:00:00`) // 今天零点
    let yesterday = today - (24 * 3600000)   // 昨天零点
    let currentTime = +new Date() // 当前时间
    let todayTwelve = today + (12 * 3600000)    // 今天十二点
    if (
        (
            currentTime < todayTwelve &&
            checkInDate >= yesterday
        ) ||
        checkInDate >= today
    )
        res = true
    return res
}

export const newClientItem = {
    id: null,
    name: null,
    phone: '',
    identityType: 0,
    identityNo: '',
    identityNoErrMsg: ''
}
// 时间戳格式化为时间
export function formatStampYMD(timestamp,type) {
  if(timestamp){
      let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      let h = date.getHours() < 10 ? '0' + date.getHours() + ": ": date.getHours() + ": ";
      let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() ;
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

      if(type == 'hour'){
        return Y+M+D+' '+ h
      } else if (type == 'min'){
          return Y+M+D+ ' '+ h + m
      } else if (type == 'second') {
          return Y+M+D+' '+ h + m + " : " + s
      } else {
          return Y+M+D
      }
  }else{
      return ''
  }
  
}
// 分转换成元
export function changeMoney(money) {
  var money = money/100
  if(money && money != null){
      money = String(money);
      var left = money.split('.')[0],right = money.split('.')[1];
      right = right ? (right.length>=2 ? '.'+right.substr(0,2) : '.'+right+'0') : '.00';
      var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
      return (Number(money)<0?"-":"") + temp.join(',').split('').reverse().join('') + right;
  }else if(money === 0){   //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
      return '0.00';
  } else {
      return "";
  }
}