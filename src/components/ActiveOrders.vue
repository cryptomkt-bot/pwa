<template>
  <div>
    <div v-if="!market" class="has-text-centered">
      <span id="loading-message">Cargando ...</span>
    </div>
    <span v-else-if="!orders.length" class="is-size-7">No hay órdenes abiertas.</span>
    <table v-else class="table is-fullwidth is-marginless is-size-7">
      <thead>
        <th>Precio</th>
        <th>Cantidad</th>
        <th>Eliminar</th>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td :class="orderColor(order)">{{ formatAmount(order.price, market.quoteCurrency) }}</td>
          <td>{{ formatAmount(order.amount.remaining, market.baseCurrency) }}</td>
          <td>
            <span class="delete is-small" @click="deleteOrder(order.id)"></span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ApiService from '../services/ApiService'
import { formatAmount } from '../utils'

export default {
  name: 'ActiveOrders',
  data () {
    return {
      market: null,
      api: new ApiService(),
      orders: [],
      intervalId: null
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
    }
  },
  watch: {
    currentMarket (newMarket) {
      this.init(newMarket)
    }
  },
  methods: {
    init (market) {
      this.market = null
      this.getOrders(market).then(orders => {
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
    getOrders (market) {
      const params = { market: market.code }
      return this.api.get('/orders/active', params).then(response => {
        const orders = response.data
        this.$emit('ordersUpdated', orders)
        return new Promise(resolve => resolve(orders))
      })
    },
    deleteOrder (orderId) {
      if (!confirm('¿Estás seguro?')) {
        return
      }
      const endpoint = `/orders/${orderId}`
      this.api.delete(endpoint).then(response => {
        orderId = response.data.id
        this.orders = this.orders.filter(order => order.id !== orderId)
      })
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

  #loading-message {
    line-height: $bodyHeight + 30px;
  }
</style>
