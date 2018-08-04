<template>
  <div>
    <div v-if="!market" class="has-text-centered">
      <span class="icon">
        <i class="fa fa-spinner fa-pulse"></i>
      </span>
    </div>
    <span v-else-if="!orders.length" class="is-size-7">Ninguna órden.</span>
    <table v-else class="table is-fullwidth is-marginless is-size-7">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Precio</th>
          <th>Cantidad</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.executed_at">
          <td>{{ order.executed_at + '-00:00' | date }}</td>
          <td :class="orderColor(order)">
            {{ formatAmount(order.execution_price, market.quoteCurrency, market.decimals) }}
          </td>
          <td>
            {{ formatAmount(order.amount.executed, market.baseCurrency, market.baseCurrency.decimals) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { formatAmount } from '../utils';

export default {
  name: 'ExecutedOrders',
  dependencies: ['apiService'],
  props: ['isVisible'],
  data() {
    return {
      market: null,
      orders: [],
      intervalId: null,
    };
  },
  destroyed() {
    clearInterval(this.intervalId);
  },
  computed: {
    currentMarket() {
      return this.$store.state.currentMarket;
    },
  },
  watch: {
    isVisible(newValue) {
      if (newValue === true) { // The component is visible
        this.init();
      } else { // The component is hidden
        this.orders = [];
        clearInterval(this.intervalId); // Stop updating the orders
      }
    },
    currentMarket() {
      if (!this.isVisible) {
        return;
      }
      this.init();
    },
  },
  methods: {
    formatAmount,
    init() {
      clearInterval(this.intervalId);
      this.market = null;
      this.updateOrders().then(() => {
        this.market = this.currentMarket;
      });
      // Update orders every 10 seconds
      this.intervalId = setInterval(() => {
        this.updateOrders();
      }, 10000);
    },
    updateOrders() {
      const url = `/orders/executed/${this.currentMarket.code}`;
      return this.apiService.get(url, { limit: 100 }).then((response) => {
        this.orders = response.data;
      });
    },
    orderColor(order) {
      const type = order.type === 'sell' ? 'danger' : 'success';
      return `has-text-${type}`;
    },
  },
};
</script>

<style scoped lang="scss">
  $bodyHeight: 100px;
  tbody {
    display: block;
    height: $bodyHeight;
    overflow: auto;
  }
  thead, tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
  #loading-message {
    line-height: $bodyHeight + 30px;
  }
</style>
