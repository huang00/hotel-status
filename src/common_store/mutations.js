/*
 * @Author: huangchao 
 * @Date: 2018-12-06 11:15:27 
 * @Last Modified by: huangchao
 * @Last Modified time: 2019-01-24 18:05:39
 */

export default {
    /* 设置订单来源列表 */
    setOrderFromList (state, data) {
        state.orderFromList = data
    },
    /* 设置支付方式列表 */
    setOrderPaymentList (state, data) {
        state.orderPaymentList = data
    },
    /* 设置支付类型列表 */
    setOrderPaymentTypeList (state, data) {
        state.orderPaymentTypeList = data
    },
    /* 设置房型列表 */
    setRoomTypeList (state, data) {
        state.roomTypeList = data
    },
    /* 设置房间列表 */
    setRoomList (state, data) {
        state.roomList = data
    },
    /* 设置房间和相关价格 */
    setRoomAndPriceList (state, data) {
        state.roomAndPriceList = data
    },
    /* 设置节假日列表 */
    setFestivalList (state, data) {
        state.festivalList = data
    },
    setRealpriceList (state, data) {
        state.realpriceList = data
    },
    setUserInfo (state, data) {
        state.userInfo = data
    },
    setHotelList (state, data) {
        state.hotelList = data
    },
    setAllPermissionList (state, data) {
        state.allPermissionList = data
    },
    setUserPermissionList (state, data) {
        state.userPermissionList = data
    }
}
