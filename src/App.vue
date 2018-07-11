<template>
  <div id="app" class="is-unselectable">
    <!-- Login page -->
    <Login v-if="!isLogged" @loggedIn="isLogged = true"/>

    <!-- Main app -->
    <div v-else>
      <transition name="fade">
        <OpenOrder v-show="isOpenOrderModalVisible" @close="isOpenOrderModalVisible = false" />
      </transition>
      <TopPanel @loggedOut="logout" @openOrderModalOpened="isOpenOrderModalVisible = true"/>
      <OrderBook :activeOrders="activeOrders" @tickerUpdated="updateTicker(...$event)"/>
      <div class="section-name has-text-centered" @click="isTradesVisible = !isTradesVisible">
        Últimas transacciones
        <span class="icon is-size-7 is-pulled-right">
          <i v-if="isTradesVisible" class="fa fa-minus"></i>
          <i v-else class="fa fa-plus"></i>
        </span>
      </div>
      <Trades v-show="isTradesVisible" :isVisible="isTradesVisible"/>
      <!-- Active orders -->
      <div class="section-name has-text-centered" @click="isActiveOrdersVisible = !isActiveOrdersVisible">
        Órdenes abiertas
        <span class="icon is-size-7 is-pulled-right">
          <i v-if="isActiveOrdersVisible" class="fa fa-minus"></i>
          <i v-else class="fa fa-plus"></i>
        </span>
      </div>
      <ActiveOrders v-show="isActiveOrdersVisible" @ordersUpdated="updateActiveOrders"/>
      <!-- Executed orders -->
      <div class="section-name has-text-centered" @click="isExecutedOrdersVisible = !isExecutedOrdersVisible">
        Órdenes históricas
        <span class="icon is-size-7 is-pulled-right">
          <i v-if="isExecutedOrdersVisible" class="fa fa-minus"></i>
          <i v-else class="fa fa-plus"></i>
        </span>
      </div>
      <ExecutedOrders v-show="isExecutedOrdersVisible" :isVisible="isExecutedOrdersVisible"/>
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
import ActiveOrders from './components/ActiveOrders'
import Balance from './components/Balance'
import Buyer from './components/Buyer'
import OpenOrder from './components/OpenOrder'
import OrderBook from './components/OrderBook'
import Footer from './components/Footer'
import TopPanel from './components/TopPanel'
import Trades from './components/Trades'
import Seller from './components/Seller'
import Login from './components/Login'
import ExecutedOrders from './components/ExecutedOrders'

export default {
  name: 'App',
  components: {
    ActiveOrders,
    ExecutedOrders,
    Balance,
    Buyer,
    Footer,
    Login,
    OpenOrder,
    OrderBook,
    Seller,
    Trades,
    TopPanel
  },
  data () {
    return {
      isLogged: false,
      ask: 0,
      bid: 0,
      activeOrders: [],
      isTradesVisible: false,
      isActiveOrdersVisible: false,
      isExecutedOrdersVisible: false,
      isOpenOrderModalVisible: false,
      areTradersVisible: true
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
    logout () {
      this.isLogged = false
      this.isTradesVisible = false
      this.isActiveOrdersVisible = false
      this.isExecutedOrdersVisible = false
      this.isOpenOrderModalVisible = false
      this.areTradersVisible = true
    }
  }
}
</script>

<style lang="scss">
  #app {
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
  .fade-enter-active, .fade-leave-active { transition: opacity 500ms }
  .fade-enter, .fade-leave-to { opacity: 0 }
</style>
