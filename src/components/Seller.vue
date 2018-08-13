<template>
  <div>
    <!-- Modal -->
    <b-modal :active.sync="isModalVisible" :canCancel="false">
      <div id="seller-card" class="card">
        <!-- Title -->
        <header class="card-header">
          <p class="card-header-title">Vendedor</p>
        </header>

        <!-- Body -->
        <div class="card-content">
          <!-- Amount -->
          <label for="amount" class="label is-small">Cantidad</label>
          <CurrencyField v-model="remainingAmount" :id="'amount'" :disabled="isLoading"
                         :currency="currentMarket.baseCurrency" :placeholder="inputsPlaceholder"
                         :step="currentMarket.baseCurrency.step" :showMaxButton="true"
                         @maxButtonClicked="setMaxAmount" />

          <!-- Spread -->
          <label for="spread" class="label is-small">Spread</label>
          <div class="field has-addons">
            <!-- Input -->
            <div class="control">
              <input id="spread" type="number" step="0.01" v-model.number="minSpread"
                     :placeholder="inputsPlaceholder" :disabled="isLoading" class="input">
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
          <a class="card-footer-item" @click="isModalVisible = false">Cancelar</a>
          <a class="card-footer-item" @click="submit">
            <span v-if="isUpdating" class="icon"><i class="fa fa-spinner fa-pulse"></i></span>
            <span v-else>Actualizar</span>
          </a>
        </footer>
      </div>
    </b-modal>
    <!-- Button -->
    <transition name="scale">
      <div v-show="isButtonVisible" id="seller-button" @click="isModalVisible = true"
           class="button is-rounded has-text-weight-bold">V</div>
    </transition>
  </div>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import CurrencyField from './CurrencyField.vue';

@Component({
  components: { CurrencyField },
  props: ['isButtonVisible'],
  dependencies: ['apiService'],
})
export default class Seller extends Vue {
  seller = null;
  remainingAmount = 0;
  isModalVisible = false;
  isUpdating = false;

  get currentMarket() {
    return this.$store.state.currentMarket;
  }

  get endpoint() {
    return `seller/${this.currentMarket.code}`;
  }

  get isLoading() {
    return this.isUpdating || this.seller === null;
  }

  get inputsPlaceholder() {
    return this.seller === null ? 'Cargando ...' : '';
  }

  get minSpread() {
    return this.seller ? this.seller.min_spread : null;
  }

  set minSpread(spread) {
    this.seller.min_spread = spread;
  }

  @Watch('isModalVisible')
  onModalVisibilityChanged(isVisible) {
    if (!isVisible) {
      return;
    }
    this.seller = null;
    this.remainingAmount = 0;
    this.apiService.get(this.endpoint).then((response) => {
      this.seller = response.data;
      this.remainingAmount = this.seller.remaining_amount;
    });
  }

  setMaxAmount() {
    const url = `/balance/${this.currentMarket.baseCurrency.code}`;
    this.apiService.get(url).then((response) => {
      const availableBalance = Number(response.data.available);
      this.remainingAmount = this.seller.remaining_amount + availableBalance;
    });
  }

  submit() {
    if (this.isLoading) {
      return;
    }
    this.isUpdating = true;
    this.seller.remaining_amount = this.remainingAmount;
    this.apiService.patch(this.endpoint, this.seller)
      .then(() => {
        this.isModalVisible = false;
        this.isUpdating = false;
      })
      .catch(() => {
        this.$snackbar.open({
          message: 'Lo sentimos, ha ocurrido un error.',
          type: 'is-danger',
          indefinite: true,
        });
      });
  }
}
</script>

<style lang="scss">
  $red: #f44336;
  #seller-card {
    border-top: 6px solid $red;
    border-radius: 4px;
  }
  #seller-button {
    background-color: $red;
    color: #fff;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
    border: none;
    width: 48px;
    height: 48px;
    position: fixed;
    bottom: 40px;
    left: 12px;
    z-index: 1;
  }
</style>
