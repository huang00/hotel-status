/*
 * @Author: huangchao 
 * @Date: 2018-12-06 11:21:23 
 * @Last Modified by: huangchao
 * @Last Modified time: 2018-12-28 10:59:00
 */

import {
    publicHttpServer,
    hotelStatusApiSercers
} from 'api/api'
import {
    getCookie,
    compare,
    deepCopy,
    formatDate,
    toDecimal2,
    getThisWeekNum,
    mainOrderDataProcess
} from 'common_libs/util'

const INNID = getCookie('innId')
const USERID = getCookie('userId')
let getHotelAllRoomType = null
let getFestival = null
let getHotelOrderFrom = null

export default {
    /**
     * 请求 获取订单来源列表
     * @param commit
     */
    getOrderFromList ({commit}) {
        getHotelOrderFrom = new Promise(res => {
            publicHttpServer.getHotelOrderFrom({
                innId: INNID,
                userId: USERID
            }).then(result => {
                if (result.code === '000000' && result.content) {
                    commit('setOrderFromList', result.content)
                    res(result.content)
                }
            })
        })
    },
    /**
     * 请求 获取订单支付方式列表
     * @param commit
     */
    getOrderPaymentList ({commit}) {
        publicHttpServer.getHotelOrderPayMent({
            innId: INNID
        }).then(result => {
            if (result.code === '000000')
                commit('setOrderPaymentList', result.content)
        })
    },
    /**
     * 请求 获取订单支付类型列表
     * @param commit
     */
    getOrderPaymentTypeList ({commit}) {
        publicHttpServer.getHotelOrderAllFinanceType().then(result => {
            if (result.code === '000000')
                commit('setOrderPaymentTypeList', result.content)
        })
    },
    /**
     * 请求 获取所有房型列表
     * @param commit
     */
    getRoomTypeList ({commit}) {
        getHotelAllRoomType = new Promise(res => {
            publicHttpServer.getHotelAllRoomType({
                innId: INNID
            }).then(result => {
                if (result.code === '000000') {
                    let roomList = []
                    result.content.sort(compare('roomTypeSequence'))
                    result.content.map(item => {
                        item.roomList.map(subItem => {
                            roomList.push(Object.assign({
                                roomTypeName: item.roomTypeName
                            }, subItem))
                        })
                    })
                    res(result.content)
                    commit('setRoomList', roomList)
                    commit('setRoomTypeList', result.content)
                }
            })
        })
    },
    /**
     * 请求 获取所有房型和时间
     * @param commit
     */
    getRoomAndPriceList ({commit}, params) {
        let getRoomTypeRealPrice = new Promise(res => {
            let startDate = new Date(params.startDay)
            let endDate = new Date(params.endDay)
            startDate.setMonth(startDate.getMonth() - 1)
            endDate.setMonth(endDate.getMonth() + 2)
            let roomTypeRealPriceList = []
            let startIndex = 0
            let endIndex = 0
            let param = {
                startDay: formatDate(startDate),
                endDay: formatDate(endDate),
                innId: INNID
            };
            publicHttpServer.getRoomTypeRealPrice(param).then(result => {
                if (result.code === '000000' && result.content) {
                    result.content[0].realPriceList.sort(compare('currDate')).map((item, index) => {
                        let currDate = formatDate(item.currDate)
                        if (currDate === params.startDay)
                            startIndex = index
                        if (currDate === params.endDay)
                            endIndex = index + 1
                    })
                    for (let i = result.content.length; i--;) {
                        let item = result.content[i]
                        let realPrice = item.realPriceList;
                        realPrice.sort(compare('currDate'))
                        roomTypeRealPriceList.push({
                            ...item,
                            realPriceList: realPrice.slice(startIndex, endIndex)
                        })
                    }
                    commit('setRealpriceList', result.content)
                    res(roomTypeRealPriceList)
                }
            })
        })
        Promise.all([getHotelAllRoomType, getRoomTypeRealPrice]).then(res => {
            let roomTypeList = res[0]
            let roomTypeRealPriceList = res[1]
            let clientY = 0
            let id = 0
            let roomAndPriceList = []
            loop:
            for (let i = 0, len = roomTypeList.length; i < len; i++) {
                let roomTypeItem = roomTypeList[i]
                for (let n = roomTypeRealPriceList.length; n--;) {
                    let roomTypeRealPriceItem = roomTypeRealPriceList[n]
                    if (roomTypeItem.roomTypeId === roomTypeRealPriceItem.roomTypeId) {
                        let roomTypeId = roomTypeItem.roomTypeId
                        let roomTypeName = roomTypeItem.roomTypeName;
                        let roomList = roomTypeItem.roomList
                        let realPriceList = roomTypeRealPriceItem.realPriceList.slice(0);
                        for (let j = 0, lenj = roomList.length; j < lenj; j++) {
                            let roomItem = roomList[j]
                            let roomNo = roomItem.roomNo
                            let roomId = roomItem.roomId
                            for (let k = realPriceList.length; k--;) {
                                let item = realPriceList[k]
                                item = Object.assign(item, {
                                    clientX: k,
                                    clientY,
                                    checked: false,
                                    dateView: formatDate(item.currDate),
                                    id,
                                    priceView: toDecimal2(item.realPrice / 100),
                                    // realPrice: item.realPrice / 100,
                                    weekEn: new Date(item.currDate).getDay(),
                                    // roomNo,
                                    roomId,
                                    roomTypeId,
                                    // roomTypeName,
                                })
                                id++
                            }
                            clientY++
                            roomAndPriceList.push({
                                roomNo,
                                roomId,
                                roomTypeId,
                                roomTypeName,
                                realPriceList: deepCopy(realPriceList)
                            })
                        }
                        continue loop;
                    }
                }
            }
            commit('setRoomTypeRealPriceList', roomTypeRealPriceList)
            commit('setRoomAndPriceList', roomAndPriceList)
        })
    },
    /**
     * 请求 节假日列表
     * @param commit
     */
    getFestivalList ({commit}, params) {
        let dateList = [];
        let startDay = +new Date(params.beginDate)
        let oneDay =  3600 * 1000 * 24
        let today = formatDate(new Date())
        for (let i = 0; i < 30; i++) {
            let day = new Date(startDay).getDay()
            let formatedDate = formatDate(startDay)
            dateList.push({
                dateView: formatDate(startDay, 'MM月dd日'),
                date: formatedDate,
                week: `星期${getThisWeekNum(startDay)}`,
                strDate: +new Date(startDay),
                weekend: day === 0 || day === 6,
                today: today === formatedDate,
                weekEn: day,
                isFestival: false
            })
            startDay += oneDay
        }
        getFestival = new Promise(res => {
            publicHttpServer.getFestival(params).then(result => {
                if (result.code === '000000' && result.content) {
                    let festivalList = result.content
                    commit('setFestivalList', festivalList)
                    for (let i = 0, len = dateList.length; i < len; i++) {
                        let item = dateList[i]
                        for (let c = 0, lenc = result.content.length; c < lenc; c++) {
                            let subItem = result.content[c]
                            let dateListDate = item.strDate
                            let festivalStartDate = +new Date(formatDate(subItem.startDate))
                            let festivalEndDate = +new Date(formatDate(subItem.endDate))
                            let festivalDate = +new Date(formatDate(subItem.festivalDate))
                            if (dateListDate >= festivalStartDate && dateListDate <= festivalEndDate) {
                                if (dateListDate === festivalDate)
                                    item.isFestivalName = subItem.name.slice(0, -1);
                                item.isFestival = true;
                            }
                        }
                    }
                    res(dateList)
                    commit('setDateList', dateList)
                }
            })
        })
    },
    getHotelOrderList ({commit, getters}, params) {
        let getHotelStatusOrder = new Promise(res => {
            hotelStatusApiSercers.getHotelStatusOrder({
                ...params,
                innId: INNID
            }).then(result => {
                if (result.code === '000000' && result.content) {
                    res(result.content)
                }
            })
        })

        Promise.all([getHotelAllRoomType, getHotelStatusOrder, getHotelOrderFrom]).then(res => {
            let hotelOrderList = res[1]
            let roomIds = getters.roomList.map(item => item.roomId)
            for(let i = hotelOrderList.length; i--;) {
                hotelOrderList[i] = mainOrderDataProcess(hotelOrderList[i], getters.orderFromList, roomIds, params.startMill)
            }
            commit('setSuborderList', hotelOrderList)
            commit('setHotelOrderList', hotelOrderList)
        })
    }
}
