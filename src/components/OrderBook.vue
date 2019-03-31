<template>
  <div class="position-relative">
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
          :class="{ selected: activeOrdersTimestamp.includes(order.timestamp) }"
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
          :class="{ selected: activeOrdersTimestamp.includes(order.timestamp) }"
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
export default class OrderBook extends Vue {
  get formattedSpread() {
    const currency = this.currentMarket.quoteCurrency;
    const spread = toDecimals(this.spread, this.currentMarket.decimals);
    return `${currency.prefix}${spread} ${currency.postfix} (${
      this.spreadPercentage
    }%)`;
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
    if (this.sellBook.length < 4) {
      // Not enough rows
      return;
    }
    let target = document.getElementById('spread-row');
    for (let i = 0; i < 4; i += 1) {
      target = target.previousElementSibling;
    }
    target.scrollIntoView();
  }
}
</script>

<style scoped lang="scss">
#order-book-table {
  tr.selected {
    background-color: #fffde7;
  }
  tbody {
    display: block;
    height: 270px;
    overflow: auto;
  }
  thead,
  tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
}
#spread-row {
  background-color: #eceff1;
}
#spread {
  white-space: nowrap;
}
#updated-time {
  padding: 2px 4px;
  background-color: #fafafa;
}
</style>
