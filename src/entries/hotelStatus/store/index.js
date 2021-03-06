import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import {hotelStatus} from './modules/state'
import publicState from 'common_store/state'

Vue.use(Vuex)

const state = {
    ...publicState,
    roomList: [], // 所有的房间
    roomAndPriceList: [], // 所有房间包括价格
    festivalList: []  // 节假日列表
}
const store = new Vuex.Store({
    strict: window.gDevEnv,
    state,
    getters,
    actions,
    mutations,
    modules: {
        hotelStatus
    }
})

// 热更新
if (module.hot) {
    module.hot.accept([
        // state不支持热更新
        './getters',
        './actions',
        './mutations',
        './modules/state',
    ], () => {
        store.hotUpdate({
            // 获取更新后的模块。因为 babel 6 的模块编译格式问题，这里需要加上 .default
            getters: require('./getters').default,
            actions: require('./actions').default,
            mutations: require('./mutations').default,
            modules: {
                events: require('./modules/state').default,
            }
        })
    })
}

export default store
