<template>
  <div>
    <div v-if="!orders.length" class="has-text-centered">
      <span id="loading-message">Cargando ...</span>
    </div>
    <table v-else class="table is-fullwidth is-marginless is-size-7">
      <thead>
        <th>Fecha</th>
        <th>Precio</th>
        <th>Cantidad</th>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.executed_at">
          <td>{{ order.executed_at + '-00:00' | date }}</td>
          <td :class="orderColor(order)">${{ order.execution_price }}</td>
          <td>{{ order.amount.executed | toDecimals(4) }} ETH</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ExecutedOrders',
  props: ['isVisible'],
  data () {
    return {
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
        this.getOrders() // Get latest orders
        this.intervalId = setInterval(this.getOrders, 10000) // Update trades every 10 secs
      } else { // The component gets hidden
        this.orders = []
        clearInterval(this.intervalId) // Stop updating the orders
      }
    }
  },
  methods: {
    getOrders () {
      const url = 'http://localhost:5000/orders/executed'
      axios.get(url).then(response => {
        this.orders = response.data
      })
    },
    orderColor (order) {
      const type = order.type === 'sell' ? 'danger' : 'success'
      return `has-text-${type}`
    }
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
