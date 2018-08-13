<template>
  <div class="loading-wrapper">
    <b-loading :active="isLoading" :is-full-page="false"></b-loading>
    <span v-if="!isLoading && !orders.length" class="is-size-7">Ninguna órden.</span>
    <table v-if="!isLoading && orders.length" class="table is-fullwidth is-marginless is-size-7">
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
            {{ formatAmount(order.execution_price, currentMarket.quoteCurrency, currentMarket.decimals) }}
          </td>
          <td>
            {{ formatAmount(order.amount.executed, currentMarket.baseCurrency, currentMarket.baseCurrency.decimals) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  dependencies: ['apiService'],
})
export default class ExecutedOrders extends Vue {
  isLoading = true;
  orders = [];
  intervalId = null;

  created() {
    this.init();
  }

  destroyed() {
    clearInterval(this.intervalId);
  }

  get currentMarket() {
    return this.$store.state.currentMarket;
  }

  @Watch('currentMarket')
  onCurrentMarketChanged() {
    this.init();
  }

  init() {
    clearInterval(this.intervalId);
    this.updateOrders().then(() => {
      this.isLoading = false;
    });
    // Update orders every 10 seconds
    this.intervalId = setInterval(() => {
      this.updateOrders();
    }, 10000);
  }

  updateOrders() {
    const url = `/orders/executed/${this.currentMarket.code}`;
    return this.apiService.get(url, { limit: 100 }).then((response) => {
      this.orders = response.data;
    });
  }

  orderColor(order) {
    const type = order.type === 'sell' ? 'danger' : 'success';
    return `has-text-${type}`;
  }
}
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
