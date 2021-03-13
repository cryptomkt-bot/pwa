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
        <tr
          v-for="order in orders"
          :key="order.timestamp + order.price + order.amount"
        >
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
        <tr
          is="InfiniteLoader"
          v-if="!isLoading"
          :isLoading="isFetching"
          :threshold="0"
          @intersect="loadMore"
          style="height: 50px"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import { Component, Watch, Vue } from 'vue-property-decorator';

import InfiniteLoader from './InfiniteLoader.vue';

@Component({
  components: { InfiniteLoader },
})
class HistoricalBook extends Vue {
  isLoading = true;
  isFetching = false;
  orders = [];
  limit = 10;
  nextPage = 0;

  created() {
    this.init();
  }

  @Watch('currentMarket')
  onCurrentMarketChanged() {
    this.init();
  }

  init() {
    this.isLoading = true;
    this.orders = [];

    this.getOrders().then(() => {
      this.isLoading = false;
    });
  }

  getOrders() {
    const { code } = this.currentMarket;
    this.isFetching = true;

    return this.apiService
      .getTrades(code, this.limit, this.nextPage)
      .then((response) => {
        const { data, pagination } = response;
        this.orders = [...this.orders, ...data];
        this.nextPage = pagination.next;
      })
      .finally(() => {
        this.isFetching = false;
      });
  }

  loadMore() {
    if (this.isFetching || this.nextPage === null) {
      return;
    }

    this.getOrders();
  }

  orderColor(order) {
    const type = order.side === 'sell' ? 'danger' : 'success';
    return `has-text-${type}`;
  }
}

export default HistoricalBook;
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
