/**
 * Created with fly.
 * User: z1163764648@qq.com
 * Date: 18-5-17
 * Time: 上午11:47
 *
 */
import publicActions from 'common_store/actions'

export default {
    /**
     * 点击查看以前的时间
     * @param commit
     * @param startDay
     * @returns {*}
     */
    ...publicActions,
    disptchMinusTheCurrentNeedToQueryTheStartTime({commit}, startDay) {
        let newStartDay = new Date(startDay.setDate(startDay.getDate() - 30)); // 每次点击减时间 减去30天
        return commit('MINUSTHECURRENTNEEDTOQUERYTHESTARTTIME', newStartDay)
    },
}
