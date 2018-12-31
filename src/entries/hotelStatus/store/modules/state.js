/**
 * Created with fly.
 * User: z1163764648@qq.com
 * Date: 18-5-22
 * Time: 上午9:32
 *
 */

export const hotelStatus = {
    state: {
        dateList: [], // 所有当前页时间列表
        theCurrentNeedToQueryTheStartTime: new Date(), // 当前开始的时间
        setHotelOrderList: [], // 订单列表
        suborderList: [], // 子订单列表
        roomTypeRealPriceList: [], // 房型真是价格（处理过的数据）
        hotelTodayInOrderList: [], // 原始数据 今日遇到订单集合
        hotelTodayOutOrderList: [], // 原始数据 今日遇离订单集合
        hotelWaitDispatchList: [], // 原始数据 待分房订单集合
        realpriceList: [] // 真实价格列表（未处理过的数据）
    },
    getters: {
        hotelRoomList: (state) => state.hotelRoomList,
        dateList: (state) => state.dateList,
        theCurrentNeedToQueryTheStartTime: (state) => state.theCurrentNeedToQueryTheStartTime,
        hotelOrderList: (state) => state.hotelOrderList,
        suborderList: (state) => state.suborderList,
        roomTypeRealPriceList: (state) => state.roomTypeRealPriceList
    }
};
