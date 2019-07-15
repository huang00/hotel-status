import VueRouter from 'vue-router'
import { setCookie } from 'common_libs/util';
import { testTokenEffectiveness } from 'url-config'

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
        path: '',
        name: 'HotelUser',
        component: () => import('../views/HotelUser.vue')
      }, {
        path: 'userList',
        name: 'userList',
        component: () => import('../../hotelUser/components/userList')
      }, {
        path: 'shortMessage',
        name: 'shortMessage',
        component: () => import('../../hotelUser/components/shortMessage')
      },
    ]
  }
];

// 创建 router 实例
const router = new VueRouter({
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { x: 0, y: 0 }
  },
})
router.beforeEach((to, from, next) => {
  if (window.location.hostname == '127.0.0.1' || window.location.hostname === 'localhost') {
    setCookie('userId', 548, 10) 
    setCookie('innId', 15670, 10)
    setCookie('token', '21f29e3da80444ca9f89db1823313c2c3b6f683bc3904d7f85295081f1a9652d', 10) // fbbb90f90bdc491ba8135087744e2ac799bc9cb68fb54baa82f56b8e122dfaa5 847a03d4a0f9423982dbcae6f1f8afbe03371fc7691441e284105257cbdcdd90
    // next()

  }

  testTokenEffectiveness().then(resolve => {
    if (resolve) {
      next()
    } else {
      window.location.href = `${window.gBaseURL}/index/index.html`
    }
  })
});

export default router;
