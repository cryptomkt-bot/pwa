<template>
  <div id="app">
    <div class="container">
      <OrderBook/>
    </div>
  </div>
</template>

<script>
import 'bulma'
import OrderBook from './components/OrderBook'

export default {
  name: 'App',
  components: {
    OrderBook
  }
}
</script>

<style>
</style>
