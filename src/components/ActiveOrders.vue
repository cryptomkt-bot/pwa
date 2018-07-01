<template>
  <table class="table is-fullwidth is-marginless is-size-7">
    <thead>
    <th>Precio</th>
    <th>Cantidad</th>
    <th>Eliminar</th>
    </thead>
    <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td :class="orderColor(order)">${{ order.price }}</td>
        <td>{{ order.amount.remaining | toDecimals(4) }} ETH</td>
        <td>
          <span class="delete is-small" @click="deleteOrder(order.id)"></span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import ApiService from '../services/ApiService'

export default {
  name: 'ActiveOrders',
  data () {
    return {
      api: new ApiService(),
      orders: [],
      intervalId: null
    }
  },
  created () {
    this.getOrders()
    this.intervalId = setInterval(this.getOrders, 10000)
  },
  destroyed () {
    clearInterval(this.intervalId)
  },
  methods: {
    getOrders () {
      this.api.get('/orders/active').then(response => {
        this.orders = response.data
        this.$emit('ordersUpdated', this.orders)
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
    }
  }
}
</script>

<style scoped>

</style>
