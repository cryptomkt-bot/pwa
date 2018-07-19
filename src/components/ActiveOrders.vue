<template>
  <div>
    <div v-if="!market" class="has-text-centered">
      <span class="icon">
        <i class="fa fa-spinner fa-pulse"></i>
      </span>
    </div>
    <span v-else-if="!orders.length" class="is-size-7">No hay órdenes abiertas.</span>
    <table v-else class="table is-fullwidth is-marginless is-size-7">
      <thead>
        <th>ID</th>
        <th>Precio</th>
        <th>Cantidad</th>
        <th>Eliminar</th>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td :class="orderColor(order)">{{ formatAmount(order.price, market.quoteCurrency) }}</td>
          <td>{{ formatAmount(order.amount.remaining, market.baseCurrency) }}</td>
          <td>
            <span class="icon is-small" @click="deleteOrder(order.id)">
              <i class="fa fa-times"></i>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { formatAmount } from '../utils'

export default {
  name: 'ActiveOrders',
  dependencies: ['apiService'],
  data () {
    return {
      market: null,
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
      const url = `/orders/active/${market.code}`
      return this.apiService.get(url).then(response => {
        const orders = response.data
        this.$emit('ordersUpdated', orders)
        return new Promise(resolve => resolve(orders))
      })
    },
    deleteOrder (orderId) {
      this.$store.commit('showDialog', {
        text: `¿Desea eliminar la orden ${orderId}?`,
        callback: () => {
          this.doDeleteOrder(orderId)
        }
      })
    },
    doDeleteOrder (orderId) {
      const endpoint = `/orders/${orderId}`
      this.apiService.delete(endpoint).then(response => {
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

<style scoped>
</style>
