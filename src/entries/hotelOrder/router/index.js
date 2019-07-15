import VueRouter from 'vue-router'
import {testTokenEffectiveness} from 'url-config'

// 注释里的是分块js名，加user_center_前缀是为避免和某个入口或chunk同名，否则会无法运行
// 登陆路由 模块
const Main = r => import('common_components/Main/').then(r);
const hotelOrder = r => import(/* webpackChunkName: "views/login" */'../components/views/hotelOrder/hotelOrder').then(r);

const routes = [
    {
        path: '/',
        name: 'main',
        component: Main,
        children: [
            {
                path: '',
                name: 'hotelOrder',
                component: hotelOrder,
            }
        ]
    },
];

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
    if (to.path === '/') {
        testTokenEffectiveness().then(resolve => {
            if (resolve) {
                next()
            } else {
                window.location.href = `/index/index.html`
            }
        })
    }
});
router.afterEach(({to}) => {
})

export default router;
