import VueRouter from 'vue-router'
import { setCookie } from 'common_libs/util';
// import { testTokenEffectiveness } from 'url-config'

// 注释里的是分块js名，加user_center_前缀是为避免和某个入口或chunk同名，否则会无法运行
// 登陆路由 模块
// const index = r => import(/* webpackChunkName: "views/index" */'../components/views/index/index.vue').then(r);
const Main = r => import('common_components/Main/').then(r);

const routes = [
    {
        path: '/',
        component: Main,
        children: [
            {
                path: '/',
                name: 'hotelStatus',
                component: () => import('../views/HotelStatus.vue')
            }
        ]
    }
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
    if (window.location.hostname === 'localhost') {
        setCookie('userId', 40, 10)
        setCookie('innId', 130, 10)
        setCookie('token', '5bc7b3e9cadd4fca9344d41033e2ed99cb013d7da3ce407b983efa2b211116ca', 10)
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

export default router;
