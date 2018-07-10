import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'

import { toDecimals } from './utils'
import { markets } from './constants'

Vue.config.productionTip = false

Vue.use(Vuex)

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

const store = new Vuex.Store({
  state: {
    currentMarket: JSON.parse(localStorage.getItem('currentMarket')) || markets['ARS'][1]
  },
  mutations: {
    changeMarket (state, market) {
      state.currentMarket = market
      localStorage.setItem('currentMarket', JSON.stringify(market))
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
