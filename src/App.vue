<template>
  <div id="app">
    <div class="container">
      <OrderBook :activeOrders="activeOrders" @tickerUpdated="updateTicker(...$event)"/>
      <Trades/>
      <ActiveOrders @ordersUpdated="updateActiveOrders"/>
      <Footer :ask="ask" :bid="bid"/>
    </div>
  </div>
</template>

<script>
import 'bulma'
import ActiveOrders from './components/ActiveOrders'
import OrderBook from './components/OrderBook'
import Footer from './components/Footer'
import Trades from './components/Trades'

export default {
  name: 'App',
  components: {
    ActiveOrders,
    Footer,
    OrderBook,
    Trades
  },
  data () {
    return {
      ask: 0,
      bid: 0,
      activeOrders: []
    }
  },
  methods: {
    updateTicker (ask, bid) {
      this.ask = ask
      this.bid = bid
    },
    updateActiveOrders (orders) {
      this.activeOrders = orders
    }
  }
}
</script>

<style>
</style>
