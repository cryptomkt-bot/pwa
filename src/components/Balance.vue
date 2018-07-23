<template>
  <div id="balance" class="has-text-centered">
    <div class="button is-primary" @click="isContentVisible = !isContentVisible">
      <span class="icon is-size-7">
        <i class="fa" :class="[isContentVisible ? 'fa-chevron-down' : 'fa-chevron-up']"></i>
      </span>
      <span id="balance-label" class="has-text-weight-light">Balances</span>
    </div>
    <div id="balance-content" v-show="isContentVisible">
      <table class="table is-fullwidth is-size-7">
        <thead>
          <tr>
            <th></th>
            <th>Saldo contable</th>
            <th>Saldo disponible</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="balance in balances" :key="balance.wallet">
            <td>{{ balance.wallet }}</td>
            <td>
              {{ balance.currency_prefix }}{{ balance.balance | toDecimals(balance.currency_decimal) }}
              {{ balance.currency_postfix }}
            </td>
            <td>
              {{ balance.currency_prefix }}{{ balance.available | toDecimals(balance.currency_decimal) }}
              {{ balance.currency_postfix }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Balance',
  dependencies: ['apiService'],
  data() {
    return {
      isContentVisible: false,
      balances: [],
    };
  },
  created() {
    this.getBalances();
  },
  watch: {
    isContentVisible(newValue) {
      this.$emit('visibilityChanged', newValue);
      if (newValue === true) {
        this.getBalances();
      }
    },
  },
  methods: {
    getBalances() {
      this.apiService.get('/balance').then((response) => {
        this.balances = response.data;
      });
    },
  },
};
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
