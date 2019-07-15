import VueRouter from 'vue-router'
import { setCookie } from 'common_libs/util';
import { testTokenEffectiveness } from 'url-config'

// 注释里的是分块js名，加user_center_前缀是为避免和某个入口或chunk同名，否则会无法运行
// 登陆路由 模块
// const index = r => import(/* webpackChunkName: "views/index" */'../components/views/index/index.vue').then(r);
const Main = r => import('common_components/Main/').then(r);
const hotelLinen = r => import(/* webpackChunkName: "views/login" */'../components/views/hotelLinen/hotelLinen').then(r);
const LinenContent = r =>
  import(/* webpackChunkName: "views/login" */ '../components/views/LinenContent/LinenContent').then(r);
const LinenCart = r =>
  import(/* webpackChunkName: "views/login" */ '../components/views/LinenContent/LinenCart').then(r);
const LinenSuccess = r =>
  import(/* webpackChunkName: "views/login" */ '../components/views/LinenContent/LinenSuccess').then(r);
const LinenOrderList = r =>
  import(/* webpackChunkName: "views/login" */ '../components/views/LinenContent/LinenOrderList').then(r);
const LinenDetail = r =>
  import(/* webpackChunkName: "views/login" */ '../components/views/LinenContent/LinenDetail').then(r);
const Agreement = r =>
  import(/* webpackChunkName: "views/login" */ '../components/views/LinenContent/agreement').then(r);
const routes = [
  {
    path: '/',
    name: 'main',
    component: Main,
    children: [{
      path: '',
      name: 'LinenContent',
      component: LinenContent,
    }, {
      path: '/linenCart',
      name: 'linenCart',
      component: LinenCart,
    }, {
      path: '/linenOrderList',
      name: 'linenOrderList',
      component: LinenOrderList,
    }, {
      path: '/linenSubmitSuccess/:orderId',
      name: 'linenSubmitSuccess',
      component: LinenSuccess,
    }, {
      path: '/linenDetail/:orderId',
      name: 'linenDetail',
      component: LinenDetail,
    }, {
      path: '/agreement',
      name: 'agreement',
      component: Agreement,
    },]
  },
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
