<template>
  <div>
    <div v-if="!market" class="has-text-centered">
      <span class="icon">
        <i class="fa fa-spinner fa-pulse"></i>
      </span>
    </div>
    <table v-else class="table is-fullwidth is-marginless is-size-7">
      <thead>
        <th>Fecha</th>
        <th>Precio</th>
        <th>Cantidad</th>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.timestamp">
          <td>{{ order.timestamp + '-00:00' | date }}</td>
          <td :class="orderColor(order)">{{ formatAmount(order.price, currentMarket.quoteCurrency) }}</td>
          <td>{{ formatAmount(order.amount, currentMarket.baseCurrency) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
import { formatAmount } from '../utils'

export default {
  name: 'Trades',
  props: ['isVisible'],
  data () {
    return {
      market: null,
      orders: [],
      intervalId: null
    }
  },
  destroyed () {
    clearInterval(this.intervalId)
  },
  computed: {
    currentMarket () {
      return this.$store.state.currentMarket
    }
  },
  watch: {
    isVisible (newValue) {
      if (newValue === true) { // The component is visible
        this.init(this.currentMarket) // Get latest orders
      } else { // The component gets hidden
        this.orders = []
        clearInterval(this.intervalId) // Stop updating the orders
      }
    },
    currentMarket (newMarket) {
      this.init(newMarket)
    }
  },
  methods: {
    init (market) {
      this.market = null
      this.getOrders().then(orders => {
        this.orders = orders
        this.market = market
        clearInterval(this.intervalId) // Stop updating the orders
        this.intervalId = setInterval(() => {
          this.getOrders(market).then(orders => {
            this.orders = orders
          })
        }, 10000) // Update trades every 10 secs
      })
    },
    getOrders () {
      const url = 'https://api.cryptomkt.com/v1/trades'
      const params = {
        market: this.currentMarket.code,
        limit: 100
      }
      return axios.get(url, { params }).then(
        response => new Promise(resolve => resolve(response.data.data))
      )
    },
    orderColor (order) {
      const type = order.market_taker === 'sell' ? 'danger' : 'success'
      return `has-text-${type}`
    },
    formatAmount
  }
}
</script>

<style scoped lang="scss">
  $bodyHeight: 100px;
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
</style>
