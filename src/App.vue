<template>
  <div id="app" class="is-unselectable">
    <div id="wrapper">
      <!-- Login page -->
      <Login v-if="!isLogged" @loggedIn="isLogged = true"/>

      <!-- Main app -->
      <div v-else>
        <OpenOrder :isModalVisible="isOpenOrderModalVisible"
                   @close="isOpenOrderModalVisible = false"/>
        <TopPanel @loggedOut="logout" @openOrderModalOpened="isOpenOrderModalVisible = true"/>
        <!-- Order book -->
        <OrderBook/>
        <!-- Trades -->
        <Section :title="'Últimas transacciones'">
          <Trades/>
        </Section>
        <!-- Active orders -->
        <Section :title="'Órdenes abiertas'">
          <template slot="show">
            <ActiveOrders/>
          </template>
        </Section>
        <!-- Executed orders -->
        <Section :title="'Órdenes históricas'">
          <ExecutedOrders/>
        </Section>
        <!-- Footer -->
        <div id="footer">
          <Balance @visibilityChanged="areTradersVisible = !$event"/>
          <Seller :isButtonVisible="areTradersVisible"/>
          <Buyer :isButtonVisible="areTradersVisible"/>
          <Footer/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import ActiveOrders from './components/ActiveOrders.vue';
import Balance from './components/Balance.vue';
import Buyer from './components/Buyer.vue';
import ExecutedOrders from './components/ExecutedOrders.vue';
import Footer from './components/Footer.vue';
import Login from './components/Login.vue';
import OpenOrder from './components/OpenOrder.vue';
import OrderBook from './components/OrderBook.vue';
import Section from './components/Section.vue';
import Seller from './components/Seller.vue';
import TopPanel from './components/TopPanel.vue';
import Trades from './components/Trades.vue';

@Component({
  components: {
    ActiveOrders,
    Balance,
    Buyer,
    ExecutedOrders,
    Footer,
    Login,
    OpenOrder,
    OrderBook,
    Section,
    Seller,
    TopPanel,
    Trades,
  },
})
export default class App extends Vue {
  isLogged = false;
  ask = 0;
  bid = 0;
  activeOrders = [];
  isOpenOrderModalVisible = false;
  areTradersVisible = true;

  logout() {
    this.isLogged = false;
    localStorage.removeItem('token');
    this.isOpenOrderModalVisible = false;
    this.areTradersVisible = true;
  }
}
</script>

<style lang="scss">
  #wrapper {
    margin-top: 60px;
    margin-bottom: 110px;
    -webkit-tap-highlight-color: transparent;
  }
  #footer {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  .loading-wrapper {
    position: relative;
    .loading-overlay { z-index: 0 !important }
  }
  .scale-enter-active, .scale-leave-active { transition: transform 200ms }
  .scale-enter, .scale-leave-to { transform: scale(0) }

  @import "~bulma";
  @import "~buefy/src/scss/buefy";
</style>
