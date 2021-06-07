import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // progress 进度条样式
import { getToken } from '@/utils/auth' //  验权

const whiteList = ['/login'] // 不重定向白名单

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // determine whether the user has logged in

  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (!hasGetUserInfo) {
        store.dispatch('user/getInfo').then(res => { // 拉取用户信息
          const menus = res.data.menus
          const username = res.data.username
          store.dispatch('GenerateRoutes', { menus, username }).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true })
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        next() // 当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) //  重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 结束Progress
  NProgress.done()
})
