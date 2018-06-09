<template>
  <div id="app">
    <div class="container">
      <OrderBook @tickerUpdated="updateTicker(...$event)"/>
      <Footer :ask="ask" :bid="bid"/>
    </div>
  </div>
</template>

<script>
import 'bulma'
import OrderBook from './components/OrderBook'
import Footer from './components/Footer'

export default {
  name: 'App',
  components: {
    Footer,
    OrderBook
  },
  data () {
    return {
      ask: 0,
      bid: 0
    }
  },
  methods: {
    updateTicker (ask, bid) {
      this.ask = ask
      this.bid = bid
    }
  }
}
</script>

<style>
</style>
