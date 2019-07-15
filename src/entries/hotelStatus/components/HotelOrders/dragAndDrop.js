/*
 * @Author: huangchao 
 * @Date: 2018-12-08 17:33:39 
 * @Last Modified by: huangchao
 * @Last Modified time: 2019-01-09 11:26:42
 */
 
import NP from 'number-precision'
import {
    compare,
    computedNights,
    GRIDEWIDTH,
    GRIDEHEIGHT,
    TODAY,
    formatDate
} from 'common_libs/util'
import {
    checkIsPredetermine
} from 'hotelStatus/libs/util'
import { deepCopy } from '../../../../common_libs/util';
 
/**
 * 筛选出最终被选中的数据
 * @param hotelRoomList 移动的距离
 * @param suborderList 初始的宽 || 高 移动的距离
 */
export const computedRealSelectItems = (hotelRoomList, suborderList) => {
    let res = []
    if (hotelRoomList.length > 0) {
        for (let i = 0, len = hotelRoomList.length; i < len; i++) {
            let realPriceList = hotelRoomList[i].realPriceList
            realPriceList.map(item => {
                item.checked &&
                    res.push(item)
            })
        }
        for (let c = res.length; c--;) {
            let item = res[c]
            for (let j = suborderList.length; j--;) {
                let subItem = suborderList[j]
                let minLeft = subItem.left
                let maxLeft = subItem.left + subItem.width
                if (
                    item.clientY * GRIDEHEIGHT === subItem.top &&
                    item.clientX * GRIDEWIDTH >= minLeft &&
                    item.clientX * GRIDEWIDTH < maxLeft
                ) {
                    item.checked = false
                    res.splice(c, 1)
                }
            }
        }
    }
    return res
}

/* 计算toolTip的位置 */
export const computedToolTipStyle = (array, maxTop, maxLeft) => {
    let res = {}
    if (array.length) {
        let sortByClentY = array.sort(compare('clientY'))
        let maxY = sortByClentY[sortByClentY.length-1].clientY
        let sortByClentX = sortByClentY.filter(item => item.clientY === maxY).sort(compare('clientX'))
        let lastItem = sortByClentX[sortByClentX.length-1]
        let top = lastItem.clientY * 80 + 75
        let left = lastItem.clientX * 100 + 80
        let bodyHeight = document.body.offsetHeight - 135
        let overflowTop = false
        let overflowLeft = false
        
        left = left > maxLeft - 120 ?
            left - 160 : left
        if (top + 40 > bodyHeight && top + 40 > maxTop) {
            top = top - 110
            overflowTop = true
        } else
            overflowTop = false
        
        overflowLeft = left === 2820
        res = {
            top: top + 'px',
            left: left +'px',
            display: 'block',
            width: overflowLeft ? '104px': '157px',
            overflowTop,
            overflowLeft
        }
    } else
        res = { display: 'none' }
    return res
}

/* 创建订单数据 */
export const createdOrderData = (array) => {
    let res = {
        suborders: [],
        totalAmountView: 0
    }
    /* 以不同的房间id进行分组 */
    let roomGroup = {}
    for (let i = array.length; i--;) {
        let item = array[i]
        let roomGroupKey = 'room' + item.roomId
        res.totalAmountView += item.priceView - 0
        if (!roomGroup[roomGroupKey]) {
            roomGroup[roomGroupKey] = []
            roomGroup[roomGroupKey].push(item)
        } else roomGroup[roomGroupKey].push(item)
    }
    /* 对roomGroup 下面的数组进行排序 */
    for (let key in roomGroup) {
        let roomGroups = roomGroup[key] = roomGroup[key].sort(compare('clientX'))
        let suborderData = roomGroupDataProcess(roomGroups)
        for (let arrtr in suborderData)
            res.suborders.push(suborderProcess(suborderData[arrtr]))
    }
    return res
    
    function roomGroupDataProcess (roomGroups) {
        /* 对roomGroup 下面的数组依据入住时间进行再拆分 */
        let res = {}
        let checkInItems = []
        for (let i = 0, len = roomGroups.length; i < len; i++) {
            let item = roomGroups[i]
            if (i === 0
                || item.clientX - checkInItems[checkInItems.length - 1].clientX !== 1)
            {
                checkInItems = []
                res['checkIn'+item.clientX] = checkInItems
                checkInItems.push(item)
            } else checkInItems.push(item)
        }
        return res
    }

    function suborderProcess(suborderData) {
        /* 生成子订单数据 */
        let todayStr = +new Date(formatDate(TODAY)) // 今天八点
        let todayTwelve = todayStr + (4 * 3600000)    // 今天十二点
        let currentTime = +new Date() // 当前时间
        let len = suborderData.length
        let checkInDateView = new Date(suborderData[0].currDate)
        let checkOutDateView = +new Date(formatDate(suborderData[len - 1].currDate + 24 * 3600000))
        let nights = computedNights(checkInDateView, checkOutDateView)
        let isPredetermine = checkIsPredetermine(checkInDateView)
        let status = (
            isPredetermine ||
            checkOutDateView > todayStr ||
            (
                checkOutDateView === todayStr &&
                currentTime < todayTwelve
            )
        ) ? 0: 2

        let suborderAmountView = 0
        let details = []
        let roomId = suborderData[0].roomId
        for (let i = 0; i < len; i++) {
            let item = suborderData[i]
            let priceView = item.priceView
            suborderAmountView = NP.plus(suborderAmountView, priceView)
            details.push({
                id: null,
                roomPrice: priceView * 100,
                checkInDate: item.currDate,
                roomId
            })
        }
        let res = {
            id: null,
            checkInDateView,
            checkOutDateView,
            nights,
            suborderAmountView,
            roomId,
            status,
            checked: false,
            details,
            clients: [],
            roomIdErrMsg: '',
            suborderAmountViewErrMsg: ''
        }
        return res
    }
}

