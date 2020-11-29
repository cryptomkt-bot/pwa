<template>
  <div>
    <!-- Modal -->
    <b-modal :active.sync="isModalVisible" :canCancel="['x']">
      <div id="seller-card" class="card">
        <!-- Title -->
        <header class="card-header">
          <p class="card-header-title">{{ $t('seller') }}</p>
        </header>

        <!-- Body -->
        <div class="card-content position-relative">
          <!-- Loading spinner -->
          <b-loading :active="isLoading" :is-full-page="false"></b-loading>

          <!-- Amount -->
          <label for="amount" class="label is-small">{{ $t('amount') }}</label>
          <CurrencyField
            v-model="remainingAmount"
            :id="'amount'"
            :currency="currentMarket.baseCurrency"
            :showMaxButton="true"
            :step="currentMarket.baseCurrency.step"
            :isMaxLoading="isMaxLoading"
            @maxButtonClicked="setMaxAmount"
          />

          <!-- Spread -->
          <label for="spread" class="label is-small">{{ $t('spread') }}</label>
          <div class="field has-addons">
            <!-- Input -->
            <div id="spread-control" class="control">
              <input
                id="spread"
                type="number"
                step="0.01"
                v-model.number="minSpread"
                :disabled="isLoading"
                lang="en"
                class="input"
              />
            </div>
            <!-- Percent sign -->
            <div class="control">
              <span :disabled="isLoading" class="button is-static">%</span>
            </div>
          </div>
        </div>
        <!--/ End body -->

        <!-- Action buttons -->
        <footer class="card-footer">
          <button
            id="cancel-button"
            class="card-footer-item button"
            @click="isModalVisible = false"
            :disabled="isLoading"
          >
            {{ $t('cancel') }}
          </button>
          <button
            class="card-footer-item button has-text-link"
            @click="submit"
            :disabled="isLoading"
          >
            {{ $t('update') }}
          </button>
        </footer>
      </div>
    </b-modal>
    <!-- Button -->
    <transition name="scale">
      <div
        v-show="isButtonVisible"
        id="seller-button"
        @click="isModalVisible = true"
        class="button is-rounded has-text-weight-bold z-depth-2"
      >
        {{ $t('seller')[0] }}
      </div>
    </transition>
  </div>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';

import CurrencyField from './CurrencyField';

@Component({
  components: { CurrencyField },
  props: ['isButtonVisible'],
})
class Seller extends Vue {
  seller = null;
  remainingAmount = 0;
  isModalVisible = false;
  isLoading = true;
  isMaxLoading = false;

  get minSpread() {
    return this.seller ? Number(this.seller.spread) : null;
  }

  set minSpread(spread) {
    this.seller.spread = spread.toString();
  }

  @Watch('isModalVisible')
  onModalVisibilityChanged(isVisible) {
    if (!isVisible) {
      return;
    }
    this.isLoading = true;
    this.seller = null;
    this.remainingAmount = 0;
    this.apiService
      .getSeller(this.currentMarket.code)
      .then((seller) => {
        this.seller = seller;
        this.remainingAmount = Number(this.seller.amount);
        this.isLoading = false;
      })
      .catch(() => {
        this.isLoading = false;
      });
  }

  setMaxAmount() {
    this.isMaxLoading = true;
    const marketCode = this.currentMarket.baseCurrency.code;
    this.apiService.getBalance(marketCode).then((balance) => {
      const grossBalance = Number(balance.balance);
      const netBalance = Number(balance.available);
      const remainingAmount = Number(this.seller.amount) + netBalance;
      // Make sure the amount isn't higher than the gross balance
      this.remainingAmount = Math.min(remainingAmount, grossBalance);
      this.isMaxLoading = false;
    });
  }

  submit() {
    this.isLoading = true;
    this.seller.amount = this.remainingAmount.toString();
    this.apiService
      .patchSeller(this.currentMarket.code, this.seller)
      .then(() => {
        this.isModalVisible = false;
        this.isLoading = false;
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
}

export default Seller;
</script>

<style scoped lang="scss">
$red: #f44336;

#seller-card {
  border-top: 6px solid $red;
  border-radius: 4px;
}
#spread-control {
  width: 100px;
}
#seller-button {
  background-color: $red;
  color: #fff;
  border: none;
  width: 48px;
  height: 48px;
  position: fixed;
  bottom: 3%;
  left: 4%;
  z-index: 30;
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
  .control .button {
    background-color: #000;
    color: #eee;
  }
}
</style>
