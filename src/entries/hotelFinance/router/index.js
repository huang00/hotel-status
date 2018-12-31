import VueRouter from 'vue-router'
import {setCookie} from 'common_libs/util';
// import {testTokenEffectiveness} from 'url-config'

// 注释里的是分块js名，加user_center_前缀是为避免和某个入口或chunk同名，否则会无法运行
// 登陆路由 模块
const Main = r => import('common_components/Main/').then(r);
const routes = [
    {
        path: '/',
        name: 'main',
        component: Main,
        children: [{
            path: '',
            name: 'hotelFinance',
            component: () => import('../views/hotelFinance/hotelBudget/hotelBudget'),
        },{
            path: 'hotelChannel',
            name: 'hotelChannel',
            component: () => import('../views/hotelFinance/hotelChannel/hotelChannel')
        },{
            path: 'payWaysDetail',
            name: 'payWaysDetail',
            component: () => import('../views/hotelFinance/hotelBudget/payWaysDetail')
        },{
            path: 'dayAllOrder',
            name: 'dayAllOrder',
            component: () => import('../views/hotelFinance/hotelChannel/dayAllOrder')
        }]
    }
];

// 创建 router 实例
const router = new VueRouter({
    routes,
    scrollBehavior(to, from, savedPosition) {
        document.getElementsByTagName('main')[0].scrollTop = 0
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ x: 0, y: 0 })
            }, 500)
        })
    },
})
router.beforeEach((to, from, next) => {
    if (window.location.hostname === 'localhost') {
        setCookie('token', 'ffaa900157ac45dd99de877f9528eba29810d1ecf94f409689115748b4e37fd8');
        setCookie('userId', '34');
        setCookie('innId', '124');
    }
    next()
    // testTokenEffectiveness().then(resolve => {
    //     if (resolve) {
    //         next()
    //     } else {
    //         window.location.href = `${window.gBaseURL}/index/index.html`
    //     }
    // })
});
router.afterEach(({to}) => {
})

export default router;
