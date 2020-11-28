<template>
  <!-- Modal -->
  <b-modal :active="isVisible" :canCancel="['x']" :onCancel="close">
    <div
      id="open-order-card"
      class="card"
      :class="[order.side === 'buy' ? 'green' : 'red']"
    >
      <!-- Loading spinner -->
      <b-loading :active="isLoading" :is-full-page="false"></b-loading>

      <!-- Title -->
      <header class="card-header">
        <p class="card-header-title">{{ $t('openMarketOrder') }}</p>
      </header>

      <!-- Body -->
      <div class="card-content">
        <!-- Order side -->
        <div class="field">
          <div class="control">
            <label for="order-side" class="label is-size-7">
              {{ $t('orderSide') }}
            </label>
            <div class="select">
              <select id="order-side" v-model="order.side">
                <option value="buy">{{ $t('buyOrder') }}</option>
                <option value="sell">{{ $t('sellOrder') }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Amount -->
        <label for="amount" class="label is-small">{{ $t('amount') }}</label>
        <CurrencyField
          v-model="order.amount"
          :id="'amount'"
          :showMaxButton="true"
          :currency="currentMarket.baseCurrency"
          :step="currentMarket.baseCurrency.step"
          :isMaxLoading="isMaxLoading"
          @maxButtonClicked="setMaxAmount"
        />

        <!-- Price -->
        <label for="price" class="label is-small">{{ $t('price') }}</label>
        <CurrencyField
          v-model="order.price"
          :id="'price'"
          :currency="currentMarket.quoteCurrency"
          :step="currentMarket.step"
        />

        <!-- Info message -->
        <p class="is-size-7">{{ infoMessage }}</p>
      </div>

      <!-- Action buttons -->
      <footer class="card-footer">
        <button
          id="cancel-button"
          class="card-footer-item button"
          @click="close"
          :disabled="isLoading"
        >
          {{ $t('cancel') }}
        </button>
        <button
          class="card-footer-item button has-text-link"
          @click="submit"
          :disabled="isLoading"
        >
          {{ $t('openOrder') }}
        </button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

import { capitalize } from '../utils';
import CurrencyField from './CurrencyField';

@Component({
  components: { CurrencyField },
})
class OpenOrderModal extends Vue {
  order = null;
  isLoading = false;
  isMaxLoading = false;

  created() {
    this.init();
  }

  init() {
    this.order = this.getNewOrder();
  }

  get isVisible() {
    return this.$store.state.isOpenOrderModalVisible;
  }

  set isVisible(value) {
    this.$store.commit('setOpenOrderModalVisibility', value);
  }

  get isOrderValid() {
    return (
      this.order.price > 0 &&
      this.order.amount >= this.currentMarket.baseCurrency.step &&
      (this.order.side === 'buy' || this.order.side === 'sell')
    );
  }

  get infoMessage() {
    let amount = this.order.amount * this.order.price;
    const currency = this.currentMarket.quoteCurrency;
    amount = this.formatAmount(amount, currency, currency.decimals);
    if (this.order.side === 'buy') {
      return this.$t('spending', { amount });
    }
    return this.$t('earningLessFee', { amount });
  }

  getNewOrder() {
    return {
      side: 'buy',
      price: null,
      amount: null,
      market: this.currentMarket.code,
      type: 'limit',
    };
  }

  setMaxAmount() {
    this.isMaxLoading = true;
    let currency;
    if (this.order.side === 'sell') {
      currency = this.currentMarket.baseCurrency;
    } else {
      currency = this.currentMarket.quoteCurrency;
    }
    this.apiService.getBalance(currency.code).then((balance) => {
      let amount = Number(balance.available);
      if (this.order.side === 'buy') {
        if (this.order.price > 0) {
          amount /= this.order.price;
        } else {
          amount = 0;
        }
      }
      this.order.amount = amount;
      this.isMaxLoading = false;
    });
  }

  confirmOrder() {
    const { baseCurrency } = this.currentMarket;
    const amount = this.formatAmount(
      this.order.amount,
      baseCurrency,
      baseCurrency.decimals
    );
    const price = this.formatAmount(
      this.order.price,
      this.currentMarket.quoteCurrency,
      this.currentMarket.decimals
    );
    const orderSideCapitalized = capitalize(this.order.side);
    const confirmMsgKey = `confirm${orderSideCapitalized}Order`;
    this.confirm({
      message: this.$t(confirmMsgKey, { amount, price }),
      onConfirm: () => {
        this.doSubmit();
      },
    });
  }

  submit() {
    if (!this.isOrderValid) {
      return;
    }
    this.confirmOrder();
  }

  doSubmit() {
    this.isLoading = true;
    const url = `cryptomkt/orders/${this.currentMarket.code}`;
    this.apiService
      .openOrder(this.order)
      .then(() => {
        this.close();
        this.$buefy.toast.open({
          message: this.$t('orderOpened'),
          type: 'is-info',
        });
        this.order = this.getNewOrder();
        this.isLoading = false;
      })
      .catch(() => {
        this.$buefy.snackbar.open({
          message: this.$t('errorMsg'),
          type: 'is-danger',
          indefinite: true,
        });
        this.isLoading = false;
      });
  }

  close() {
    this.isVisible = false;
    this.init();
  }
}

export default OpenOrderModal;
</script>

<style scoped lang="scss">
#open-order-card {
  border-top: 6px solid;
  border-radius: 4px;
  &.green {
    border-top-color: #4caf50 !important;
  }
  &.red {
    border-top-color: #f44336 !important;
  }
}
.card-footer-item {
  height: 100%;
  border: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
#cancel-button {
  border-bottom-right-radius: 0;
}

@media (prefers-color-scheme: dark) {
  #order-side {
    background-color: #000;
    border-color: #363636;
    color: #eee;
  }
}
</style>
