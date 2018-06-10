<template>
  <table class="table is-hoverable is-fullwidth is-size-7">
    <thead>
      <th>Fecha</th>
      <th>Precio</th>
      <th>Cantidad</th>
    </thead>
    <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td>{{ order.timestamp | date }}</td>
        <td :class="orderColor(order)">${{ order.price }}</td>
        <td>{{ order.amount | toDecimals(4) }} ETH</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Trades',
  data () {
    return {
      orders: []
    }
  },
  created () {
    this.getOrders()
    setInterval(this.getOrders, 10000)
  },
  methods: {
    getOrders () {
      const url = 'https://api.cryptomkt.com/v1/trades?market=ETHARS'
      axios.get(url).then(response => {
        this.orders = response.data.data
      })
    },
    orderColor (order) {
      const type = order.market_taker === 'sell' ? 'danger' : 'success'
      return `has-text-${type}`
    }
  }
}
</script>

<style scoped>
  tbody {
    display: block;
    height: 100px;
    overflow: auto;
  }
  thead, tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
</style>