/**
 * 拖拽 计算阴影下一次位置
 * @param moveDistance 移动的距离
 * @param origin 初始的宽 || 高 移动的距离
 * @param attr 属性 宽 || 高 移动的距离
 * @param min 最小移动值
 * @param max 最大移动值
 */

export const computedShadowBoxNextCoor = (moveDistance, origin, attr, min = 0, max) => {
    let offsetConst = attr === 'left' ? GRIDEWIDTH : GRIDEHEIGHT
    let ratio = moveDistance / offsetConst
    if (ratio || ratio === 0) {
        if (Math.abs(ratio) < 0.5 ) {
            return origin <= min
            ? min: origin >= max
            ? max: origin
        } else {
            let execStr = /(\d+)\.(\d{1})/.exec(
                ratio.toString().indexOf('.') < 0 ?
                    ratio + '.00'
                    : ratio
            )
            let integer = execStr[1]
            let decimal = execStr[2]
            if (decimal >= 5) {
                let value =  ratio > 0 ?
                    (integer - 0 + 1) * offsetConst + origin
                    : -(integer - 0 + 1) * offsetConst + origin
                return value <= min
                        ? min: value >= max
                        ? max: value
            } else {
                let value =  ratio > 0 ?
                    (integer - 0) * offsetConst + origin
                    : -(integer - 0) * offsetConst + origin
                return value <= min
                        ? min: value >= max
                        ? max: value
            }
        }
    }
}

/**
 * 拖拽 计算碰撞
 * @param {Number} id 需要检测碰撞元素的id
 * @param {Number} top 需要检测碰撞元素的top值
 * @param {Number} left 需要检测碰撞元素的left值
 * @param {Number} width 需要检测碰撞元素的width值
 * @param {Array} existedList 视图上已经存在的元素
 * @retrun {Boolean} 是否已经产生了碰撞
 */
export const computedImpact = (id, top, left, width, existedList) => {
    let res = false
    let minLeft = left
    let maxLeft = left + width
    for (let i = existedList.length; i--;) {
        let item = existedList[i]
        let itemMinLeft = item.left
        let itemMaxLeft = item.left + item.width
        if (
            item.top === top && item.id !== id && item.isHourRoom !== 1 &&
            (   
                (
                    (maxLeft > itemMinLeft && maxLeft <= itemMaxLeft) ||
                    (minLeft < itemMaxLeft && minLeft >= itemMinLeft)
                ) ||
                (
                    item.width < width &&
                    (
                        (itemMinLeft >= minLeft && itemMaxLeft <= maxLeft) ||
                        (minLeft >= itemMinLeft && maxLeft <= itemMaxLeft)
                    )
                )
            )
        ) {
            res = true
            break;
        } else res = false
    }
    return res
}

/**
 * 拖拽 拆分数据
 * @param {Number} id 需要检测碰撞元素的id
 */
export const createdSplitData = (suborderData) => {
    let forgerySuborderAmountView = 0
    let realSuborderAmountView = 0
    let res = {
        forgery: deepCopy(suborderData),
        real: deepCopy(suborderData)
    }
    /* 生成一个退订订单 */
    let splitLeftWidth = computedNights(suborderData.checkInDateView, TODAY) * GRIDEWIDTH
    res.forgery.id = null
    res.forgery.width = splitLeftWidth
    res.forgery.status = 2
    res.forgery.nights = computedNights(suborderData.checkInDateView, TODAY)
    res.forgery.checkOutDateView = +new Date(TODAY)
    res.forgery.details = res.forgery.details.sort(compare('checkInDate')).slice(0, res.forgery.nights).map(item => {
        forgerySuborderAmountView += item.roomPrice - 0
        return item
    })
    res.forgery.relationSubId = suborderData.orderId
    res.forgery.suborderAmountView = forgerySuborderAmountView / 100

    /* 被拆分的订单 */
    res.real.nights = computedNights(TODAY, suborderData.checkOutDateView)
    let splitRightWidth = res.real.nights * GRIDEWIDTH
    res.real.width = splitRightWidth
    res.real.checkInDateView = TODAY
    res.real.details = res.real.details.sort(compare('checkInDate')).slice(res.forgery.nights).map(item => {
        realSuborderAmountView += item.roomPrice - 0
        return item
    })
    res.real.relationSubId = suborderData.orderId
    res.real.suborderAmountView = realSuborderAmountView / 100
    return res
}
