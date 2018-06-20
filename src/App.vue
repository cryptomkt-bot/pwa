<template>
  <div id="app">
    <!-- Login page -->
    <Login v-if="!token" @tokenObtained="saveToken"/>

    <!-- Main app -->
    <div v-else>
      <TopPanel @loggedOut="removeToken"/>
      <OrderBook :activeOrders="activeOrders" @tickerUpdated="updateTicker(...$event)"/>
      <div class="section-name has-text-centered" @click="isTradesVisible = !isTradesVisible">
        Últimas transacciones
        <span class="icon is-pulled-right">
          <span v-if="isTradesVisible">-</span><span v-else>+</span>
        </span>
      </div>
      <Trades v-show="isTradesVisible" :isVisible="isTradesVisible"/>
      <div class="section-name has-text-centered" @click="isActiveOrdersVisible = !isActiveOrdersVisible">
        Órdenes abiertas
        <span class="icon is-pulled-right">
          <span v-if="isActiveOrdersVisible">-</span><span v-else>+</span>
        </span>
      </div>
      <ActiveOrders v-show="isActiveOrdersVisible" @ordersUpdated="updateActiveOrders"/>
      <div id="footer">
        <Balance @visibilityChanged="areTradersVisible = !$event"/>
        <Seller v-show="areTradersVisible"/>
        <Buyer v-show="areTradersVisible"/>
        <Footer :ask="ask" :bid="bid"/>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import 'bulma'
import ActiveOrders from './components/ActiveOrders'
import Balance from './components/Balance'
import Buyer from './components/Buyer'
import OrderBook from './components/OrderBook'
import Footer from './components/Footer'
import TopPanel from './components/TopPanel'
import Trades from './components/Trades'
import Seller from './components/Seller'
import Login from './components/Login'

export default {
  name: 'App',
  components: {
    ActiveOrders,
    Balance,
    Buyer,
    Footer,
    Login,
    OrderBook,
    Seller,
    Trades,
    TopPanel
  },
  data () {
    return {
      ask: 0,
      bid: 0,
      activeOrders: [],
      isTradesVisible: false,
      isActiveOrdersVisible: false,
      areTradersVisible: true,
      token: null
    }
  },
  methods: {
    updateTicker (ask, bid) {
      this.ask = ask
      this.bid = bid
    },
    updateActiveOrders (orders) {
      this.activeOrders = orders
    },
    saveToken (token, callback) {
      axios.defaults.headers.common['Authorization'] = 'JWT ' + token
      callback()
      this.token = token
    },
    removeToken () {
      this.token = null
    }
  }
}
</script>

<style lang="scss">
  body {
    margin-top: 60px;
    margin-bottom: 120px;
  }
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
