/**
 * Created with fly.
 * User: z1163764648@qq.com
 * Date: 18-5-17
 * Time: 下午12:19
 *
 */
import Vue from 'vue'
import publicMutations from 'common_store/mutations'

export default {
    ...publicMutations,
    /* 设置时间轴数据 */
    setDateList (state, data) {
        state.hotelStatus.dateList = data
    },
    setTheCurrentNeedToQueryTheStartTime (state, data) {
        state.hotelStatus.theCurrentNeedToQueryTheStartTime = data
    },
    setHotelOrderList (state, data) {
        Vue.set(state.hotelStatus,'hotelOrderList', data)
    },
    setSuborderList (state, hotelOrderList) {
        let suborderList = []
        for(let i = hotelOrderList.length; i--;) {
            let item = hotelOrderList[i]
            item.suborders.map(subItem => {
                suborderList.push(Object.assign(subItem, {
                    contactName: item.contactName,
                    paidAmountView: item.paidAmountView,
                    depositView: item.depositView,
                    totalAmountView: item.totalAmountView,
                    orderFrom: item.orderFrom,
                    impactRemind: false,
                    showDetails: false
                }))
                return subItem
            })
        }
        state.hotelStatus.suborderList = suborderList
    },
    setRoomTypeRealPriceList (state, data) {
        state.hotelStatus.roomTypeRealPriceList = data
    },
    GETHOTELTODAYINORDER(state, content) {
        return state.hotelStatus.hotelTodayInOrderList = content;
    },
    GETHOTELTODAYOUTORDER(state, content) {
        return state.hotelStatus.hotelTodayOutOrderList = content;
    }
}
