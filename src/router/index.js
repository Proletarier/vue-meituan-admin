import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

// 所有权限通用路由表
// 如首页和登录页和一些不用权限的公用页面
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', icon: 'home', affix: true }
      }
    ]
  }
]

// 异步挂载的路由
// 动态需要根据权限加载的路由表
export const asyncRouterMap = [
  {
    path: '/sms',
    component: Layout,
    redirect: '/sms/shop',
    name: 'sms',
    meta: { title: '商家', icon: 'shop' },
    children: [
      {
        path: 'shop',
        name: 'shop',
        component: () => import('@/views/page/sms/shop/index'),
        meta: { title: '商家列表', icon: 'shop-list' }
      },
      {
        path: 'updateShop',
        name: 'UpdateShop',
        component: () => import('@/views/page/sms/shop/update'),
        meta: { title: '商家编辑' },
        hidden: true
      },
      {
        path: 'createShop',
        name: 'createShop',
        component: () => import('@/views/page/sms/shop/add'),
        meta: { title: '创建商家' },
        hidden: true
      },
      {
        path: 'shopCate',
        name: 'shopCate',
        component: () => import('@/views/page/sms/shopCate/index'),
        meta: { title: '商家分类', icon: 'shop-cate' }
      },
      {
        path: 'updateShopCate',
        name: 'updateShopCate',
        component: () => import('@/views/page/sms/shopCate/update'),
        meta: { title: '修改分类' },
        hidden: true
      },
      {
        path: 'createShopCate',
        name: 'createShopCate',
        component: () => import('@/views/page/sms/shopCate/add'),
        meta: { title: '新增分类' },
        hidden: true
      }
    ]
  },

  {
    path: '/pms',
    component: Layout,
    name: 'pms',
    meta: { title: '商品属性' },
    hidden: true,
    children: [
      {
        path: 'product',
        name: 'product',
        component: () => import('@/views/page/pms/product/index'),
        hidden: true,
        meta: { title: '商品列表' }
      },
      {
        path: 'productAdd',
        name: 'productAdd',
        component: () => import('@/views/page/pms/product/add'),
        hidden: true,
        meta: { title: '添加商品' }
      },
      {
        path: 'productUpdate',
        name: 'productUpdate',
        component: () => import('@/views/page/pms/product/update'),
        hidden: true,
        meta: { title: '修改商品' }
      },
      {
        path: 'productCate',
        name: 'productCate',
        component: () => import('@/views/page/pms/productCate/index'),
        meta: { title: '商品分类' },
        hidden: true
      },
      {
        path: 'ucpateProductCate',
        name: 'ucpateProductCate',
        component: () => import('@/views/page/pms/productCate/update'),
        meta: { title: '修改商品分类' },
        hidden: true
      },
      {
        path: 'createProductCate',
        name: 'createProductCate',
        component: () => import('@/views/page/pms/productCate/add'),
        meta: { title: '添加商品分类' },
        hidden: true
      },
      {
        path: 'productAttrCate',
        name: 'productAttrCate',
        component: () => import('@/views/page/pms/productAttr/index'),
        hidden: true,
        meta: { title: '商品属性分类' }
      },
      {
        path: 'productAttr',
        name: 'productAttr',
        component: () => import('@/views/page/pms/productAttr/productAttrList'),
        hidden: true,
        meta: { title: '商品属性' }

      }
    ]
  },

  // {
  //   path: '/customer',
  //   component: Layout,
  //   redirect: '/customer/list',
  //   name: 'Customer',
  //   meta: { title: '客户', icon: 'user' },
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'List',
  //       component: () => import('@/views/customer/index'),
  //       meta: { title: '客户列表', icon: 'shop-list' }
  //     },
  //     {
  //       path: 'list',
  //       name: 'List',
  //       component: () => import('@/views/customer/index'),
  //       meta: { title: '客户地址', icon: 'address' }
  //     }
  //   ]
  // },

  // {
  //   path: '/user',
  //   component: Layout,
  //   redirect: '/user/list',
  //   name: 'productAttr',
  //   meta: { title: '骑手', icon: 'qishou' },
  //   hidden: true,
  //   children: [
  //   ]
  // },

  {
    path: '/ams',
    component: Layout,
    redirect: '/ams/admin',
    name: 'ams',
    meta: { title: '权限', icon: 'permission' },
    children: [
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/page/ams/admin/index'),
        meta: { title: '用户', icon: 'admin' }
      },
      {
        path: 'addAdmin',
        name: 'addAdmin',
        component: () => import('@/views/page/ams/admin/add'),
        hidden: true,
        meta: { title: '添加用户' }
      },
      {
        path: 'updateAdmin',
        name: 'updateAdmin',
        component: () => import('@/views/page/ams/admin/update'),
        hidden: true,
        meta: { title: '编辑用户' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/page/ams/role/index'),
        meta: { title: '角色', icon: 'role' }
      },
      {
        path: 'allocMenu',
        name: 'allocMenu',
        component: () => import('@/views/page/ams/role/allocMenu'),
        hidden: true,
        meta: { title: '分配菜单' }
      },
      {
        path: 'allocResource',
        name: 'allocResource',
        component: () => import('@/views/page/ams/role/allocResource'),
        hidden: true,
        meta: { title: '分配资源' }
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/page/ams/menu/index'),
        meta: { title: '菜单', icon: 'menu' }
      },
      {
        path: 'menuUpdate',
        name: 'menuUpdate',
        component: () => import('@/views/page/ams/menu/update'),
        hidden: true,
        meta: { title: '编辑菜单' }
      },
      {
        path: 'menuAdd',
        name: 'menuAdd',
        component: () => import('@/views/page/ams/menu/add'),
        hidden: true,
        meta: { title: '新增菜单' }
      },
      {
        path: 'resource',
        name: 'resource',
        component: () => import('@/views/page/ams/resource/index'),
        meta: { title: '资源', icon: 'resource' }
      },
      {
        path: 'resourceCate',
        name: 'resourceCate',
        component: () => import('@/views/page/ams/resource/resourceCate'),
        hidden: true,
        meta: { title: '资源分类' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

