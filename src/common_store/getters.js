/*
 * @Author: huangchao 
 * @Date: 2018-12-06 11:09:16 
 * @Last Modified by: huangchao
 * @Last Modified time: 2019-01-18 10:46:16
 */

export default {
    orderFromList: (state) => state.orderFromList, // 订单来源列表
    orderPaymentList: (state) => state.orderPaymentList,    // 订单支付方式
    orderPaymentTypeList: (state) => state.orderPaymentTypeList,    // 订单支付类型
    roomTypeList: (state) => state.roomTypeList,    // 房型列表
    roomList: (state) => state.roomList,     // 房间列表
    roomAndPriceList: (state) => state.roomAndPriceList,
    festivalList: (state) => state.festivalList,
    realpriceList: (state) => state.realpriceList,
    userInfo: (state) => state.userInfo, // 用户信息
    hotelList: (state) => state.hotelList, // 客栈列表
    allPermissionList: (state) => state.allPermissionList, // 所有菜单权限列表
    userPermissionList: (state) => state.userPermissionList
}
