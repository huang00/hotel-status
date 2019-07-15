/**
 * Created with fly.
 * User: z1163764648@qq.com
 * Date: 18-5-22
 * Time: 上午9:32
 *
 */

export const hotelStatus = {
    state: {
        hotelRoomTypeInfoList: [],
        hotelRoomList: [],
        requestHotelOrderInfoList: [],
        hotelOrderInfoList: [],
        HotelRoomBeOccupiedList: [],
        hotelOrderDownIsTrue: false,
        isCheckInOrderChange: false, // 是否选择的入住订单
        hotelOrderChangeToolTipBox: {
            isOpen: false,
        },
        hotelOrderWatchLookingModal: {
            isOpen: false,
        },
        hotelOrderWatchEditingModal: {
            isOpen: false,
        },
        hotelModalWinLastOrderList: [],
        refreshSpecialPrice: true,
        festivalList: [], // 节假日列表
        channelList: [] // 渠道列表
    }
}
