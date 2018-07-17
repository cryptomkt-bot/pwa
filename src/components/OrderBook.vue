<template>
  <div>
    <div v-if="!market || !sellBook.length || !buyBook.length" class="has-text-centered">
      <span class="icon">
        <i class="fa fa-spinner fa-pulse"></i>
      </span>
    </div>
    <table v-else id="order-book-table" class="table is-fullwidth is-size-7 is-marginless">
      <thead>
        <th>Precio</th>
        <th>Cantidad</th>
        <th>Acumulado</th>
      </thead>
      <tbody>
        <!-- Sell book -->
        <tr v-for="order in [...sellBook].reverse()" :key="order.timestamp"
            :class="{ 'selected': activeOrdersTimestamp.includes(order.timestamp) }">
          <td class="has-text-danger">{{ formatAmount(order.price, market.quoteCurrency) }}</td>
          <td>{{ formatAmount(order.amount, market.baseCurrency) }}</td>
          <td>{{ formatAmount(order.accumulated, market.baseCurrency) }}</td>
        </tr>
        <!-- Spread -->
        <tr id="spread-row">
          <td id="spread">{{ formattedSpread }}</td>
          <td></td>
          <td>Spread</td>
        </tr>
        <!-- Buy book -->
        <tr v-for="order in buyBook" :key="order.timestamp"
            :class="{ 'selected': activeOrdersTimestamp.includes(order.timestamp) }">
          <td class="has-text-success">{{ formatAmount(order.price, market.quoteCurrency) }}</td>
          <td>{{ formatAmount(order.amount, market.baseCurrency) }}</td>
          <td>{{ formatAmount(order.accumulated, market.baseCurrency) }}</td>
        </tr>
      </tbody>
    </table>
    <p id="updated-time" class="is-size-7" v-if="updatedAt">Actualizado a las {{ updatedAt | localetime }}</p>
  </div>
</template>

<script>
import axios from 'axios'
import { formatAmount, toDecimals } from '../utils'

export default {
  name: 'OrderBook',
  props: ['activeOrders'],
  data () {
    return {
      market: null,
      buyBook: [],
      sellBook: [],
      intervalId: null,
      updatedAt: null
    }
  },
  created () {
    this.init(this.currentMarket)
  },
  destroyed () {
    clearInterval(this.intervalId)
  },
  computed: {
    currentMarket () {
      return this.$store.state.currentMarket
    },
    ask () {
      return this.sellBook.length ? Number(this.sellBook[0]['price']) : 0
    },
    bid () {
      return this.buyBook.length ? Number(this.buyBook[0]['price']) : 0
    },
    spread () {
      return this.ask - this.bid
    },
    formattedSpread () {
      const currency = this.market.quoteCurrency
      const spread = toDecimals(this.spread, currency.decimals)
      return `${currency.prefix}${spread} ${currency.postfix} (${this.spreadPercentage}%)`
    },
    spreadPercentage () {
      let spreadPercentage = (this.spread / this.ask) * 100
      return spreadPercentage.toFixed(2)
    },
    activeOrdersTimestamp () {
      return this.activeOrders.map(order => order.created_at)
    }
  },
  methods: {
    init (market) {
      this.market = null
      this.getBooks(market).then(() => { // Get the order books
        this.market = market
        setTimeout(this.centerBook, 500) // Center book
      })
      clearInterval(this.intervalId)
      this.intervalId = setInterval(() => {
        this.getBooks(market)
      }, 10000) // Update books every 10 secs
    },
    getBooks (market) {
      const url = 'https://api.cryptomkt.com/v1/book'
      const sellBookRequest = axios.get(url, {
        params: { market: market.code, type: 'sell' }
      })
      const buyBookRequest = axios.get(url, {
        params: { market: market.code, type: 'buy' }
      })

      // Fetch both the buy and sell order books (concurrently)
      return axios.all([buyBookRequest, sellBookRequest])
        .then(axios.spread((buyBookResponse, sellBookResponse) => {
          this.updatedAt = new Date()
          let buyBook = buyBookResponse.data.data
          let sellBook = sellBookResponse.data.data
          // Add accumulated amount to the books
          this.addAccumulated(buyBook)
          this.addAccumulated(sellBook)
          // Update the books
          this.buyBook = buyBook
          this.sellBook = sellBook
          this.$emit('tickerUpdated', [this.ask, this.bid])
        }))
    },
    addAccumulated (book) {
      /** Add accumulated amount to the book **/
      let accumulated = 0
      for (let order of book) {
        accumulated += Number(order.amount)
        order.accumulated = accumulated
      }
    },
    centerBook () {
      let target = document.getElementById('spread-row')
      for (let i = 0; i < 4; i++) {
        target = target.previousElementSibling
      }
      target.scrollIntoView()
    },
    formatAmount
  },
  watch: {
    currentMarket (newMarket) {
      this.init(newMarket)
    }
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
  #spread-row {
    background-color: #eceff1;
  }
  #spread {
    white-space: nowrap
  }
  #updated-time {
    padding: 2px 4px;
    background-color: #fafafa;
  }
</style>
