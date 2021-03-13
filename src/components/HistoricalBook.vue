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
        <tr v-for="order in historicalBook" :key="order.executed_date">
          <td>{{ Number(order.executed_date) | date }}</td>
          <td :class="orderColor(order)">
            {{
              formatAmount(
                order.executed_price,
                currentMarket.quoteCurrency,
                currentMarket.decimals
              )
            }}
          </td>
          <td>
            {{
              formatAmount(
                order.executed_amount,
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
import { mapState } from 'vuex';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  computed: {
    ...mapState(['historicalBook', 'isLoading']),
  },
})
class HistoricalBook extends Vue {
  orderColor(order) {
    const type = order.side === 1 ? 'success' : 'danger';
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
