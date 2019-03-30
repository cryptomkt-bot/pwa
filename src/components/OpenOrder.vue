<template>
  <!-- Modal -->
  <b-modal :active="isModalVisible" :canCancel="['x']" :onCancel="close">
    <div
      id="open-order-card"
      class="card"
      :class="[order.type === 'buy' ? 'green' : 'red']"
    >
      <!-- Loading spinner -->
      <b-loading :active="isLoading" :is-full-page="false"></b-loading>

      <!-- Title -->
      <header class="card-header">
        <p class="card-header-title">{{ $t('openMarketOrder') }}</p>
      </header>

      <!-- Body -->
      <div class="card-content">
        <!-- Order type -->
        <div class="field">
          <div class="control">
            <label for="order-type" class="label is-size-7">
              {{ $t('orderType') }}
            </label>
            <div class="select">
              <select id="order-type" v-model="order.type">
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
        <a class="card-footer-item" @click="close">{{ $t('cancel') }}</a>
        <a class="card-footer-item" @click="submit">{{ $t('openOrder') }}</a>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

import { capitalize } from '../utils';
import CurrencyField from './CurrencyField.vue';

@Component({
  components: { CurrencyField },
  props: ['isModalVisible'],
  dependencies: ['apiService'],
})
export default class OpenOrder extends Vue {
  order = null;
  isLoading = false;

  created() {
    this.init();
  }

  init() {
    this.order = {
      type: 'buy',
      price: null,
      amount: null,
    };
  }

  get isOrderValid() {
    return (
      this.order.price > 0 &&
      this.order.amount >= this.currentMarket.baseCurrency.step &&
      (this.order.type === 'buy' || this.order.type === 'sell')
    );
  }

  get infoMessage() {
    let amount = this.order.amount * this.order.price;
    const currency = this.currentMarket.quoteCurrency;
    amount = this.formatAmount(amount, currency, currency.decimals);
    if (this.order.type === 'buy') {
      return this.$t('spending', { amount });
    }
    return this.$t('earningLessFee', { amount });
  }

  setMaxAmount() {
    let currency;
    if (this.order.type === 'sell') {
      currency = this.currentMarket.baseCurrency;
    } else {
      currency = this.currentMarket.quoteCurrency;
    }
    this.apiService.getBalance(currency.code).then(balance => {
      let amount = Number(balance.available);
      if (this.order.type === 'buy') {
        if (this.order.price > 0) {
          amount /= this.order.price;
        } else {
          amount = 0;
        }
      }
      this.order.amount = amount;
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
    const orderTypeCapitalized = capitalize(this.order.type);
    const confirmMsgKey = `confirm${orderTypeCapitalized}Order`;
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
    const url = `/orders/${this.currentMarket.code}`;
    this.apiService
      .post(url, this.order)
      .then(() => {
        this.close();
        this.$toast.open({
          message: this.$t('orderOpened'),
          type: 'is-info',
        });
        this.order = {
          type: 'buy',
          price: null,
          amount: null,
        };
        this.isLoading = false;
      })
      .catch(() => {
        this.$snackbar.open({
          message: this.$t('errorMsg'),
          type: 'is-danger',
          indefinite: true,
        });
        this.isLoading = false;
      });
  }

  close() {
    this.$emit('close');
    this.init();
  }
}
</script>

<style lang="scss">
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
</style>
