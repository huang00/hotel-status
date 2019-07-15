/**
 * Created with fly.
 * User: z1163764648@qq.com
 * Date: 18-5-17
 * Time: 下午12:19
 *
 */
import publicMutations from 'common_store/mutations'

export default {
    ...publicMutations,
    MINUSTHECURRENTNEEDTOQUERYTHESTARTTIME(state, newStartDay) {
        return state.hotelOrder.dateAndTimePicker.theCurrentNeedToQueryTheStartTime = new Date(newStartDay);
    },
    CREATDATELIST(state, dateList) {
        return state.hotelOrder.dateAndTimePicker.dateList = dateList;
    },
    ADDTHECURRENTNEEDTOQUERYTHESTARTTIME(state, newStartDay) {
        return state.hotelOrder.dateAndTimePicker.theCurrentNeedToQueryTheStartTime = new Date(newStartDay);
    },
    CHANGETHECURRENTNEEDTOQUERYTHESTARTTIME(state, newStartDay) {
        return state.hotelOrder.dateAndTimePicker.theCurrentNeedToQueryTheStartTime = new Date(newStartDay);
    },
}
