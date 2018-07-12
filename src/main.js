import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import injector from 'vue-inject'

import './services/StorageService'
import { toDecimals } from './utils'
import { markets } from './constants'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(injector)

Vue.filter('toDecimals', toDecimals)

Vue.filter('date', timestamp => {
  const date = new Date(timestamp)
  return date.toLocaleString('es-AR', {
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: 'numeric'
  })
})

Vue.filter('localetime', date => {
  return date.toLocaleTimeString()
})

const storageService = injector.get('storageService')

const store = new Vuex.Store({
  state: {
    currentMarket: storageService.get('currentMarket') || markets['ARS'][1],
    isDialogVisible: false,
    dialogText: '',
    dialogCallback: null
  },
  mutations: {
    changeMarket (state, market) {
      state.currentMarket = market
      storageService.set('currentMarket', market)
    },
    showDialog (state, payload) {
      state.dialogText = payload.text
      state.dialogCallback = payload.callback
      state.isDialogVisible = true
    },
    hideDialog (state) {
      state.isDialogVisible = false
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
