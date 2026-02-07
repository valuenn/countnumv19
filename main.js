import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import '.env.js'
import share from '@/utils/share.js'
Vue.mixin(share)
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif