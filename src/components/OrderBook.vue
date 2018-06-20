<template>
  <div>
    <div v-if="!sellBook.length || !buyBook.length" class="has-text-centered">
      <span id="loading-message">Cargando ...</span>
    </div>
    <table v-else id="order-book-table" class="table is-hoverable is-fullwidth is-size-7 is-marginless">
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
    <p class="is-size-7" v-if="updatedAt">Actualizado a las: {{ updatedAt | localetime }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'OrderBook',
  props: ['activeOrders'],
  data () {
    return {
      buyBook: [],
      sellBook: [],
      intervalId: null,
      updatedAt: null
    }
  },
  created () {
    this.getBooks().then(() => { // Get the order books
      // Center the order book
      let target = document.getElementById('spread-row')
      for (let i = 0; i < 4; i++) {
        target = target.previousElementSibling
      }
      target.scrollIntoView()
    })
    this.intervalId = setInterval(this.getBooks, 10000) // Update books every 10 secs
  },
  destroyed () {
    clearInterval(this.intervalId)
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
    },
    activeOrdersTimestamp () {
      return this.activeOrders.map(order => order.created_at)
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
    }
  }
}
</script>

<style scoped lang="scss">
  $bodyHeight: 270px;
  #order-book-table {
    tr.selected {
      background-color: #fffde7;
    }
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
  }
  #spread-row {
    background-color: #eceff1;
  }
  #loading-message {
    line-height: $bodyHeight + 30px;
  }
</style>
