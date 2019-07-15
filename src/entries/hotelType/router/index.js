import VueRouter from 'vue-router'
// import {setCookie} from 'common_libs/util';
import {testTokenEffectiveness,setCookie} from 'url-config'
// 注释里的是分块js名，加user_center_前缀是为避免和某个入口或chunk同名，否则会无法运行
// 登陆路由 模块
const Main = r => import('common_components/Main/').then(r);
// const hotelType = r => import(/* webpackChunkName: "views/login" */'../views/hotelType/hotelType').then(r);
const hotelType = r => import('../views/hotelType/hotelType').then(r);
const channelManage = r => import('../views/channelManage/eBooking/').then(r);
const ownChannel = r => import('../views/channelManage/ownChannel/ownChannel').then(r);
const roomAmount = r => import('../views/roomAmountManage/roomAmount').then(r);
const hotelInfo = r => import('../views/hotelInfo/hotelInfo').then(r);
const staffAccount = r => import('../views/staffAccount/staffAccount').then(r);

const routes = [
    {
        path: '/',
        component: Main,
        children: [
            {
                path: '',
                name: 'hotelType',
                component: hotelType
            },
            {
                path: 'channelManage',
                name: 'channelManage',
                component: channelManage
            },
            {
                path: 'ownChannel',
                name: 'ownChannel',
                component: ownChannel
            },
            {
                path: 'roomAmount',
                name: 'roomAmount',
                component: roomAmount
            },
            {
                path: 'hotelInfo',
                name: 'hotelInfo',
                component: hotelInfo
            },
            {
                path: 'staffAccount',
                name: 'staffAccount',
                component: staffAccount
            }
        ]
    },
]

// 创建 router 实例
const router = new VueRouter({
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        return {x: 0, y: 0}
    },
})
router.beforeEach((to, from, next) => {
    testTokenEffectiveness().then(resolve => {
        if (resolve) {
            next()
        } else {
            window.location.href = `/index/index.html`
        }
    })
});
router.afterEach(({ to }) => {
    let main = document.getElementsByTagName('main')
    if (main.length > 0) {
        document.getElementsByTagName('main')[0].scrollTop = 0;
    }
})

export default router;
