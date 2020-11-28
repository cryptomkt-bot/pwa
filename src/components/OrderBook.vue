<template>
  <div :class="{ 'position-relative': isLoading }">
    <b-loading :active="isLoading" :is-full-page="false"></b-loading>
    <table
      id="order-book-table"
      class="table is-fullwidth is-size-7 is-marginless"
    >
      <thead>
        <tr>
          <th>{{ $t('price') }}</th>
          <th>{{ $t('amount') }}</th>
          <th>{{ $t('accumulated') }}</th>
        </tr>
      </thead>
      <tbody>
        <!-- Sell book -->
        <tr
          v-for="order in [...sellBook].reverse()"
          :key="order.timestamp"
          :class="{
            selected: activeOrdersTimestamp.includes(
              new Date(order.timestamp).getTime()
            ),
          }"
        >
          <td class="has-text-danger">
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
          <td>
            {{
              formatAmount(
                order.accumulated,
                currentMarket.baseCurrency,
                currentMarket.baseCurrency.decimals
              )
            }}
          </td>
        </tr>
        <!-- Spread -->
        <tr v-show="sellBook.length && buyBook.length" id="spread-row">
          <td id="spread">{{ formattedSpread }}</td>
          <td></td>
          <td>{{ $t('spread') }}</td>
        </tr>
        <!-- Buy book -->
        <tr
          v-for="order in buyBook"
          :key="order.timestamp"
          :class="{
            selected: activeOrdersTimestamp.includes(
              new Date(order.timestamp).getTime()
            ),
          }"
        >
          <td class="has-text-success">
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
          <td>
            {{
              formatAmount(
                order.accumulated,
                currentMarket.baseCurrency,
                currentMarket.baseCurrency.decimals
              )
            }}
          </td>
        </tr>
      </tbody>
    </table>
    <p id="updated-time" v-if="updatedAt" class="is-size-7">
      {{ $t('updatedAt', { updatedAt }) }}
    </p>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { Component, Vue, Watch } from 'vue-property-decorator';

import { toDecimals } from '../utils';

@Component({
  computed: {
    ...mapState(['buyBook', 'sellBook', 'isLoading', 'updatedAt']),
    ...mapGetters(['activeOrdersTimestamp', 'spread', 'spreadPercentage']),
  },
})
class OrderBook extends Vue {
  mounted() {
    this.centerBook();
  }

  get formattedSpread() {
    const currency = this.currentMarket.quoteCurrency;
    const spread = toDecimals(this.spread, this.currentMarket.decimals);
    return `${currency.prefix}${spread} ${currency.postfix} (${this.spreadPercentage}%)`;
  }

  @Watch('isLoading')
  onLoadingFinished() {
    if (this.isLoading) {
      // Still loading, do nothing.
      return;
    }
    setTimeout(() => {
      // Workaround to make centering work
      this.centerBook();
    }, 0);
  }

  centerBook() {
    const visibleOrders = 5;
    if (this.sellBook.length < visibleOrders) {
      // Not enough rows
      return;
    }
    let target = document.getElementById('spread-row');
    for (let i = 0; i < visibleOrders; i += 1) {
      target = target.previousElementSibling;
    }
    target.scrollIntoView();
  }
}

export default OrderBook;
</script>

<style scoped lang="scss">
#order-book-table {
  @media (prefers-color-scheme: light) {
    #spread-row {
      background-color: #eceff1;
    }
    tr.selected {
      background-color: #fffde7;
    }
  }
  @media (prefers-color-scheme: dark) {
    #spread-row,
    tr.selected {
      background-color: #222;
    }
  }
  tbody {
    display: block;
    height: 330px;
    overflow: auto;
  }
  thead,
  tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
}
#spread {
  white-space: nowrap;
}
#updated-time {
  padding: 2px 4px;
  @media (prefers-color-scheme: light) {
    background-color: #fafafa;
  }
}
</style>
