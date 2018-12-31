import {get as _get} from 'lodash'

/* eslint-disable*/
/**
 * 提供在所有页面都可以使用的通用的方法
 */
export default {
    trimAll,
    addZero,
    getThisWeekNum,
    formatDate,
    onlyNum,
    closeWin,
    targetSelf,
    loadJS,
    formatStamp,
    $,
    isEmptyObject,
    pageloadCheckNavigator,
    getUrlQuery,
    isSameArray,
    changeMoney,
    // 利用getter和setter访问sessionStorage，支持直接读写object。这里的取值表示是否在读取过一次后就删除
    sessionStorage:
        initStorage(sessionStorage, {
            // OO页面向XX页面传递的数据
            XX_DATA_FOMR_OO_PAGE: true,
        }),
    // 利用getter和setter访问localStorage，支持直接读写object。这里的取值表示是否在读取过一次后就删除
    localStorage:
        initStorage(localStorage, {
            // XX页面用户输入的草稿内容
            XX_PAGE_DRAFT: false,
        }),
};

export const GRIDEWIDTH = 100
export const GRIDEHEIGHT = 80
export const TODAY = new Date()

/**
 * 初始化storage代理
 * @param {Storage} stub
 * @param {object} proxy
 */
function initStorage(stub, proxy) {
    const result = {}
    for (const key in proxy) {
        if (proxy.hasOwnProperty(key)) {
            // 必须放进函数调用，以利用闭包固化key
            redefineKey(key, proxy[key]);
        }
    }
    return result;

    function redefineKey(key, isOneshot) {
        Object.defineProperty(result, key, {
            get() {
                const realKey = `SPA_${key}${window.gDevEnv ? '_dev' : ''}`;
                let value = stub.getItem(realKey);
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    if (e.name === 'SyntaxError') {
                        console.error(`can't parse [${realKey}]: ${value}`);
                        stub.removeItem(realKey);
                    } else {
                        console.error(e)
                    }
                    value = undefined;
                }
                if (isOneshot) {
                    stub.removeItem(realKey);
                }
                return value;
            },
            set(value) {
                const realKey = `SPA_${key}${window.gDevEnv ? '_dev' : ''}`;
                if (value === undefined) {
                    // 删除
                    try {
                        stub.removeItem(realKey)
                    } catch (e) {
                        console.error(e)
                    }
                } else {
                    try {
                        stub.setItem(realKey, JSON.stringify(value));
                    } catch (e) {
                        if (e.name === 'QuotaExceededError' && stub.length) {
                            // 空间不足
                            stub.clear();
                            stub.setItem(realKey, JSON.stringify(value));
                        } else {
                            console.error(e)
                        }
                    }
                }
            }
        });
    }
}

/**
 * s设置cookie的方法
 * @param key
 * @param value
 * @param date
 */
export function setCookie(key, value, date) {
    let exdate = new Date();//获取时间
    exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * date);//保存的天数
    //字符串拼接cookie
    window.document.cookie = key + "=" + value + ";path=/;expires=" + exdate.toGMTString();
}

/**
 * 获取kookie的方法
 * @param cookieName
 * @returns {string}
 */
