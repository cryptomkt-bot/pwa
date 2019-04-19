<template>
  <div id="app" class="is-unselectable">
    <div id="wrapper">
      <!-- Login page -->
      <Login v-if="!isLogged" />

      <!-- Main app -->
      <div v-else>
        <BalanceModal />
        <LanguageSelectorModal />
        <OpenOrderModal />
        <TopPanel />
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
        <Seller :isButtonVisible="areTradersVisible" />
        <Buyer :isButtonVisible="areTradersVisible" />
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

import ActiveOrders from './components/ActiveOrders';
import BalanceModal from './components/BalanceModal';
import Buyer from './components/Buyer';
import ExecutedOrders from './components/ExecutedOrders';
import Footer from './components/Footer';
import LanguageSelectorModal from './components/LanguageSelectorModal';
import Login from './components/Login';
import OpenOrderModal from './components/OpenOrderModal';
import OrderBook from './components/OrderBook';
import Section from './components/Section';
import Seller from './components/Seller';
import TopPanel from './components/TopPanel';
import Trades from './components/Trades';

@Component({
  components: {
    ActiveOrders,
    BalanceModal,
    Buyer,
    ExecutedOrders,
    Footer,
    LanguageSelectorModal,
    Login,
    OpenOrderModal,
    OrderBook,
    Section,
    Seller,
    TopPanel,
    Trades,
  },
})
class App extends Vue {
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

export default App;
</script>

<style lang="scss">
@import '~bulma';
@import '~buefy/src/scss/buefy';
@import '~@mdi/font/css/materialdesignicons.css';

#wrapper {
  margin-top: 75px;
  margin-bottom: 75px;
  -webkit-tap-highlight-color: transparent;
  .tab-content {
    padding: 0 !important;
  }
}
.position-relative {
  position: relative;
}
.loading-overlay {
  z-index: 20;
}
.scale-enter-active,
.scale-leave-active {
  transition: transform 200ms;
}
.scale-enter,
.scale-leave-to {
  transform: scale(0);
}

.select::after {
  border-color: rgba(255, 255, 255, 0.8) !important;
}
// Remove dotted outline in Firefox
button::-moz-focus-inner {
  border: 0;
}
select:-moz-focusring {
  color: transparent;
  text-shadow: 0 0 0 #000;
}

/* Shadows */
.z-depth-1 {
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
}
.z-depth-2 {
  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12),
    0 2px 4px -1px rgba(0, 0, 0, 0.3);
}
.z-depth-3 {
  box-shadow: 0 8px 17px 2px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);
}
.z-depth-4 {
  box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14),
    0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -7px rgba(0, 0, 0, 0.2);
}
.z-depth-5 {
  box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14),
    0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 11px 15px -7px rgba(0, 0, 0, 0.2);
}
</style>
