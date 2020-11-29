<template>
  <div class="position-relative">
    <b-loading :active="isLoading" :is-full-page="false"></b-loading>
    <span v-if="!isLoading && !orders.length" class="is-size-7">
      {{ $t('noOpenOrders') }}
    </span>
    <table
      v-if="orders.length"
      class="table is-fullwidth is-marginless is-size-7"
    >
      <thead>
        <tr>
          <th>{{ $t('id') }}</th>
          <th>{{ $t('price') }}</th>
          <th>{{ $t('amount') }}</th>
          <th>{{ $t('cancel') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td :class="orderColor(order)">
            {{
              formatAmount(
                order.price,
                currentMarket.quoteCurrency,
                currentMarket.decimals
              )
            }}
          </td>
          <td>
            {{
              formatAmount(
                Number(order.amount.original) - Number(order.amount.executed),
                currentMarket.baseCurrency,
                currentMarket.baseCurrency.decimals
              )
            }}
          </td>
          <td>
            <span @click="cancelOrder(order)" class="icon is-small">
              <i class="mdi mdi-close-circle"></i>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component()
class ActiveOrders extends Vue {
  isLoading = true;

  created() {
    this.init();
  }

  @Watch('currentMarket')
  onCurrentMarketChanged() {
    this.init();
  }

  init() {
    this.isLoading = true;
    this.apiService.fetchActiveOrders(this.currentMarket.code).then(() => {
      this.isLoading = false;
    });
  }

  get orders() {
    return this.$store.state.activeOrders;
  }

  cancelOrder(order) {
    this.confirm({
      message: this.$t('cancelOrderConfirm', { id: order.id }),
      onConfirm: () => {
        this.doCancelOrder(order);
      },
    });
  }

  doCancelOrder(order) {
    this.isLoading = true;
    this.apiService
      .deleteOrder(order.id)
      .then(() => {
        const filteredOrders = this.orders.filter((o) => o.id !== order.id);
        this.$store.commit('setActiveOrders', filteredOrders);
        this.isLoading = false;
        this.$buefy.toast.open({
          message: this.$t('orderCancelled'),
          type: 'is-info',
        });
      })
      .catch(() => {
        this.isLoading = false;
        this.$buefy.snackbar.open({
          message: this.$t('errorMsg'),
          type: 'is-danger',
          indefinite: true,
        });
      });
  }

  orderColor(order) {
    const type = order.side === 'sell' ? 'danger' : 'success';
    return `has-text-${type}`;
  }
}

export default ActiveOrders;
</script>
