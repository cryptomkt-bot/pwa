<template>
  <table id="order-book-table" class="table is-hoverable is-fullwidth is-size-7">
    <thead>
      <th>Precio</th>
      <th>Cantidad</th>
      <th>Acumulado</th>
    </thead>
    <tbody>
      <!-- Sell book -->
      <tr v-for="order in [...sellBook].reverse()" :key="order.timestamp"
          :class="{ 'selected': activeOrdersTimestamp.includes(order.timestamp) }">
        <td class="has-text-danger">${{ order.price }}</td>
        <td>{{ order.amount | toDecimals(4) }} ETH</td>
        <td>{{ order.accumulated | toDecimals(4) }} ETH</td>
      </tr>
      <!-- Spread -->
      <tr id="spread-row">
        <td>${{ spread }} ({{ spreadPercentage }}%)</td>
        <td></td>
        <td>Spread</td>
      </tr>
      <!-- Buy book -->
      <tr v-for="order in buyBook" :key="order.timestamp"
          :class="{ 'selected': activeOrdersTimestamp.includes(order.timestamp) }">
        <td class="has-text-success">${{ order.price }}</td>
        <td>{{ order.amount | toDecimals(4) }} ETH</td>
        <td>{{ order.accumulated | toDecimals(4) }} ETH</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import axios from 'axios'

export default {
  name: 'OrderBook',
  created () {
    this.getBooks().then(() => { // Get the order books
      // Center the order book
      let target = document.getElementById('spread-row')
      for (let i = 0; i < 4; i++) {
        target = target.previousElementSibling
      }
      target.scrollIntoView()
    })
    setInterval(this.getBooks, 10000) // Update books every 10 secs
  },
  data () {
    return {
      buyBook: [],
      sellBook: [],
      activeOrdersTimestamp: [] // The timestamp of my active orders
    }
  },
  computed: {
    ask () {
      return this.sellBook.length ? Number(this.sellBook[0]['price']) : 0
    },
    bid () {
      return this.sellBook.length ? Number(this.buyBook[0]['price']) : 0
    },
    spread () {
      return this.ask - this.bid
    },
    spreadPercentage () {
      let spreadPercentage = (this.spread / this.ask) * 100
      return spreadPercentage.toFixed(2)
    }
  },
  methods: {
    getBooks () {
      const url = 'https://api.cryptomkt.com/v1/book?market=ETHARS'
      const sellBookRequest = axios.get(url, {
        params: { type: 'sell' }
      })
      const buyBookRequest = axios.get(url, {
        params: { type: 'buy' }
      })

      // Fetch both the buy and sell order books (concurrently)
      return axios.all([buyBookRequest, sellBookRequest])
        .then(axios.spread((buyBookResponse, sellBookResponse) => {
          let buyBook = buyBookResponse.data.data
          let sellBook = sellBookResponse.data.data
          // Add accumulated amount to the books
          this.addAccumulated(buyBook)
          this.addAccumulated(sellBook)
          // Update the books
          this.buyBook = buyBook
          this.sellBook = sellBook
        }))
    },
    addAccumulated (book) {
      /** Add accumulated amount to the book **/
      let accumulated = 0
      for (let order of book) {
        accumulated += Number(order.amount)
        order.accumulated = accumulated
      }
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
</style>
