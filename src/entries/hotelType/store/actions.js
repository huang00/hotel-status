/**
 * Created with fly.
 * User: z1163764648@qq.com
 * Date: 18-5-17
 * Time: 上午11:47
 *
 */

import publicActions from 'common_store/actions'
import {pageloadCheckNavigator} from 'common_libs/util.js'
import {innRoomTypeApiServers} from '../api/API'

export default {
    ...publicActions,
    /**
     * 请求 房态房型以及房间列表
     * @param commit
     * @returns {*}
     * @param param
     */
    dispatchGetHotelRoomTypeInfoList({commit}, param) {
        innRoomTypeApiServers.findRoomTypeAllRoom(param).then(result => {
            if (result.code === '000000')
                commit('GETHOTELROOMTYPEINFOLIST', result)
        })
    },
    /**
     * 獲取所有房型房間的信息
     * @param commit
     * @returns {*}
     */
    dispatchGetHotelAllOrdersInfo({commit}) {
        try {
            return httpRequestor.get('http://192.168.0.198:3000/hotelOrderInfo').then(result => {
                if (result.code === '000000')
                    commit('GETHOTELALLORDERSINFO', result)
            })
        } catch (e) {
            return pageloadCheckNavigator(e)
        }
    },
    /**
     * 提交修改返回的订单原始数据
     * @param commit
     * @param state
     * @param param 修改后的定单的原始数据
     */
    dispatchRequestHotelOrderChange({commit}, param) {
        return commit('DISPATCHREQUESTHOTELORDERCHANGE', param)
    },
    /**
     * 根据修改后的或者原始的返回数据 解析成为视图数据
     * @param commit
     * @param param
     * @returns {*}
     */
    dispatchAnalysisResponseOrderInfo({commit}, param) {
        return commit('ANALYSISRESPONSEORDERINFO', param)
    },
    /**
     * 獲取所有已经被占用的房间坐标
     * @param commit
     * @returns {*}
     * @param state
     */
    dispatchGetHotelRoomBeOccupied({commit, state}) {
        let hotelOrderInfoList = state.hotelStatus.hotelOrderInfoList;
        let cantSelectList = [];
        for (let i = 0; i < hotelOrderInfoList.length; i++) {
            let cantSelectStartY = hotelOrderInfoList[i].vmviewNodeStartY;
            let cantSelectStartX = hotelOrderInfoList[i].vmviewNodeStartX;
            for (let j = 0; j < hotelOrderInfoList[i].vmOrderDate; j++) {
                let cantSelectObj = {cantSelectX: (cantSelectStartX + j), cantSelectY: cantSelectStartY};
                cantSelectList.push(cantSelectObj)
            }
        }
        return commit('GETHOTELROOMBEOCCUPIED', cantSelectList)
    },
    dispatchHotelOrderInfoListModify({commit}, param) {
        commit('HOTELORDERINFOLISTMODIFY', param)
    },
    /**
     *当鼠标按下或者松开后改变鼠标状态
     * @param commit
     * @returns {*}
     * @param dropDownIsStatus
     */
    dispatchChangeThisOrderDownIsTrueStatus({commit}, dropDownIsStatus) {
        return commit('CHANGETHISORDERDOWNISTRUESTATUS', dropDownIsStatus)
    },
    /**
     * 当鼠标松开后弹出当前的提示窗口
     * @returns {*}
     */
    dispatchWhenChangeOrderAndUpIsTrue({commit}, prama) {
        return commit('WHENCHANGEORDERANDUPISTRUE', prama)
    },
    /**
     * 检测当前选择的是否为入住订单
     * @param commit
     * @param isCheckInOrderChange
     * @returns {*}
     */
    dispatchCheckIsCheckInOrderChange({commit}, isCheckInOrderChange) {
        return commit('CHECKISCHECKINORDERCHANGE', isCheckInOrderChange)
    },

    /**
     * 开启查看详细模态框
     * @param commit
     * @param param
     * @returns {*}
     */
    dispatchWatchOpenLookingModal({commit}, param) {
        return commit('WATCHOPENLOOKINGMODAL', param)
    },
    /**
     * 开启编辑模态框
     * @param commit
     * @param param
     * @returns {*}
     */
    dispatchWatchOpenEditingModal({commit}, param) {
        return commit('WATCHOPENEDITINGMODAL', param)
    },
    /**
     * 当用户打开编辑模态框时 当前模态框消费信息数据处理
     * @param commit
     * @param param
     * @returns {*}
     */
    dispatchWhenOpenEditModalData({commit}, param) {
        return commit('WHENOPENEDITMODALDATA', param)
    },
    dispatchRefreshSpecialPrice({commit}) {
        return commit('REFRESHSPECIALSPRICE')
    },
    /**
     * 获取节假日列表  festivalList
     * @param commit
     * @returns {*}
     */
    dispatchFestivalList ({commit}) {
        let date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 1;
        let beginDateY , beginDateM, endDateY, endDateM;
        if (month - 6 <= 0) {
            beginDateY = year - 1
            beginDateM = 12 - Math.abs(month - 6)
        } else {
            beginDateY = year
            beginDateM = month - 6
        }
        if (month + 6 > 12) {
            endDateY = year + 1
            endDateM = month + 6 - 12
        } else {
            endDateY = year
            endDateM = month + 6
        }
        let params = {
            beginDate: `${beginDateY}-${beginDateM}-01`,
            endDate: `${endDateY}-${endDateM}-01`
        };
        try {
            innRoomTypeApiServers.getFestival(params).then(result => {
                if (result.code === '000000') {
                    commit('GETFESTIVALLIST', result.content)
                }
            })
        } catch (e) {
            return pageloadCheckNavigator(e)
        }
    },
    dispatchChannelList({commit}, param) {
        return commit('GETCHANNELLIST', param)
    }
}

function dispatchAnalysisResponseOrderInfonow(commit, param) {
    return commit('ANALYSISRESPONSEORDERINFO', param)
}
