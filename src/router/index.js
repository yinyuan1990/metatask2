/*
 * @Autor: lh
 * @Date: 2023-01-06 11:03:20
 * @LastEditors: lh
 * @LastEditTime: 2023-01-07 16:05:10
 * @Description: 
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [

  {
    path: '/buy',
    name: 'buy',
    component: () => import('@/views/buy/index.vue')
  },
  {
    path: '/sell',
    name: 'sell',
    component: () => import('@/views/sell/index.vue')
  },
  {
    path: '/evmaddcoin',
    name: 'evmaddcoin',
    component: ()=> import('@/views/sendbalance/evmaddcoin.vue')
  },
  {
    path: '/send1',
    name: 'send1',
    component: ()=> import('@/views/sendbalance/send1.vue')
  },
  {
    path: '/send3',
    name: 'send3',
    component: ()=> import('@/views/sendbalance/send3.vue')
  },
  {
    path: '/send2',
    name: 'send2',
    component: ()=> import('@/views/sendbalance/send2.vue')
  },
  {
    path: '/send',
    name: 'send',
    component: ()=> import('@/views/send/index.vue')
  },
  {
    path: '/rhome',
    name: 'rhome',
    component: ()=> import('@/views/rhome/rhome.vue')
  },
  {
    path: '/',
    name: 'rhome',
    component: ()=> import('@/views/rhome/rhome.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: ()=> import('@/views/login/index.vue')
  },
  {
    path: '/install',
    name: 'install',
    component: ()=> import('@/views/install/index.vue')
  },
  {
    path: '/index',
    name: 'index',
    component: ()=> import('@/views/index/index.vue')
  },
  {
    path: '/permission',
    name: 'permission',
    component: ()=> import('@/views/permission/permission.vue')
  },
  {
    path: '/newlogin',
    name: 'newlogin',
    component: ()=> import('@/views/newlogin/index.vue')
  },
  {
    path: '/setting',
    name: 'setting',
    component: ()=> import('@/views/setting/index.vue')
  },
  {
    path: '/exchange',
    name: 'exchange',
    component: ()=> import('@/views/exchange/index.vue')
  },
  {
    path: '/dbdetails',
    name: 'dbdetails',
    component: ()=> import('@/views/dbdetails/index.vue')
  },
  {
    path: '/openb',
    name: 'openb',
    component: ()=> import('@/views/openB/index.vue')
  },
  {
    path: '/klqbox',
    name: 'klqbox',
    component: ()=> import('@/views/klqbox/index.vue')
  },
  {
    path: '/guide',
    name: 'guide',
    component: ()=> import('@/views/guide/index.vue')
  },
  {
    path: '/transaction',
    name: 'transaction',
    component: ()=> import('@/views/transaction/index.vue')
  },
  {
    path: '/change',
    name: 'change',
    component: ()=> import('@/views/change/index.vue')
  },
  {
    path: '/set1',
    name: 'set1',
    component: ()=> import('@/views/set1/index.vue')
  },
  {
    path: '/set2',
    name: 'set2',
    component: ()=> import('@/views/set2/index.vue')
  },
  {
    path: '/set3',
    name: 'set3',
    component: ()=> import('@/views/set3/index.vue')
  },
  {
    path: '/set4/addContactInfo',
    name: 'AddContactInfo',
    component: ()=> import('@/views/set4/addContactInfo.vue')
  },
  {
    path: '/set4',
    name: 'set4',
    component: ()=> import('@/views/set4/index.vue')
  },
  {
    path: '/set5',
    name: 'set5',
    component: ()=> import('@/views/set5/index.vue')
  },
  {
    path: '/set6',
    name: 'set6',
    component: ()=> import('@/views/set6/index.vue')
  },
  {
    path: '/set7/look',
    name: 'look',
    component: ()=> import('@/views/set7/look.vue')
  },
  {
    path: '/set7',
    name: 'set7',
    component: ()=> import('@/views/set7/index.vue')
  },
  {
    path: '/set8',
    name: 'set8',
    component: ()=> import('@/views/set8/index.vue')
  },
  {
    path: '/wwwcom',
    name: 'wwwcom',
    component: ()=> import('@/views/wwwcom/PublicWebPage.vue'),
    props: route => ({ title: route.query.title, url: route.query.url })
  },
  {
    path: '/notice',
    name: 'notice',
    component: () => import('@/views/notice/index.vue')
  },
  {
    path: '/swap',
    name: 'swap',
    component: () => import('@/views/swap/index.vue')
  },
  {
    path: '/receive',
    name: 'receive',
    component: () => import('@/views/receive/index.vue')
  },
  {
    path: '/leadingin',
    name: 'leadingin',
    component: () => import('@/views/leadingin/index.vue')
  },
  {
    path: '/pledge',
    name: 'pledge',
    component: () => import('@/views/pledge/index.vue')
  },
  {
    path: '/privateKey',
    name: 'privateKey',
    component: () => import('@/views/privateKey/index.vue')
  },
  {
    path: '/leadingInA',
    name: 'leadingInA',
    component: () => import('@/views/leadingInA/index.vue')
  },
  {
    path: "/update-password",
    name: "UpdatePassword",
    component: () => import("@/views/update-password/index.vue"),
  },
  {
    path: "/display-private-key-mnemonics",
    name: "DisplayPrivateKeyMnemonics",
    component: () => import("@/views/display-private-key-mnemonics/index.vue"),
  },
  {
    path: "/display-private-key",
    name: "DisplayPrivateKey",
    component: () => import("@/views/display-private-key/index.vue"),
  },
  {
    path: "/manage-link",
    name: "ManageLink",
    component: () => import("@/views/manage-link/index.vue"),
  }
]

const router = new VueRouter({
  // mode: 'history',
  mode: 'hash',
  // base: process.env.BASE_URL,
  base: './',
  routes
})

router.beforeEach((to, from, next) => {
  const acc = window.accountManager?.getCurrentAddress?.()
  const hasWallet = !!acc?.address

  if (to.path === '/') {
    if (hasWallet) {
      next('/rhome')   // 已有钱包 => 首页
    } else {
      next('/guide')   // 没有钱包 => 引导页
    }
  } else {
    next()
  }
})



export default router
