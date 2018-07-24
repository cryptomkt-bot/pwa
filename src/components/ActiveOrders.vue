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
        <tr>
          <th>ID</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td :class="orderColor(order)">
            {{ formatAmount(order.price, market.quoteCurrency, market.decimals) }}
          </td>
          <td>
            {{ formatAmount(order.amount.remaining, market.baseCurrency, market.baseCurrency.decimals) }}
          </td>
          <td>
            <span @click="cancelOrder(order.id)" class="icon is-small">
              <i class="fa fa-times"></i>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { formatAmount } from '../utils';

export default {
  name: 'ActiveOrders',
  dependencies: ['apiService'],
  data() {
    return {
      market: null,
      orders: [],
      intervalId: null,
    };
  },
  created() {
    this.init();
  },
  destroyed() {
    clearInterval(this.intervalId);
  },
  computed: {
    currentMarket() {
      return this.$store.state.currentMarket;
    },
  },
  watch: {
    currentMarket() {
      this.init();
    },
  },
  methods: {
    formatAmount,
    init() {
      clearInterval(this.intervalId);
      this.market = null;
      this.updateOrders().then(() => {
        this.market = this.currentMarket;
      });
      // Update orders every 10 seconds
      this.intervalId = setInterval(() => {
        this.updateOrders();
      }, 10000);
    },
    updateOrders() {
      const url = `/orders/active/${this.currentMarket.code}`;
      return this.apiService.get(url).then((response) => {
        this.orders = response.data;
        this.$emit('ordersUpdated', this.orders);
      });
    },
    cancelOrder(orderId) {
      this.$store.commit('showDialog', {
        text: `¿Desea cancelar la orden ${orderId}?`,
        callback: () => {
          this.doCancelOrder(orderId);
        },
      });
    },
    doCancelOrder(orderId) {
      const endpoint = `/orders/${orderId}`;
      this.apiService.delete(endpoint).then((response) => {
        const text = 'Orden cancelada satisfactoriamente.';
        this.$store.commit('showToast', { text });
        const cancelledOrder = response.data;
        this.orders = this.orders.filter(order => order.id !== cancelledOrder.id);
      });
    },
    orderColor(order) {
      const type = order.type === 'sell' ? 'danger' : 'success';
      return `has-text-${type}`;
    },
  },
};
</script>
