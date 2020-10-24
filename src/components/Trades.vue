<template>
  <div class="position-relative">
    <b-loading :active="isLoading" :is-full-page="false"></b-loading>
    <table class="table is-fullwidth is-marginless is-size-7">
      <thead>
        <tr>
          <th>{{ $t('date') }}</th>
          <th>{{ $t('price') }}</th>
          <th>{{ $t('amount') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.timestamp">
          <td>{{ (order.timestamp + '-00:00') | date }}</td>
          <td :class="orderColor(order)">
            {{
              formatAmount(
                order.price,
                currentMarket.quoteCurrency,
                currentMarket.decimals
              )
            }}
          </td>
          <td>
            {{
              formatAmount(
                order.amount,
                currentMarket.baseCurrency,
                currentMarket.baseCurrency.decimals
              )
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
class Trades extends Vue {
  isLoading = true;
  orders = [];
  intervalId = null;

  created() {
    this.init();
  }

  destroyed() {
    clearInterval(this.intervalId);
  }

  @Watch('currentMarket')
  onCurrentMarketChanged() {
    this.init();
  }

  init() {
    this.isLoading = true;
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
    return this.apiService.getTrades(this.currentMarket.code).then((orders) => {
      this.orders = orders;
    });
  }

  orderColor(order) {
    const type = order.market_taker === 'sell' ? 'danger' : 'success';
    return `has-text-${type}`;
  }
}

export default Trades;
</script>

<style scoped lang="scss">
$bodyHeight: 100px;
tbody {
  display: block;
  height: $bodyHeight;
  overflow: auto;
}
thead,
tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}
</style>
