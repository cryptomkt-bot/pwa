<template>
  <div id="app" class="is-unselectable">
    <Toast />
    <div id="wrapper">
      <!-- Login page -->
      <Login v-if="!isLogged" @loggedIn="isLogged = true"/>

      <!-- Main app -->
      <div v-else>
        <ConfirmationDialog />
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
        <div @click="isActiveOrdersVisible = !isActiveOrdersVisible"
             class="section-name has-text-centered">
          Órdenes abiertas
          <span class="icon is-size-7 is-pulled-right">
            <i v-if="isActiveOrdersVisible" class="fa fa-minus"></i>
            <i v-else class="fa fa-plus"></i>
          </span>
        </div>
        <ActiveOrders v-show="isActiveOrdersVisible" @ordersUpdated="updateActiveOrders"/>
        <!-- Executed orders -->
        <div @click="isExecutedOrdersVisible = !isExecutedOrdersVisible"
             class="section-name has-text-centered">
          Órdenes históricas
          <span class="icon is-size-7 is-pulled-right">
            <i v-if="isExecutedOrdersVisible" class="fa fa-minus"></i>
            <i v-else class="fa fa-plus"></i>
          </span>
        </div>
        <ExecutedOrders v-show="isExecutedOrdersVisible" :isVisible="isExecutedOrdersVisible"/>
        <div id="footer">
          <Balance @visibilityChanged="areTradersVisible = !$event"/>
          <Seller :isButtonVisible="areTradersVisible"/>
          <Buyer :isButtonVisible="areTradersVisible"/>
          <Footer :ask="ask" :bid="bid"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ActiveOrders from './components/ActiveOrders.vue';
import Balance from './components/Balance.vue';
import Buyer from './components/Buyer.vue';
import ConfirmationDialog from './components/ConfirmationDialog.vue';
import ExecutedOrders from './components/ExecutedOrders.vue';
import Footer from './components/Footer.vue';
import Login from './components/Login.vue';
import OpenOrder from './components/OpenOrder.vue';
import OrderBook from './components/OrderBook.vue';
import Seller from './components/Seller.vue';
import Toast from './components/Toast.vue';
import TopPanel from './components/TopPanel.vue';
import Trades from './components/Trades.vue';

export default {
  name: 'App',
  components: {
    ActiveOrders,
    ConfirmationDialog,
    Balance,
    Buyer,
    ExecutedOrders,
    Footer,
    Login,
    OpenOrder,
    OrderBook,
    Seller,
    Toast,
    TopPanel,
    Trades,
  },
  data() {
    return {
      isLogged: false,
      ask: 0,
      bid: 0,
      activeOrders: [],
      isTradesVisible: false,
      isActiveOrdersVisible: false,
      isExecutedOrdersVisible: false,
      isOpenOrderModalVisible: false,
      areTradersVisible: true,
    };
  },
  methods: {
    updateTicker(ask, bid) {
      this.ask = ask;
      this.bid = bid;
    },
    updateActiveOrders(orders) {
      this.activeOrders = orders;
    },
    logout() {
      this.isLogged = false;
      localStorage.removeItem('token');
      this.isTradesVisible = false;
      this.isActiveOrdersVisible = false;
      this.isExecutedOrdersVisible = false;
      this.isOpenOrderModalVisible = false;
      this.areTradersVisible = true;
    },
  },
};
</script>

<style lang="scss">
  #wrapper {
    margin-top: 60px;
    margin-bottom: 110px;
    -webkit-tap-highlight-color: transparent;
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
  .scale-enter-active, .scale-leave-active { transition: transform 200ms }
  .scale-enter, .scale-leave-to { transform: scale(0) }
</style>
