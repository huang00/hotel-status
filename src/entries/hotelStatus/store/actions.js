/**
 * Created with fly.
 * User: z1163764648@qq.com
 * Date: 18-5-17
 * Time: 上午11:47
 *
 */

import publicActions from 'common_store/actions'
import {
    formatStamp,
    getCookie,
} from 'common_libs/util.js'
import {hotelStatusApiSercers} from '../api/API'

export default {
    ...publicActions,
    /**
     *  请求 今日遇到订单
     * @param commit
     */
    dispatchGetHotelTodayInOrder({commit}) {
        let param = {
            userId: getCookie('userId'),
            innId: getCookie('innId')
        };
        hotelStatusApiSercers.todayIn(param).then(result => {
            if (result.code === '000000' && result.content) {
                for (let i = 0; i < result.content.length; i++) {
                    let checkInAt = result.content[i].checkInAt;
                    let checkOutAt = result.content[i].checkOutAt;
                    result.content[i].checkInAt = formatStamp(checkInAt);
                    result.content[i].checkOutAt = formatStamp(checkOutAt);
                }
                commit('GETHOTELTODAYINORDER', result.content)
            }
        })
    },
    /**
     *  请求 今日遇离订单
     * @param commit
     */
    dispatchGetHotelTodayOutOrder({commit}) {
        let param = {
            userId: getCookie('userId'),
            innId: getCookie('innId')
        };
        hotelStatusApiSercers.todayOut(param).then(result => {
            if (result.code === '000000' && result.content) {
                for (let i = 0; i < result.content.length; i++) {
                    result.content[i].checkInAt = formatStamp(result.content[i].checkInAt)
                    result.content[i].checkOutAt = formatStamp(result.content[i].checkOutAt)
                }
                commit('GETHOTELTODAYOUTORDER', result.content)
            }
        })
    }
}
