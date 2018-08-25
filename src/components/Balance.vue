<template>
  <div id="balance" class="has-text-centered">
    <div class="button is-primary" @click="isBalanceVisible = !isBalanceVisible">
      <span class="icon is-size-7">
        <i class="fa" :class="[isBalanceVisible ? 'fa-chevron-down' : 'fa-chevron-up']"></i>
      </span>
      <span id="balance-label" class="has-text-weight-light">{{ $t('balances') }}</span>
    </div>
    <div id="balance-content" v-show="isBalanceVisible">
      <table class="table is-fullwidth is-size-7">
        <thead>
          <tr>
            <th></th>
            <th>{{ $t('totalBalance') }}</th>
            <th>{{ $t('availableBalance') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="balance in balances" :key="balance.wallet">
            <td>{{ balance.wallet }}</td>
            <td>{{ getFormattedBalanceTotal(balance) }}</td>
            <td>{{ getFormattedBalanceAvailable(balance) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  dependencies: ['apiService'],
})
export default class Balance extends Vue {
  isBalanceVisible = false;
  balances = [];

  created() {
    this.getBalances();
  }

  getFormattedBalanceTotal(balance) {
    return this.getFormattedBalance(balance, balance.balance);
  }

  getFormattedBalanceAvailable(balance) {
    return this.getFormattedBalance(balance, balance.available);
  }

  getFormattedBalance(balance, amount) {
    const currency = {
      prefix: balance.currency_prefix,
      postfix: balance.currency_postfix,
    };

    return this.formatAmount(amount, currency, balance.currency_decimal);
  }

  @Watch('isBalanceVisible')
  onContentVisibilityChanged(isVisible) {
    this.$emit('visibilityChanged', isVisible);
    if (isVisible === true) {
      this.getBalances();
    }
  }

  getBalances() {
    this.apiService.get('/balance').then((response) => {
      this.balances = response.data;
    });
  }
}
</script>

<style lang="scss">
  #balance {
    width: 100%;
    .button {
      position: relative;
      bottom: -4px;
      box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.2);
      width: 100px;
      border-radius: 12px 12px 0 0;
    }
  }
  #balance-label { font-size: 0.8rem }
  #balance-content {
    position: relative;
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.2);
  }
</style>
