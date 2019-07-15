/**
 * Created with fly.
 * User: z1163764648@qq.com
 * Date: 18-5-17
 * Time: 上午11:47
 *
 */
import {
    formatDate,
    objectDeepCopy,
    changeMoney
} from 'common_libs/util.js'
import publicActions from 'common_store/actions'
import { financeApiService } from '../api/API'

export default {
    ...publicActions,
    // 当前日期选择类型
    curdate({ commit }, payload) {
        commit('CURDATE', payload)
    },

    initTimeStamp({ commit }, payload) {
        commit('INITTIMESTAMP', payload)
    },
    initTimeStampMonth({ commit }, payload) {
        commit('INITTIMESTAMPMONTH', payload)
    },
    // 收支流水表/支付流水
    getEarnAndPay ({ commit }, payload) {
        financeApiService.getEarnAndPayServic(payload).then(res => {
            if(res.code == '000000') {
                if (!res.content.datas) {
                    let result = {
                        lists: [],
                        total: 0
                    }
                    commit('GETEARNANDPAY', result)
                } else {
                    let  tempRes = objectDeepCopy(res.content.datas)
                    for (let i = 0, len = res.content.datas.length; i < len; i++) {
                        let date = Number(res.content.datas[i].date)
                        tempRes[i].date = payload.queryType == 1 ? (formatDate(date, 'MM-dd')) : formatDate(date, 'yyyy-MM')
                        tempRes[i].timeStamp = date
                        tempRes[i].sumMoney = changeMoney(res.content.datas[i].sumMoney)
                    }
                    let result = {
                        lists: tempRes,
                        total: res.content.total
                    }
                    commit('GETEARNANDPAY', result)
                }
                
            } else {
                Message.error(result.message)
                let result = {
                    lists: [],
                    total: 0
                }
                commit('GETEARNANDPAY', result)
            }
            
        })
    },

    //收支流水/收支明细详情 && 收支流水/支付方式下收支明细详情
    getFinancailDetail ({ commit }, payload) {
        var flag = false
        var param = payload
        if (payload.detailType) {
            flag = true
            param = payload.data
        } else {
            flag = false
        }
        financeApiService.getFinancailDetailServic(param).then(res => {
            if(res.code == "000000") {
                if (!res.content.datas) {
                    let result = {
                        lists: [],
                        total: 0
                    }
                    if (flag) {
                        commit('GETFINANCAILPayWayDETAIL', result)
                    } else {
                        commit('GETFINANCAILDETAIL', result)
                    }
                } else {
                    let tempRes = objectDeepCopy(res.content.datas)
                    var arr = [] //新生成自己想要的列表
                    for(var i = 0; i < tempRes.length; i++){
                        var obj = tempRes[i];
                        var tempCreateTime = formatDate(obj.createTime, 'MM-dd hh : mm : ss')
                        arr.push({
                            "createTime": tempCreateTime || '--',
                            "channelName":obj.channelName || '--',
                            "roomNum":roomNumberFunc(obj.roomDetails) || '--',
                            "checkInOut":checkInOutFunc(obj.roomDetails) || '--',
                            "linkManName":obj.linkManName || "--",
                            "contactWay":obj.contactWay || "--",
                            "payWayName":obj.payWayName || "--",
                            "payItemName":obj.payItemName || "--" ,
                            "sumMoney": changeMoney(obj.sumMoney) || "--",
                            "orderId":obj.orderId || "--", 
                        })
                    }
                     //房间号
                    function roomNumberFunc(roomDetails) {
                        let roomNumArr = []
                        for (let i = 0, len = roomDetails.length; i < len; i++) {
                            roomNumArr.push(roomDetails[i].roomNum)
                        }
                        return roomNumArr
                    }
                     // 住离日期
                    function checkInOutFunc(roomDetails) {
                        let checkInOut = []
                        for (let i = 0, len = roomDetails.length; i < len; i++) {
                            let temp = formatDate(roomDetails[i].checkInDate, 'MM-dd') + ' 至 ' + formatDate(roomDetails[i].checkOutDate, 'MM-dd')
                            checkInOut.push(temp)
                        }
                        return checkInOut 
                    }
                    let result = {
                        lists: arr,
                        total: res.content.total
                    }
                    if (flag) {
                        commit('GETFINANCAILPayWayDETAIL', result)
                    } else {
                        commit('GETFINANCAILDETAIL', result)
                    }
                }
            } else {
                Message.error(result.message)
                let result = {
                    lists: [],
                    total: 0
                }
                if (flag) {
                    commit('GETFINANCAILPayWayDETAIL', result)
                } else {
                    commit('GETFINANCAILDETAIL', result)
                }
            }
        })
    },
    // 收支明细下拉框渠道过滤
    setChannelIds ({ commit }, payload) {
        let flag = false
        let param = payload
        // 区分是否带支付方式的调用
        if (payload.payWay == true) {
            flag = true
            param = payload.data
        } else {
            flag = false
        }
        // return
        // 显示的渠道 = 默认渠道 + 空渠道 + 有订单但是被删除了的渠道
        let val = payload.data.channelIds
        let arr = [] // 自定义渠道
        let tempArr = []
        let defaultChannel = [] // 默认渠道
        // 过滤 自定义渠道  和 默认渠道 
        for (let i = 0, len = val.length; i < len; i++) {
            if (val[i].channelType == 2) {
                arr.push(val[i].id)
                tempArr.push(val[i])
            } else {
                defaultChannel.push({
                    id: val[i].id,
                    channelName: val[i].channelName
                })
            }
        } 
        //过滤被删除的 deleted == 0 没有删除
        var nullChannel = [] // 空渠道
        for (let i = 0, len = tempArr.length; i < len; i++) {
            if (tempArr[i].deleted == 0) {
                nullChannel.push({
                    id: tempArr[i].id,
                    channelName: tempArr[i].channelName
                })
            }
        }
        let channelIds = new Set(arr)
        let requstSelfChanel = {
            startDate: payload.data.startDate,
            endDate: payload.data.endDate,
            channelIds: channelIds,
        } 
        financeApiService.financailDetailFilterChannel(requstSelfChanel).then(res => {
            if (res.code == '000000' ){
                let temp = []
                for (let i = 0, len = res.content.length; i < len; i++) {
                    res.content[i].id =  res.content[i].channelId
                }
                for (let i = 0, len = defaultChannel.length; i < len; i++) {
                    temp.push(defaultChannel[i])
                }
                for (let i = 0, len = nullChannel.length; i < len; i++) {
                    temp.push(nullChannel[i])
                }
                for (let i = 0, len = res.content.length; i < len; i++) {
                    temp.push(res.content[i])
                }
                let obj = {}
                for (let j = 0; ;j++) {
                    if (j >= temp.length ) {
                        break
                    }
                    if (obj[temp[j].id] == undefined) {
                        obj[temp[j].id] = 1
                    } else {
                        temp.splice(j, 1)
                        j--
                    }
                }
                commit('SETCHANELIDS', temp)
            } else {
               Message.error(res.message)
            }
        })
        
    },
    //收支饼状图数据查询接口
    getPaywayPieChart ({ commit }, payload) {

        financeApiService.getPaywayPieChartServic(payload).then(result => {
            if(result){
                if (result.code === '000000' && result.content) {
                    if(!result.content){
                        result.content = []
                    }
                    for(let w = 0;w < result.content.length;w++){
                        result.content[w].sumMoney = result.content[w].sumMoney / 100
                        if(!result.content[w].details){
                            result.content[w].details = []
                        }
                        for(let q = 0;q < result.content[w].details.length;q++){
                            result.content[w].details[q].money = result.content[w].details[q].money / 100
                        }
                    }
                    commit('GETPAYWAYPIECHART', result.content)
                }else{
                    Message.error(result.message)
                    commit('GETPAYWAYPIECHART', [])
                }
            }else{
                commit('GETPAYWAYPIECHART', [])
            }
        })
    },

    //收支柱状图数据查询接口
    getPaywayBarGraph ({ commit }, payload) {
        financeApiService.getPaywayBarGraphServic(payload).then(result => {
            if(result){
                if (result.code === '000000' && result.content) {
                    try {
                        for(let w = 0;w < result.content.length;w++){
                            result.content[w].payIn = result.content[w].payIn / 100
                            result.content[w].payOut = result.content[w].payOut / 100
                            result.content[w].surplus = result.content[w].surplus / 100
                        }
                    }
                    catch(err){
                        commit('GETPAYWAYBARGRAPH', [])
                        return
                    }
                    commit('GETPAYWAYBARGRAPH', result.content)
                }else{
                    Message.error(result.message)
                    commit('GETPAYWAYBARGRAPH', [])
                }
            }else{
                commit('GETPAYWAYBARGRAPH', [])
            }
        })
    },


    // 渠道

    // 渠道日期选择类型
    channeldate({ commit }, payload) {
        commit('CHANNELDATE', payload)
    },

    timeStampsChannel({ commit }, payload) {
        commit('TIMESTAMPSCHANNEL', payload)
    },

    //渠道应收款
    getChannelReList ({ commit }, payload) {
        financeApiService.getChannelReListServic(payload).then(result => {
            if(result){
                if (result.code === '000000' && result.content) {
                    if(!result.content.datas){
                        result.content.datas = []
                    }
                    for(let q = 0;q < result.content.length;q++){
                        result.content[q].oughtAmount = result.content[q].oughtAmount / 100
                    }
                    commit('GETCHANNELRELIST', result.content.datas)
                }else{
                    Message.error(result.message)
                    commit('GETCHANNELRELIST', [])
                }
            }else{
                commit('GETCHANNELRELIST', [])
            }
            
        })
    },
    
    //渠道日应收款
    getChannelDayReList ({ commit }, payload) {
        financeApiService.getChannelDayReListServic(payload).then(result => {
            if(result){
                if (result.code === '000000' && result.content) {
                    if(!result.content.datas){
                        result.content.datas = []
                    }
                    for(let q = 0;q < result.content.datas.length;q++){
                        result.content.datas[q].date = formatDate(Number(result.content.datas[q].date))
                    }
                    commit('GETCHANNELDAYRELIST', result.content)
                }else{
                    Message.error(result.message)
                    commit('GETCHANNELDAYRELIST', {
                        datas:[],
                        total:0
                    })
                }
            }else{
                commit('GETCHANNELDAYRELIST', {
                    datas:[],
                    total:0
                })
            }
        })
    },

    //渠道订单详情
    getChannelOrderDetailList ({ commit }, payload) {
        financeApiService.getChannelOrderDetailListServic(payload).then(result => {
            if(result){
                if (result.code === '000000' && result.content) {
                    if(!result.content.datas){
                        result.content.datas = []
                    }
                    for(let q = 0;q < result.content.datas.length;q++){
                        for(let w = 0;w < result.content.datas[q].roomDetails.length;w++){
                            result.content.datas[q].roomDetails[w].checkInDate = formatDate(result.content.datas[q].roomDetails[w].checkInDate, 'MM-dd')
                            result.content.datas[q].roomDetails[w].checkOutDate = formatDate(result.content.datas[q].roomDetails[w].checkOutDate, 'MM-dd')
                            result.content.datas[q].roomDetails[w].allDate = result.content.datas[q].roomDetails[w].checkInDate + '至' + result.content.datas[q].roomDetails[w].checkOutDate
                        }
                    }
                    for(let q = 0;q < result.content.datas.length;q++){
                        if(!result.content.datas[q].channelName){
                            result.content.datas[q].channelName = '无'
                        }
                    }
                    commit('GETCHANNELORDERDETAILLIST', result.content)
                }else{
                    Message.error(result.message)
                    commit('GETCHANNELORDERDETAILLIST', {
                        datas:[],
                        total:0
                    })
                }
            }else{
                commit('GETCHANNELORDERDETAILLIST', {
                    datas:[],
                    total:0
                })
            }
        })
    },

    // 渠道日应收ID集合
    setChannelDayIds({ commit }, payload) {
        commit('CHANNELDAYIDS', payload)
    },

    // 渠道订单详情ID集合
    setChannelOrderInfoIds({ commit }, payload) {
        commit('CHANNELORDERINFOIDS', payload)
    },
}
