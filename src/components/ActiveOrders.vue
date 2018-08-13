<template>
  <div class="loading-wrapper">
    <b-loading :active="isLoading" :is-full-page="false"></b-loading>
    <span v-if="!isLoading && !orders.length" class="is-size-7">No hay órdenes abiertas.</span>
    <table v-if="!isLoading && orders.length" class="table is-fullwidth is-marginless is-size-7">
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
            {{ formatAmount(order.price, currentMarket.quoteCurrency, currentMarket.decimals) }}
          </td>
          <td>
            {{ formatAmount(order.amount.remaining, currentMarket.baseCurrency, currentMarket.baseCurrency.decimals) }}
          </td>
          <td>
            <span @click="cancelOrder(order)" class="icon is-small">
              <i class="fa fa-times"></i>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  dependencies: ['apiService'],
})
export default class ActiveOrders extends Vue {
  orders = [];
  intervalId = null;
  isLoading = false;

  created() {
    this.init();
  }

  destroyed() {
    clearInterval(this.intervalId);
  }

  get currentMarket() {
    return this.$store.state.currentMarket;
  }

  @Watch('currentMarket')
  onCurrentMarketChanged() {
    this.init();
  }

  init() {
    clearInterval(this.intervalId);
    this.isLoading = true;
    this.updateOrders().then(() => {
      this.isLoading = false;
    });
    // Update orders every 10 seconds
    this.intervalId = setInterval(() => {
      this.updateOrders();
    }, 10000);
  }

  updateOrders() {
    const url = `/orders/active/${this.currentMarket.code}`;
    return this.apiService.get(url).then((response) => {
      this.orders = response.data;
      this.$store.commit('updateActiveOrders', this.orders);
    });
  }

  cancelOrder(order) {
    this.$dialog.confirm({
      message: `¿Desea cancelar la orden ${order.id}?`,
      onConfirm: () => {
        this.doCancelOrder(order);
      },
    });
  }

  doCancelOrder(order) {
    const endpoint = `/orders/${order.id}`;
    this.apiService.delete(endpoint)
      .then(() => {
        this.$toast.open({
          message: 'Orden cancelada satisfactoriamente',
          type: 'is-info',
        });
        this.orders = this.orders.filter(o => o.id !== order.id);
      })
      .catch(() => {
        this.$snackbar.open({
          message: 'Lo sentimos, ha ocurrido un error.',
          type: 'is-danger',
          indefinite: true,
        });
      });
  }

  orderColor(order) {
    const type = order.type === 'sell' ? 'danger' : 'success';
    return `has-text-${type}`;
  }
}
</script>
