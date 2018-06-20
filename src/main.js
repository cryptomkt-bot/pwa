import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

Vue.filter('toDecimals', (number, decimals) => {
  /** Filter to truncate a number to a given number of decimals **/
  number = number.toString() // It needs to be a string
  const decimalPointI = number.indexOf('.')
  if (decimalPointI === -1) { // The number has no decimal part
    return number
  }
  const i = decimalPointI + 1
  return number.slice(0, i) + number.substr(i, decimals)
})

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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
