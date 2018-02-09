import Vue             from 'vue'

import App             from './App'
import store           from './store'
import { getPlatform } from '../lib/platform'

function init() {
  Vue.config.productionTip = false

  /* eslint-disable no-new */
  window.app = new Vue({
    store,
    el: '#app',
    template: '<App/>',
    components: { App }
  })
}

if (process.env.TARGET === 'cordova') {
  document.addEventListener("deviceready", init, false)
} else {
  init()
}

