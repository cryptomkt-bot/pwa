<template>
  <!-- Modal -->
  <b-modal :active.sync="isVisible">
    <div class="card">
      <!-- Title -->
      <header class="card-header">
        <p class="card-header-title">{{ $t('balances') }}</p>
      </header>

      <!-- Body -->
      <div class="card-content position-relative">
        <!-- Loading spinner -->
        <b-loading :active="isLoading" :is-full-page="false"></b-loading>

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
  </b-modal>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component()
class BalanceModal extends Vue {
  balances = [];
  isLoading = false;

  created() {
    this.getBalances();
  }

  get isVisible() {
    return this.$store.state.isBalanceModalVisible;
  }

  set isVisible(value) {
    this.$store.commit('setBalanceModalVisibility', value);
  }

  getBalances() {
    this.isLoading = true;
    this.apiService.getBalance().then(balances => {
      this.balances = balances;
      this.isLoading = false;
    });
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

  @Watch('isVisible')
  onVisibilityChanged(isVisible) {
    if (isVisible === true) {
      this.getBalances();
    }
  }
}

export default BalanceModal;
</script>

<style scoped lang="scss">
.card {
  border-radius: 4px;
}
.card-content {
  padding: 0;
  padding-bottom: 4px;
}
</style>
