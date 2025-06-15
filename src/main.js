/*
 * @Autor: lh
 * @Date: 2023-01-06 11:03:20
 * @LastEditors: lh
 * @LastEditTime: 2023-01-06 17:52:05
 * @Description: 
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import rem from "./static/js/rem"
import './static/js/vantUi.js'
import iconimgVue from './components/icon/iconimg.vue'
import headbox from './components/icon/headbox.vue'
import headtop from './components/head/top.vue'
import huli from './components/icon/huli.vue'
import i18n from './i18n' // ✅ 加上这一行
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import Toasted from 'vue-toasted'
Vue.config.productionTip = false
Vue.use(Toasted)


// rem()
Vue.component('iconimgVue',iconimgVue)
Vue.component('headbox',headbox)
Vue.component('headtop',headtop)
Vue.component('hulibox',huli)
Vue.component('Loading', Loading)

new Vue({
  i18n, // ✅ 注入
  router,
  store,
  render: h => h(App)
}).$mount('#app')

console.log('✅ Vue 实例已启动')
console.log('🌐 i18n 当前语言：', i18n.locale)