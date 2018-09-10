<template>
  <div :class="{ 'loading-wrapper': isLoading }">
    <b-loading :active="isLoading" :is-full-page="false"></b-loading>
    <table id="order-book-table" class="table is-fullwidth is-size-7 is-marginless">
      <thead>
        <tr>
          <th>{{ $t('price') }}</th>
          <th>{{ $t('amount') }}</th>
          <th>{{ $t('accumulated') }}</th>
        </tr>
      </thead>
      <tbody>
        <!-- Sell book -->
        <tr v-for="order in [...sellBook].reverse()" :key="order.timestamp"
            :class="{ 'selected': activeOrdersTimestamp.includes(order.timestamp) }">
          <td class="has-text-danger">
            {{ formatAmount(order.price, currentMarket.quoteCurrency, currentMarket.decimals) }}
          </td>
          <td>
            {{ formatAmount(order.amount, currentMarket.baseCurrency, currentMarket.baseCurrency.decimals) }}
          </td>
          <td>
            {{ formatAmount(order.accumulated, currentMarket.baseCurrency, currentMarket.baseCurrency.decimals) }}
          </td>
        </tr>
        <!-- Spread -->
        <tr v-show="sellBook.length && buyBook.length" id="spread-row">
          <td id="spread">{{ formattedSpread }}</td>
          <td></td>
          <td>{{ $t('spread') }}</td>
        </tr>
        <!-- Buy book -->
        <tr v-for="order in buyBook" :key="order.timestamp"
            :class="{ 'selected': activeOrdersTimestamp.includes(order.timestamp) }">
          <td class="has-text-success">
            {{ formatAmount(order.price, currentMarket.quoteCurrency, currentMarket.decimals) }}
          </td>
          <td>
            {{ formatAmount(order.amount, currentMarket.baseCurrency, currentMarket.baseCurrency.decimals) }}
          </td>
          <td>
            {{ formatAmount(order.accumulated, currentMarket.baseCurrency, currentMarket.baseCurrency.decimals) }}
          </td>
        </tr>
      </tbody>
    </table>
    <p id="updated-time" v-if="updateTime" class="is-size-7">
      {{ $t('updatedAt', { updateTime }) }}
    </p>
  </div>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import { localeTime, toDecimals } from '../utils';
import CryptoMktHelper from '../helpers/CryptoMktHelper';

@Component({
  props: ['activeOrders'],
})
export default class OrderBook extends Vue {
  isLoading = true;
  buyBook = [];
  sellBook = [];
  intervalId = null;
  updateTime = null;

  created() {
    this.init();
  }

  destroyed() {
    clearInterval(this.intervalId);
  }

  get currentMarket() {
    return this.$store.state.currentMarket;
  }

  get ask() {
    return this.sellBook.length ? Number(this.sellBook[0].price) : 0;
  }

  get bid() {
    return this.buyBook.length ? Number(this.buyBook[0].price) : 0;
  }

  get spread() {
    return this.ask - this.bid;
  }

  get formattedSpread() {
    const currency = this.currentMarket.quoteCurrency;
    const spread = toDecimals(this.spread, this.currentMarket.decimals);
    return `${currency.prefix}${spread} ${currency.postfix} (${this.spreadPercentage}%)`;
  }

  get spreadPercentage() {
    const spreadPercentage = (this.spread / this.ask) * 100;
    return spreadPercentage.toFixed(2);
  }

  get activeOrdersTimestamp() {
    const { activeOrders } = this.$store.state;
    return activeOrders.map(order => order.created_at);
  }

  init() {
    this.isLoading = true;
    clearInterval(this.intervalId);
    this.updateBooks().then(() => { // Get the order books
      setTimeout(() => {
        this.centerBook();
        this.isLoading = false;
      }, 500); // Center books
    });
    // Update books every 10 seconds
    this.intervalId = setInterval(() => {
      this.updateBooks();
    }, 10000);
  }

  updateBooks() {
    return CryptoMktHelper.getBooks(this.currentMarket.code, 50)
      .then((books) => {
        const { buyBook, sellBook } = books;
        this.updateTime = localeTime(new Date());
        // Add accumulated amount to the books
        this.addAccumulated(buyBook);
        this.addAccumulated(sellBook);
        // Update the books
        this.buyBook = buyBook;
        this.sellBook = sellBook;
        this.$store.commit('updatePrices', {
          ask: this.ask,
          bid: this.bid,
        });
      });
  }

  addAccumulated(book) {
    /** Add accumulated amount to the book */
    let accumulated = 0;
    book.forEach((order) => {
      accumulated += Number(order.amount);
      order.accumulated = accumulated;
    });
  }

  centerBook() {
    if (this.sellBook.length < 4) { // Not enough rows
      return;
    }
    let target = document.getElementById('spread-row');
    for (let i = 0; i < 4; i += 1) {
      target = target.previousElementSibling;
    }
    target.scrollIntoView();
  }

  @Watch('currentMarket')
  onCurrentMarketChanged() {
    this.init();
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
    thead, tbody tr {
      display: table;
      width: 100%;
      table-layout: fixed;
    }
  }
  #spread-row { background-color: #eceff1 }
  #spread { white-space: nowrap }
  #updated-time {
    padding: 2px 4px;
    background-color: #fafafa;
  }
</style>
