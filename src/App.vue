<template>
  <div id="app" class="is-unselectable">
    <div id="wrapper">
      <!-- Login page -->
      <Login v-if="!isLogged" />

      <!-- Main app -->
      <div v-else>
        <OpenOrder
          :isModalVisible="isOpenOrderModalVisible"
          @close="isOpenOrderModalVisible = false"
        />
        <TopPanel @openOrderModalOpened="isOpenOrderModalVisible = true" />
        <!-- Order book -->
        <OrderBook />
        <!-- Trades -->
        <Section :title="$t('latestTransactions')">
          <b-tabs expanded position="is-centered" class="is-marginless">
            <b-tab-item :label="$t('allOrders')"><Trades /></b-tab-item>
            <b-tab-item :label="$t('myOrders')"><ExecutedOrders /></b-tab-item>
          </b-tabs>
        </Section>
        <!-- Active orders -->
        <Section :title="$t('activeOrders')">
          <template slot="show">
            <ActiveOrders />
          </template>
        </Section>
        <!-- Footer -->
        <div id="footer">
          <Balance @visibilityChanged="areTradersVisible = !$event" />
          <Seller :isButtonVisible="areTradersVisible" />
          <Buyer :isButtonVisible="areTradersVisible" />
          <Footer />
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
  isOpenOrderModalVisible = false;
  areTradersVisible = true;

  created() {
    if (this.isLogged) {
      this.apiService.startBookFetch();
    }
  }

  get isLogged() {
    return this.$store.getters.isLogged;
  }
}
</script>

<style lang="scss">
#wrapper {
  margin-top: 60px;
  margin-bottom: 110px;
  -webkit-tap-highlight-color: transparent;
  .tab-content {
    padding: 0 !important;
  }
  // Remove dotted outline in Firefox
  button::-moz-focus-inner {
    border: 0;
  }
  select:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 #000;
  }
}
#footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}
.position-relative {
  position: relative;
}
.loading-overlay {
  z-index: 30 !important;
}
.scale-enter-active,
.scale-leave-active {
  transition: transform 200ms;
}
.scale-enter,
.scale-leave-to {
  transform: scale(0);
}

@import '~bulma';
@import '~buefy/src/scss/buefy';
</style>
