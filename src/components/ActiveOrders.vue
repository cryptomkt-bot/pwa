<template>
  <div>
    <span v-if="!orders.length" class="is-size-7">
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
                order.amount.remaining,
                currentMarket.baseCurrency,
                currentMarket.baseCurrency.decimals
              )
            }}
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
import { Component, Vue } from 'vue-property-decorator';

@Component({
  dependencies: ['apiService'],
})
export default class ActiveOrders extends Vue {
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
    this.apiService
      .deleteOrder(order.id)
      .then(() => {
        this.$toast.open({
          message: this.$t('orderCancelled'),
          type: 'is-info',
        });
      })
      .catch(() => {
        this.$snackbar.open({
          message: this.$t('errorMsg'),
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