export function getCookie(cookieName) {
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(cookieName + "=");
        if (c_start !== -1) {
            c_start = c_start + cookieName.length + 1;
            let c_end = document.cookie.indexOf(";", c_start);
            if (c_end === -1) {
                c_end = document.cookie.length
            }
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

/**
 * 删除某个cookie的方法
 * @param cookieName
 * @returns {*}
 */
export function deleteCookie(cookieName) {
    let A = new Date();
    A.setTime(A.getTime() - 1);
    let C = getCookie(cookieName);
    if (C !== null) return document.cookie = cookieName + "=" + C + ";expires=" + A.toGMTString();
    else return false
}

/**
 * 删除所有空格
 * @param {string} str
 * @return {string}
 */
export function trimAll(str) {
    if (!str)
        return false
    str = str && str.toString()
    return str.replace(/\s/g, '')
}

/**
 * 检测当前请求错误后失败的原因
 * @param e
 * @returns {*}
 */
export function pageloadCheckNavigator(e) {
    return window.navigator.onLine ? console.log('网络连接正常') : alert(`网络连接异常，请重新检查网络连接${error}`);
}

/**
 * 小于10，补0函数，常用于时间结构
 * @param {number} num
 * @return {string}
 */
export function addZero(num) {
    return num < 10 ? `0${num}` : num
}

/** 获取中文的星期数
  * @param {Date}
*/
export function getThisWeekNum(thisTime) {
    let weekList = ['日', '一', '二', '三', '四', '五', '六']
    return weekList[new Date(thisTime).getDay()]
}

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 例子：
 * dateFormat("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * dateFormat("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 * @param date yyyy-MM-dd / date yyyy.MM.dd / xxxxxxxxx
 * @returns {string}
 */
export const formatDate = (date, format = 'yyyy-MM-dd') => {
    if (date) {
      date = new Date(date)
      let o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
      return format
    } else return false
}

/**
 * 计算 入住的天数
 */
export const computedNights = (checkInDate, checkOutDate) => {
    return (+new Date(formatDate(checkOutDate)) -
            +new Date(formatDate(checkInDate))) / (24 * 3600000)
}

/**
 * 去除非数字字符
 * @param {string} str
 * @return {string}
 */
export function onlyNum(str) {
    return str ? str.replace(/\D/ig, '') : str
}

/**
 * 强制保留两位小数
 * @param x
 * @returns {*}
 */
export function toDecimal2(str) {
    if (!str && str !== 0) return str
    let res = str.toString();
    res = res.indexOf('.') < 0 ? res + '.000' : res + '000'
    let index = res.indexOf('.')
    return res.slice(0, index) + res.substr(index, 3)
}

/**
 * 关闭当前标签页
 */
export function closeWin() {
    window.opener = null
    window.open('', '_self')
    window.close()
}

/**
 * 在当前页面跳转，external是否为外部域名
 * @param {string} url
 * @param {boolean?} external
 */
export function targetSelf(url, external = false) {
    if (external) {
        window.top.location.href = url
    } else {
        window.top.location.href = `${window.location.protocol}//${window.location.host}${url}`
    }
}

/**
 * 异步加载js，id属性防止重复加载
 * @param {string} url
 * @param {string?} id
 */
export function loadJS(url, id) {
    if (document.getElementById(id)) {
        return
    }
    const fjs = document.getElementsByTagName('script')[0]
    const js = document.createElement('script')
    if (id) {
        js.id = id
    }
    js.src = url
    fjs.parentNode.insertBefore(js, fjs)
}

/**
 * 时间戳转世界时间
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * @return {string}
 * @example
 * "yyyy-MM-dd hh:mm:ss.S" ==> 2006-07-02 08:09:04.423
 * "yyyy-M-d h:m:s.S"      ==> 2006-7-2 8:9:4.18
 * @param obj
 */
export function formatStamp(obj) {
    let date = new Date(obj);
    let y = 1900 + date.getYear();
    let m = "0" + (date.getMonth() + 1);
    let d = "0" + date.getDate();
    return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}

/**
 * 获取Dom元素
 * @param {string}
 */
export const $ = document.querySelector.bind(document)

/**
 * 检测一个对象是否是空对象
 * @param {object} obj
 * @return {boolean}
 */
export function isEmptyObject(obj) {
    for (const key in obj) {
        // 如果obj是Object.create(null)创建出来的，就没有prototype，也没有hasOwnProperty
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}

/**
 * @param {obj} 数据对象
 * @returns {String} 返回对应的数据类型
 * @description 检测数据类型
 */
export function checkType (obj) {
    return Object.prototype.toString.call(obj).slice(8, -1)
  }

/**
 * 拷贝对象
 * @param obj
 * @returns {*}
 */
export function deepCopy(obj) {
    let res = obj;
    if (checkType(obj) === 'Array') {
        res = []
        for (let i = 0, len = obj.length; i < len; i++) {
            let item = obj[i]
            res.push(
                deepCopy(item)
            )
        }
    } else if (checkType(obj) === 'Object') {
        res = {}
        for (let attr in obj)
            res[attr] = deepCopy(obj[attr]);
    }
    return res
}

/**
 * 获取url中的指定参数
 * @param   {string} name url中的参数名字
 * @param   {string?} url 不填则使用当前地址
 * @returns {null | string} 若获取失败则返回null
 */
export function getUrlQuery(name, url) {
    const matcher = (url || window.location.search).match(`${name}=([^&#]+)`);
    if (!matcher || matcher.length < 2) {
        console.log(`No "${name}" in url`);
        return null;
    }
    return matcher[1];
}

/**
 * 比较两个数组是否相同
 * @param {Array} array1
 * @param {Array} array2
 * @param {Function} [comparator] 数组元素的比较器，传入参数为两个元素值，返回boolean
 */
export function isSameArray(array1, array2, comparator) {
    if (array1.length !== array2.length) {
        return false
    } else if (!array1.length) {
        return true
    }
    if (comparator) {
        return array1.every(item1 => array2.some(item2 => comparator(item1, item2)))
    } else {
        return array1.every(item => array2.includes(item))
    }
}

/**
 * 根据需要检验的类型进行校验是否符合规则
 * @param errorfunc
 * @param suceesfunc
 * @returns {*}
 * @param rule
 * @param CheckValue
 */
export function matchingInputRule(rule, CheckValue, errorfunc, suceesfunc) {
    const rightExpression = {
        phoneNumber: /^((13|15|18|14|17)+\d{9})$/, // 检验手机号码
        isString: /[^0-9]/,  // 检验是否为非数字输入
        number: /[0-9]/,  // 检验是否为number类型
        date: /^\d{4}(-|\/)\d{1,2}\1\d{1,2}$/, // 检验是否为时间格式 （YY-MM-DD）
        email: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/, // 检验是否为电子邮箱
        idCard: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, // 检验是否为合格身份证
        integer: /^[1-9]\d*$/, // 检验是否为正整数
        companyphone: /\d{3}-\d{8}|\d{4}-\d{7}/, // 验证是否为公司电话号码
        businessLicense: /^([0-9a-zA-Z]{18}$|\d{15}$)/, //营业执验证,
        userName: /[a-zA-Z0-9_-]$/, // 用户名规则验证 4到16位（字母，数字，下划线，减号）
        hotelUserName: /[^*&%$#@<>"'.,\s\n《》^|]$/, // 用户名规则验证 4到16位（字母，数字，下划线，减号）
        userNameCantIsEmpty: /^(?!\s*$)/g, // 不能为空字符串
        userNameCantIsAllNumber: /[^0-9]+/, // 不能为纯数字
        userNameLength: /^\S{4,20}$/, // 用户名长度为4~20位
        passWordCantIsEmpty: /^(?!\s*$)/g, // 不能为空字符串
        passWordLength: /^\S{6,16}$/, // 用户名长度为4~20位
        assiginPassWordCantIsEmpty: /^(?!\s*$)/g, // 不能为空字符串
        hotelNameCantIsEmpty: /^(?!\s*$)/g, // 不能为空字符串
        hotelNameLength: /^\S{2,40}$/, // 用户名长度为4~20位
        cantIsEmpty: /^(?!\s*$)/g, // 不能为空字符串
    };
    const errCodeName = {
        phoneNumber: '手机号码格式输入错误',
        userName: '用户名只由英文字母及数字组成',
        hotelUserName: '不能包含非法字符',
        passWord: '密码输入格式错误',
        email: '邮箱格式输入错误',
        date: '时间格式输入错误',
        idCard: '证件格式输入错误',
        userNameCantIsEmpty: '请输入用户名',
        userNameCantIsAllNumber: '用户名不能为纯数字',
        userNameLength: '用户名长度为4~20位',
        passWordCantIsEmpty: '请输入密码',
        passWordLength: '密码长度为6~16',
        assiginPassWordCantIsEmpty: '请再次输入密码',
        hotelNameCantIsEmpty: '请输入客栈名称',
        hotelNameLength: '客栈名长度为2~40位',
        cantIsEmpty: '不能为空'

    };
    for (let key in rightExpression) {
        try {
            if (key === rule) {
                if (errorfunc && suceesfunc) {
                    return rightExpression[key].test(CheckValue) ? suceesfunc : errorfunc;
                } else {
                    return rightExpression[key].test(CheckValue) ? true : errCodeName[key];
                }
            }
        } catch (error) {
            console.log(`${rule}匹配规则不正确，请重写${rule}规则`)
        }

    }
}

export const newOrderData = {
    id: null,
    userId: getCookie('userId'),
    innId: getCookie('innId'),
    contactName: '',
    depositView: 0, // 收取的押金
    paidAmountView: 0, // 已收款
    subsidyView: 0,
    contactPhone: '',
    orderNo: null,
    otaOrderNo: null,
    orderFrom: null,
    totalAmount: 0, // 订单总额
    payWays: null,
    refundAmount: 0,
    remarks: '',
    suborders: [
        // {
        //     id: null,
        //     checkInDate: new Date(),
        //     checkOutDate: +new Date() + 24 * 3600000,
        //     nights: 1,
        //     suborderAmount: '200',
        //     roomId: 2462,
        //     status: 0,
        //     checked: true,
        //     details: [
        //         {
        //             id: null,
        //             roomPrice: '',
        //             checkInDate: +new Date() + 24 * 3600000,
        //             roomId: '',
        //         }
        //     ],
        //     clients: []
        // }
    ],
    records: []
}

/**
 * 订单数据处理，处理成我们需要使用的数据，非常重要。
 * @param mainOrder {Object} 主订单数据
 * @param roomIds {Array} 房间id集合
 * @param orderFromList {Array} 订单来源集合
 * @param startDate {String | Number} 开始循环时间
 * @returns {Object}
 */
export const mainOrderDataProcess = function (mainOrder, orderFromList, roomIds, startDate) {
    let createdStyle = checkType(arguments[2]) === 'Array'
    if (createdStyle)
        startDate = +new Date(formatDate(startDate))
    let payType = null // 直连订单支付支付类型 预付、闪付、现付
    if (mainOrder.otaOrderNo) {
        let channelCode = orderFromList.filter(item => item.id === mainOrder.orderFrom)[0].channelCode
        payType = getChannelFrom(channelCode).playType
    }

    return Object.assign(mainOrder, {
        paidAmountView: mainOrder.paidAmount / 100, // 实收金额
        depositView: mainOrder.deposit / 100,   // 押金
        totalAmountView: (mainOrder.totalAmount + mainOrder.otherCast) / 100,   // 订单总金额
        otherCastView: mainOrder.otherCast / 100, // 其它消费
        subsidyView: (mainOrder.totalAmount - mainOrder.deposit - mainOrder.paidAmount - mainOrder.otherCast) / 100,   // 需补
        payType,
        records: mainOrder.records.map(item => {    // 财务记录
            return Object.assign(item, {
                priceView: !item.price && item.price !== 0 ? '': item.price / 100
            })
        }),
        suborders: mainOrder.suborders.map(item => {
            let nights = computedNights(item.checkInDate, item.checkOutDate)
            let newItem = Object.assign(item, {
                checkInDateView: new Date(item.checkInDate),
                checkOutDateView: formatDate(item.checkOutDate),
                suborderAmountView: item.suborderAmount / 100,
                nights,
                checked: false, // 是否选中该房间
                fixedNotCheck: false, // 固定不能选择
                roomIdErrMsg: '',
                suborderAmountViewErrMsg: '',
                isOtaOrder: !!mainOrder.otaOrderNo,
                payType
            })
            if (createdStyle) {
                newItem = Object.assign(newItem, {
                    top: roomIds.indexOf(item.roomId) * GRIDEHEIGHT,
                    left: (+new Date(formatDate(item.checkInDate)) - startDate) / (24 * 3600000) * GRIDEWIDTH,
                    width: nights * GRIDEWIDTH,
                })
            }
            return newItem
        })
    })
}

/**
 * 订单数据验证，非常重要。
 * @param mainOrder {Object} 主订单数据
 * @param validateField {Array} 需要验证的字段名称集合
 * @returns {Object}
 */
export const validateField = [
    'contactName',
    {
        relationField: 'suborders',
        validateField: [
            'roomId',
            'suborderAmountView'
        ]
    }
]

/* 验证房间是否重复 */
export const validateRoomRepeat = (suborderList) => {
    let roomIdGroup = {}
    for (let i = suborderList.length; i--;) {
        let item = suborderList[i]
        let {status, roomId} = item
        if (status === 0) {
            if (roomIdGroup[roomId])
                roomIdGroup[roomId].push(item)
            else {
                roomIdGroup[roomId] = []
                roomIdGroup[roomId].push(item)
            }
        }
    }
    for (let key in roomIdGroup) {
        let roomIdGroupItem = roomIdGroup[key]
        let len = roomIdGroupItem.length
        if (len <= 1) {
            // roomIdGroupItem[0].roomIdErrMsg = ''
            continue;
        }
        for (let i = 0; i < len; i++) {
            let item = roomIdGroupItem[i]
            let itemCheckInDate = +new Date(formatDate(item.checkInDateView))
            let itemCheckOutDate = +new Date(formatDate(item.checkOutDateView))
            for (let k = i + 1; k < len; k++) {
                let subItem = roomIdGroupItem[k]
                let subItemCheckInDate = +new Date(formatDate(subItem.checkInDateView))
                let subItemCheckOutDate = +new Date(formatDate(subItem.checkOutDateView))
                if (
                    !subItem.id &&
                    subItem.roomId &&
                    item.roomId &&
                    (
                        item.nights <= subItem.nights &&
                        (
                            (itemCheckInDate >= subItemCheckInDate && itemCheckInDate < subItemCheckOutDate) ||
                            (itemCheckOutDate > subItemCheckInDate && itemCheckOutDate < subItemCheckOutDate)
                        )
                    ) 
                    || 
                    (
                        item.nights > subItem.nights &&
                        (
                            (subItemCheckInDate >= itemCheckInDate && subItemCheckInDate < itemCheckOutDate) ||
                            (subItemCheckInDate >= itemCheckInDate && subItemCheckInDate < itemCheckOutDate)
                        )
                    )
                ) {
                    if (!subItem.roomIdErrMsg)
                        subItem.roomIdErrMsg = '房间重复'
                    if (!item.roomIdErrMsg && !item.id && item.id !== 0)
                        item.roomIdErrMsg = '房间重复'
                }
            }
        }
    }
}

const validateErrObj = {
    contactName: '联系人姓名不能为空',
    roomId: '房间号不能为空',
    suborderAmountView: '订单金额不能为空'
}
export const mainOrderValidate = (mainOrder, validateField) => {
    let res = {}
    mainOrder.suborders &&
        validateRoomRepeat(mainOrder.suborders)
    for (let i = 0, len = validateField.length; i < len; i++) {
        let item = validateField[i]
        if (checkType(item) === 'Object') {
            let empty = []
            mainOrder[item.relationField].map((subItem, index) => {
                let errObj = mainOrderValidate(subItem, item.validateField)
                if (!isEmptyObject(errObj)) {
                    empty.push({
                        ...errObj,
                        index
                    })
                }
            })
            empty.length && (res[item.relationField] = empty)
        } else {
            if (!mainOrder[item] || !trimAll(mainOrder[item]) || mainOrder[`${item}ErrMsg`])
                res[item] = {
                    errMsg: mainOrder[`${item}ErrMsg`] || validateErrObj[item],
                    field: item
                }
        }
    }
    return res
}

/**
 * 提交订单时数据处理，非常重要。
 * @param mainOrder {Object} 主订单数据
 * @returns {Object}
 */
export const submitOrderDataFilter = (mainOrder) => {
    mainOrder = deepCopy(mainOrder)
    mainOrder.userId = getCookie('userId')
    mainOrder.paidAmount = mainOrder.paidAmountView * 100
    mainOrder.deposit = mainOrder.depositView * 100
    mainOrder.totalAmount = mainOrder.totalAmountView * 100
    mainOrder.records = mainOrder.records.filter(item => {    // 财务记录
        if (item.priceView || item.priceView === 0) {
            item.price = item.priceView * 100
            delete item.priceView
            return true
        }
    })
    mainOrder.suborders.map(item => {
        item.checkInDate = +new Date(item.checkInDateView)
        item.checkOutDate = +new Date(item.checkOutDateView)
        item.suborderAmount = item.suborderAmountView * 100
        item.clients = item.clients.filter(subItem => {    // 入住用户
            if (trimAll(subItem.name) || trimAll(subItem.phone) || trimAll(subItem.identityNo))
                return true
        })
        
        delete item.checkInDateView
        delete item.checkOutDateView
        delete item.suborderAmountView
        delete item.roomIdErrMsg
        delete item.suborderAmountViewErrMsg
        delete item.checked
        delete item.nights
        delete item.contactName
        delete item.paidAmountView
        delete item.depositView
        delete item.totalAmountView
        delete item.orderFrom
        delete item.top
        delete item.left
        delete item.width
        delete item.fixedNotCheck
        delete item.isOtaOrder
        delete item.payType
    })
    delete mainOrder.subsidyView
    delete mainOrder.paidAmountView
    delete mainOrder.depositView
    delete mainOrder.totalAmountView
    delete mainOrder.playType
    delete mainOrder.otherCastView

    return mainOrder
}

export function getChannelFrom(code) {
    if (!code) {
        return false
    }
    let result = {
        playType: null,
        className: '',
        playTypeName: ''
    }
    switch(code) {
        case '000001':
            result.playType = 'before'
            result.playTypeName = '预付'
            result.className = 'ctrip'
            break;
        case '000002':
            result.playType = 'now'
            result.playTypeName = '现付'
            result.className = 'ctrip'
            break;
        case '000003':
            result.playType = 'quickly'
            result.playTypeName = '闪住'
            result.className = 'ctrip'
            break;
        case '000011':
            result.className = 'qunar'
            result.playTypeName = '预付'
            result.playType = 'before'
            break;           
        case '000012':
            result.className = 'qunar'
            result.playTypeName = '现付'
            result.playType = 'now'
            break;
        case '000021':
            result.className = 'elong'
            result.playTypeName = '预付'
            result.playType = 'before'
            break;
        case '000022':
            result.className = 'elong'
            result.playTypeName = '现付'
            result.playType = 'now'
            break;
        case '000031':
            result.className = 'meituan';
            break;
        case '000041':
            result.className = 'fliggy';
            break;
        case '000051':
            result.className = 'booking';
            break;
        case '000061':
            result.className = 'tongcheng';
            break;
        case '000071':
            result.className = 'lvmama';
            break;
        case '000081':
            result.className = 'mafengwo';
            break;
        case '000091':
            result.className = 'tuniu';
            break;
        case '000101':
            result.className = 'tujia';
            break;
        case '000111':
            result.className = 'yiqiyou';
            break;
        case '000121':
            result.className = 'airbnb'
            break;
        case '000131':
            result.className = 'xiaozhu'
            break;
        case '000141':
            result.className = 'agoda'
            break;
    }
    return result
}

/**
 * 获取url的请求参数
 * @returns {string}
 */
export function getQuestParsm(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
    }
    return false;
}

/* 根据属性进行排序 isRise 是否升序, 默认true */
export function compare(property, isRise = true){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return isRise ? (value1 - value2) : (value2 - value1);
    }
}
/**
 * 返回金额为分的转换成元，保留到分，每三位一组增加可读性
 * @returns number
 */
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