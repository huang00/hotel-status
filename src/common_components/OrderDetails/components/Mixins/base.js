/*
 * @Author: huangchao 
 * @Date: 2018-12-12 17:28:21 
 * @Last Modified by: huangchao
 * @Last Modified time: 2019-01-09 11:23:43
 */
import {
    toDecimal2
} from 'common_libs/util'
import {
    reComputedFinance
} from 'hotelStatus/libs/util'

export default {
    props: {
        edit: {
            type: Boolean,
            default: false
        },
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            toDecimal2,
            inputMaxLen: 30
        }
    },
    methods: {
        reComputedFinance () {
            let reComputedValue = reComputedFinance(this.data)
            this.data.totalAmountView = reComputedValue.totalAmountView
            this.data.paidAmountView = reComputedValue.paidAmountView
            this.data.depositView = reComputedValue.depositView
            this.data.subsidyView = reComputedValue.subsidyView
        },
        /**
         * 必须填写为数字。
         * @param item {Object} 数据对象
         * @param fieldName {String} 字段名
         * @param fn {Function} 需要执行的函数
         */
        requiredNumber (item, fieldName, fn) {
            item[fieldName] = item[fieldName].replace(/[^\d]/g, '')
            fn && fn(item)
        },
        validatePhoneNumber (item, fieldName, callback) {
            item[fieldName] = item[fieldName].replace(/[^0-9\-\s]/g, '')
            callback && callback(item)
        },
        /**
         * 价格保留两位小数。 金额最大一百万
         * @param item {Object} 数据对象
         * @param fieldName {String} 字段名
         * @param callback {Function} 需要执行的函数
         */
        moneyToDecimal2 (item, fieldName, callback) {
            let repReg = /^\D*([0-9]\d*(\.\d{2})?).*$/
            let value = item[fieldName].toString()
            value = value.replace(/[^0-9\.]/g, '')
            item[fieldName] = value.replace(repReg, '$1')
            if (item[fieldName] > 1000000)
                item[`${fieldName}ErrMsg`] = '数额不可超过1,000,000'
            else if (item[fieldName])
                item[`${fieldName}ErrMsg`] = ''
            callback && callback(item)
        },
        filterExpression (item, fieldName, callback) {
            let value = item[fieldName]
            item[fieldName] = value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, '')
            callback && callback(item)
        }
    }
}
