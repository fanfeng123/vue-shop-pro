import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Welcome from '@/components/Welcome'
import User from '@/components/User'

Vue.use(Router)

var router = new Router({
  routes: [{
      path: '/Login',
      component: Login
    },
    {
      path: '/Home',
      component: Home,
      redirect: '/welcome',
      children: [{
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: User
        }
      ]
    }
  ]
})
//  给路由设置导航守卫  有token 可以执行后边，没有跳转到/login
router.beforeEach((to, from, next) => {
  // 请求login就直接通过
  if (to.path === '/login') {
    return next()
  }
  // 请求非login， 判断token
  var token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }

  next() //请继续你的旅行
})

export default router
