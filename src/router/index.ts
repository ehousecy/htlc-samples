import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "Eth" */ '../views/eth/createHTLC.vue')
      },
      {
        path: 'eth/withdraw',
        component: () => import(/* webpackChunkName: "Eth" */ '../views/eth/withdraw.vue')
      },
      {
        path: 'eth/refund',
        component: () => import(/* webpackChunkName: "Eth" */ '../views/eth/refund.vue')
      },
      {
        path: 'fabric',
        component: () => import(/* webpackChunkName: "Fabric" */ '../views/Fabric.vue')
      },
      {
        path: 'profile',
        component: () => import(/* webpackChunkName: "Generatehash" */ '../views/Generatehash.vue')
      },
      {
        path: 'apply',
        component: () => import(/* webpackChunkName: "Applyaccount" */ '../views/Applyaccount.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
