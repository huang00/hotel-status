/*
 * @Author: huangchao 
 * @Date: 2018-12-12 17:28:21 
 * @Last Modified by: huangchao
 * @Last Modified time: 2018-12-28 16:07:28
 */
import {
    toDecimal2
} from 'common_libs/util'

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
            let totalAmountView = 0
            let paidAmountView = 0
            let depositView = 0
            this.data.suborders.map(item => {
                totalAmountView += item.suborderAmountView - 0
            })
            this.data.records.map(item => {
                if (item.priceView) {
                    if (item.financeType ===  1 || item.financeType === 2)
                        paidAmountView += item.priceView - 0
                    else if (item.financeType === 3)
                        depositView += item.priceView - 0
                    else
                        paidAmountView -= item.priceView - 0
                }
            })
            this.data.totalAmountView = totalAmountView + (this.data.otherCastView - 0)
            this.data.paidAmountView = paidAmountView
            this.data.depositView = depositView
            this.data.subsidyView = totalAmountView - paidAmountView - depositView - this.data.otherCastView
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
        /**
         * 价格保留两位小数。 金额最大一百万
         * @param item {Object} 数据对象
         * @param fieldName {String} 字段名
         * @param callback {Function} 需要执行的函数
         */
        moneyToDecimal2 (item, fieldName, callback) {
            let repReg = /^\D*([0-9]\d*(\.\d{2})?).*$/
            item[fieldName] = item[fieldName].toString().replace(repReg, '$1')
            if (item[fieldName] >= 1000000)
                item[`${fieldName}ErrMsg`] = '数额不可超过1,000,000'
            else
                item[`${fieldName}ErrMsg`] = ''
            callback && callback(item)
        }
    }
}
