<template>
  <div :class="{ 'loading-wrapper': isLoading }">
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
import CryptoMktHelper from '../helpers/CryptoMktHelper';

@Component({
  props: ['activeOrders'],
  dependencies: ['apiService'],
  computed: {
    ...mapState(['buyBook', 'sellBook', 'updatedAt']),
    ...mapGetters(['activeOrdersTimestamp', 'spread', 'spreadPercentage']),
  },
})
export default class OrderBook extends Vue {
  isLoading = true;
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

  get formattedSpread() {
    const currency = this.currentMarket.quoteCurrency;
    const spread = toDecimals(this.spread, this.currentMarket.decimals);
    return `${currency.prefix}${spread} ${currency.postfix} (${
      this.spreadPercentage
    }%)`;
  }

  init() {
    this.isLoading = true;
    clearInterval(this.intervalId);
    this.updateBooks()
      .then(() => {
        // Get the order books
        setTimeout(() => {
          this.centerBook();
          this.isLoading = false;
        }, 500); // Center books
      })
      .catch(() => {
        this.isLoading = false; // .finally() not working in Firefox
      });
    // Update books every 10 seconds
    this.intervalId = setInterval(() => {
      this.updateBooks();
    }, 10000);
  }

  updateBooks() {
    const orderBookPromise = CryptoMktHelper.getBooks(this.currentMarket.code);
    const activeOrdersPromise = this.apiService.getActiveOrders();
    return Promise.all([orderBookPromise, activeOrdersPromise]);
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
