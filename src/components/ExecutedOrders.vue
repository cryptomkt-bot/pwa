<template>
  <div>
    <div v-if="!market" class="has-text-centered">
      <span id="loading-message">Cargando ...</span>
    </div>
    <span v-else-if="!orders.length" class="is-size-7">Ninguna órden.</span>
    <table v-else class="table is-fullwidth is-marginless is-size-7">
      <thead>
        <th>Fecha</th>
        <th>Precio</th>
        <th>Cantidad</th>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.executed_at">
          <td>{{ order.executed_at + '-00:00' | date }}</td>
          <td :class="orderColor(order)">{{ formatAmount(order.execution_price, market.quoteCurrency) }}</td>
          <td>{{ formatAmount(order.amount.executed, market.baseCurrency) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ApiService from '../services/ApiService'
import { formatAmount } from '../utils'

export default {
  name: 'ExecutedOrders',
  props: ['isVisible'],
  data () {
    return {
      market: null,
      api: new ApiService(),
      orders: [],
      intervalId: null
    }
  },
  destroyed () {
    clearInterval(this.intervalId)
  },
  watch: {
    isVisible (newValue) {
      if (newValue === true) { // The component is visible
        this.init(this.currentMarket)
      } else { // The component gets hidden
        this.orders = []
        clearInterval(this.intervalId) // Stop updating the orders
      }
    },
    currentMarket (newMarket) {
      this.init(newMarket)
    }
  },
  computed: {
    currentMarket () {
      return this.$store.state.currentMarket
    }
  },
  methods: {
    init (market) {
      this.market = null
      this.getOrders().then(orders => {
        this.orders = orders
        this.market = market
        clearInterval(this.intervalId)
        this.intervalId = setInterval(() => {
          this.getOrders(market).then(orders => {
            this.orders = orders
          })
        }, 10000)
      })
    },
    getOrders () {
      const params = { market: this.currentMarket.code }
      return this.api.get('/orders/executed', params).then(
        response => new Promise(resolve => resolve(response.data))
      )
    },
    orderColor (order) {
      const type = order.type === 'sell' ? 'danger' : 'success'
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
  #loading-message {
    line-height: $bodyHeight + 30px;
  }
</style>
