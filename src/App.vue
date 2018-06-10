<template>
  <div id="app">
    <OrderBook :activeOrders="activeOrders" @tickerUpdated="updateTicker(...$event)"/>
    <div class="section-name has-text-centered" @click="isTradesVisible = !isTradesVisible">
      Últimas transacciones
      <span class="icon is-pulled-right">
        <span v-if="isTradesVisible">-</span><span v-else>+</span>
      </span>
    </div>
    <Trades v-if="isTradesVisible"/>
    <div class="section-name has-text-centered" @click="isActiveOrdersVisible = !isActiveOrdersVisible">
      Órdenes abiertas
      <span class="icon is-pulled-right">
        <span v-if="isActiveOrdersVisible">-</span><span v-else>+</span>
      </span>
    </div>
    <ActiveOrders v-show="isActiveOrdersVisible" @ordersUpdated="updateActiveOrders"/>
    <div id="footer">
      <Balance/>
      <Footer :ask="ask" :bid="bid"/>
    </div>
  </div>
</template>

<script>
import 'bulma'
import ActiveOrders from './components/ActiveOrders'
import Balance from './components/Balance'
import OrderBook from './components/OrderBook'
import Footer from './components/Footer'
import Trades from './components/Trades'

export default {
  name: 'App',
  components: {
    ActiveOrders,
    Balance,
    Footer,
    OrderBook,
    Trades
  },
  data () {
    return {
      ask: 0,
      bid: 0,
      activeOrders: [],
      isTradesVisible: false,
      isActiveOrdersVisible: false
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

<style lang="scss">
  body { margin-bottom: 120px }
  .section-name {
    border-bottom: 1px solid #e0e0e0;
    background-color: #eee;
    padding: 8px;
    .icon {
      position: absolute;
      right: 16px;
    }
  }
  #footer {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
</style>
