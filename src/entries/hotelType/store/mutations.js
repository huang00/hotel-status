/**
 * Created with fly.
 * User: z1163764648@qq.com
 * Date: 18-5-17
 * Time: 下午12:19
 *
 */
import publicMutations from 'common_store/mutations'
import {timeStampTransformation, formatDate, deepCopy, toDecimal2} from 'common_libs/util.js'
import $ from 'jquery'
import {
    dateCalculation
} from '../libs/util'

const ALLORDERDIVWIDTH = 95; // 订单单元格默认宽度
const ALLORDERDIVHEIGHT = 75; // 订单单元格默认高度
const orderDetaile = $('.chronologicalOrderUl .OrderDetaile');
const hotelRoomList = $('.hotelRoomTypeInfoContainer .roomNumber');

export default {
    ...publicMutations,
    GETHOTELROOMTYPEINFOLIST(state, result) {
        /* 数据处理 价格分转换为 -> 元 */
        if (result.content && result.code === '000000') {
            let list = result.content
            for (let i = 0, len = list.length; i < len; i++) {
                list[i].defaultPrice = toDecimal2(list[i].defaultPrice / 100)
            }
            return state.hotelStatus.hotelRoomTypeInfoList = list
        }
    },
    USEHOTELROOMTYPECREATROOM(state, roomList) {
        return state.hotelStatus.hotelRoomList = roomList
    },
    /**
     * 第一次提交原始数据
     * @param state
     * @param result
     * @returns {*}
     * @constructor
     */
    GETHOTELALLORDERSINFO(state, result) {
        return state.hotelStatus.requestHotelOrderInfoList = result.content;
    },
    /**
     * 当修改订单时修改后台传递的原始数据
     * @param state
     * @param param
     * @returns {*}
     * @constructor
     */
    DISPATCHREQUESTHOTELORDERCHANGE(state, param) {
        return state.hotelStatus.requestHotelOrderInfoList = param;
    },
    ANALYSISRESPONSEORDERINFO(state, param) {
        let hotelOrderList = param;
        let orderDetaile = $('.chronologicalOrderUl .OrderDetaile');
        let hotelRoomList = $('.hotelRoomTypeInfoContainer .roomNumber');
        let lastOrderList = [];
        for (let i = 0; i < hotelOrderList.length; i++) {
            let contactUerName = hotelOrderList[i].contactName;
            let userResource = hotelOrderList[i].ofName;
            let ordertotalPrice = Number(hotelOrderList[i].totalAmount);
            let orderpaidPrice = Number(hotelOrderList[i].paidAmount);
            let orderId = hotelOrderList[i].orderId;
            // let orderStatus = hotelOrderList[i].orderStatus;
            let subsList = hotelOrderList[i].subs;
            for (let c = 0; c < subsList.length; c++) {
                let viewNodeLeft = '5px';
                let viewNodeTop = '5px';
                let viewNodeStartX = 0;
                let viewNodeStartY = 0;
                let roomId = subsList[c].roomId;
                let subId = subsList[c].subId;
                let thisOrderCheckInDate = subsList[c].checkInDate;
                let thisOrderCheckOutDate = subsList[c].checkOutDate;
                let stringCheckOutDate = timeStampTransformation(thisOrderCheckOutDate, 'date');
                let stringCheckInDate = timeStampTransformation(thisOrderCheckInDate, 'date');
                let thisOrderDate = stringCheckOutDate - stringCheckInDate;
                let viewNodeWidth = `${(thisOrderDate * ALLORDERDIVWIDTH) - 10}px`;
                let thisOrderStatus = subsList[c].status;
                let stringorderDetaile = timeStampTransformation($(orderDetaile[0]).attr('date'), 'date');
                let timeDifference = stringorderDetaile - stringCheckInDate;
                timeDifference > 0 ? viewNodeWidth = `${(((thisOrderDate * ALLORDERDIVWIDTH) - 10) - (timeDifference) * ALLORDERDIVWIDTH)}px` : false;
                timeDifference > 0 ? thisOrderDate -= timeDifference : false;
                let viewNodeObj = {};
                for (let j = 0; j < orderDetaile.length; j++) {
                    if (thisOrderCheckInDate === $(orderDetaile[j]).attr('date')) {
                        viewNodeLeft = `${(Number($(orderDetaile[j]).attr('viewX')) * ALLORDERDIVWIDTH) + 5}px`;
                        viewNodeStartX = parseFloat($(orderDetaile[j]).attr('viewX'));
                    }
                }
                for (let j = 0; j < hotelRoomList.length; j++) {
                    if (roomId === Number($(hotelRoomList[j]).attr('roomid'))) {
                        viewNodeTop = `${(Number($(hotelRoomList[j]).attr('viewy')) * ALLORDERDIVHEIGHT) + 5}px`;
                        viewNodeStartY = parseFloat($(hotelRoomList[j]).attr('viewy'));
                    }
                }
                viewNodeObj.orderId = orderId;
                viewNodeObj.subId = subId;
                viewNodeObj.vmLeft = viewNodeLeft;
                viewNodeObj.vmviewNodeStartX = viewNodeStartX;
                viewNodeObj.vmviewNodeStartY = viewNodeStartY;
                viewNodeObj.vmTop = viewNodeTop;
                viewNodeObj.vmWidth = viewNodeWidth;
                viewNodeObj.vmUserName = contactUerName;
                viewNodeObj.vmUserResource = userResource;
                viewNodeObj.vmCheckInDate = thisOrderCheckInDate;
                viewNodeObj.vmCheckOutDate = thisOrderCheckOutDate;
                viewNodeObj.vmOrderDate = thisOrderDate;
                viewNodeObj.vmOrderStatus = thisOrderStatus;
                viewNodeObj.vmOrderCzStatus = thisOrderStatus === '0' ?
                    '預' : thisOrderStatus === '1' ?
                        '住' : thisOrderStatus === '2' ?
                            '退' : thisOrderStatus === '3' ?
                                '补' : false;
                viewNodeObj.vmTotalPrice = ordertotalPrice;
                viewNodeObj.vmReservePrice = ordertotalPrice - orderpaidPrice;
                parseFloat(viewNodeObj.vmWidth) > 0 ? lastOrderList.push(viewNodeObj) : false;
            }
        }
        return state.hotelStatus.hotelOrderInfoList = lastOrderList;
    },
    /**
     * 当前订单确认换房时的处理
     * @param state
     * @param param
     * @returns {*|Array}
     * @constructor
     */
    HOTELORDERINFOLISTMODIFY(state, param) {
        let orderDetaile = $('.chronologicalOrderUl .OrderDetaile');
        let hotelRoomList = $('.hotelRoomTypeInfoContainer .roomNumber');
        let hotelOrderInfoList = state.hotelStatus.hotelOrderInfoList;
        let hotelOrderInfoNumber = hotelOrderInfoList[param.modifyvalue];
        let newCheckOutOrder = {};
        if (hotelOrderInfoNumber.vmCheckInDate !== formatDate(new Date())) {
            newCheckOutOrder = deepCopy(hotelOrderInfoNumber);
        } else newCheckOutOrder = false;
        let orderId = param.modifyOrderId;
        let subId = param.modifySubId;
        if (hotelOrderInfoNumber.orderId === orderId && hotelOrderInfoNumber.subId === subId) {
            let checkInDate = param.modifychangeTime;
            let roomId = param.modifyRoomId;
            let orderDate = hotelOrderInfoNumber.vmOrderDate;
            let checkOutDate = hotelOrderInfoNumber.vmCheckOutDate;
            let viewNodeLeft, viewNodeStartX, viewNodeTop, viewNodeStartY;
            for (let j = 0; j < orderDetaile.length; j++) {
                if (checkInDate === $(orderDetaile[j]).attr('date')) {
                    viewNodeLeft = `${(Number($(orderDetaile[j]).attr('viewX')) * ALLORDERDIVWIDTH) + 5}px`;
                    viewNodeStartX = parseFloat($(orderDetaile[j]).attr('viewX'));
                }
            }
            for (let j = 0; j < hotelRoomList.length; j++) {
                if (roomId === Number($(hotelRoomList[j]).attr('roomid'))) {
                    viewNodeTop = `${(Number($(hotelRoomList[j]).attr('viewy')) * ALLORDERDIVHEIGHT) + 5}px`;
                    viewNodeStartY = parseFloat($(hotelRoomList[j]).attr('viewy'));
                }
            }
            hotelOrderInfoNumber.vmCheckInDate = param.modifychangeTime;
            hotelOrderInfoNumber.vmLeft = viewNodeLeft;
            hotelOrderInfoNumber.vmTop = viewNodeTop;
            hotelOrderInfoNumber.vmviewNodeStartX = viewNodeStartX;
            hotelOrderInfoNumber.vmviewNodeStartY = viewNodeStartY;
            if (!param.modifyIsCheckInOrder) {
                let strCheckOutDate = dateCalculation(checkInDate, orderDate, '+');
                hotelOrderInfoNumber.vmCheckOutDate = formatDate(strCheckOutDate);
            } else {
                let checkOutDateStrDate = timeStampTransformation(checkOutDate, 'date');
                let checkInDateStrDate = timeStampTransformation(checkInDate, 'date');
                let changeCheckInWidth = checkOutDateStrDate - checkInDateStrDate;
                hotelOrderInfoNumber.vmWidth = `${(changeCheckInWidth * ALLORDERDIVWIDTH) - 10}px`;
                hotelOrderInfoNumber.vmOrderDate = changeCheckInWidth;
                if (newCheckOutOrder) {
                    let newCheckOutOrderDate = newCheckOutOrder.vmOrderDate - changeCheckInWidth;
                    newCheckOutOrder.vmWidth = `${newCheckOutOrderDate * ALLORDERDIVWIDTH - 10}px`;
                    newCheckOutOrder.vmOrderStatus = '2';
                    newCheckOutOrder.vmOrderDate = newCheckOutOrderDate;
                    newCheckOutOrder.vmOrderCzStatus = '退';
                    hotelOrderInfoList.push(newCheckOutOrder)
                }
            }
        }
        $('.cantSelect').attr('class', 'selectHotelRoom');
        return hotelOrderInfoList
    },
    GETHOTELROOMBEOCCUPIED(state, result) {
        return state.hotelStatus.HotelRoomBeOccupiedList = result;
    },
    /**
     * 检测是否当前选择的为入住订单
     * @param state
     * @param result
     * @returns {*}
     * @constructor
     */
    CHECKISCHECKINORDERCHANGE(state, result) {
        return state.hotelStatus.isCheckInOrderChange = result;
    },
    /**
     * 检测当前订单鼠标状态是否为按下状态
     * @param state
     * @param dropDownIsStatus
     * @returns {*}
     * @constructor
     */
    CHANGETHISORDERDOWNISTRUESTATUS(state, dropDownIsStatus) {
        return state.hotelStatus.hotelOrderDownIsTrue = dropDownIsStatus;
    },
    /**
     * 当鼠标松开后弹出当前的提示窗口
     * @returns {*}
     */
    WHENCHANGEORDERANDUPISTRUE(state, prama) {
        return state.hotelStatus.hotelOrderChangeToolTipBox = prama;
    },
    /**
     * 检测当前是否打开查看详情模态框
     * @param state
     * @param prama
     * @returns {*}
     * @constructor
     */
    WATCHOPENLOOKINGMODAL(state, prama) {
        return state.hotelStatus.hotelOrderWatchLookingModal = prama;
    },
    /**
     * 检测当前是否打开编辑详情模态框
     * @param state
     * @param prama
     * @returns {*}
     * @constructor
     */
    WATCHOPENEDITINGMODAL(state, prama) {
        return state.hotelStatus.hotelOrderWatchEditingModal = prama;
    },
    WHENOPENEDITMODALDATA(state, prama) {
        return state.hotelStatus.hotelModalWinLastOrderList = prama;
    },
    /**
     * 刷新特殊价格
     */
    REFRESHSPECIALSPRICE(state) {
        return state.hotelStatus.refreshSpecialPrice = !state.hotelStatus.refreshSpecialPrice;
    },
    /**
     * 获取节假日列表
     * @param state
     * @param prama
     * @returns {*}
     * @constructor
     */
    GETFESTIVALLIST(state, param) {
        return state.hotelStatus.festivalList = param
    },
    /**
     * 获取节假日列表
     * @param state
     * @param prama
     * @returns {*}
     * @constructor
     */
    GETCHANNELLIST(state, param) {
        return state.hotelStatus.channelList = param
    }
}
