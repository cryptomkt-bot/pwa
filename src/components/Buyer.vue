<template>
  <div>
    <!-- Modal -->
    <b-modal :active.sync="isModalVisible" :canCancel="false">
      <div id="buyer-card" class="card">
        <!-- Title -->
        <header class="card-header">
          <p class="card-header-title">Comprador</p>
        </header>

        <!-- Body -->
        <div class="card-content">
          <!-- Amount -->
          <label for="amount" class="label is-small">Cantidad</label>
          <CurrencyField v-model="remainingAmount" :id="'amount'" :disabled="isLoading"
                         :currency="currentMarket.baseCurrency" :placeholder="inputsPlaceholder"
                         :step="currentMarket.baseCurrency.step" />

          <!-- Fiat -->
          <label for="fiat" class="label is-small">Fiat restante</label>
          <CurrencyField v-model="remainingFiat" :id="'amount'" :showMaxButton="true"
                         :currency="currentMarket.quoteCurrency"
                         :disabled="isLoading" :placeholder="inputsPlaceholder"
                         @maxButtonClicked="setMaxFiat" />

          <!-- Info -->
          <p class="is-size-7">Precio máximo: {{ maxPrice }}</p>
        </div>

        <!-- Action buttons -->
        <footer class="card-footer">
          <a class="card-footer-item" @click="isModalVisible = false">Cancelar</a>
          <a class="card-footer-item" @click="submit">
            <span v-if="updating" class="icon"><i class="fa fa-spinner fa-pulse"></i></span>
            <span v-else>Actualizar</span>
          </a>
        </footer>
      </div>
    </b-modal>
    <!-- Button -->
    <transition name="scale">
      <div v-show="isButtonVisible" id="buyer-button" @click="isModalVisible = true"
           class="button is-rounded has-text-weight-bold">C</div>
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
export default class Buyer extends Vue {
  buyer = null;
  remainingFiat = null;
  isModalVisible = false;
  updating = false;

  get currentMarket() {
    return this.$store.state.currentMarket;
  }

  get endpoint() {
    return `buyer/${this.currentMarket.code}`;
  }

  get maxPrice() {
    if (this.buyer === null || this.remainingAmount === 0) {
      return 0;
    }
    const amount = this.remainingFiat / this.remainingAmount;
    return this.formatAmount(
      amount,
      this.currentMarket.quoteCurrency,
      this.currentMarket.decimals,
    );
  }

  get isLoading() {
    return this.updating || this.buyer === null;
  }

  get inputsPlaceholder() {
    return this.buyer === null ? 'Cargando ...' : '';
  }

  get remainingAmount() {
    return this.buyer ? this.buyer.remaining_amount : null;
  }

  set remainingAmount(value) {
    this.buyer.remaining_amount = value;
  }

  @Watch('isModalVisible')
  onModalVisibilityChanged(isVisible) {
    if (!isVisible) {
      return;
    }
    this.buyer = null;
    this.remainingFiat = null;
    this.apiService.get(this.endpoint).then((response) => {
      this.buyer = response.data;
      this.remainingFiat = this.buyer.remaining_fiat;
    });
  }

  setMaxFiat() {
    const url = `/balance/${this.currentMarket.quoteCurrency.code}`;
    this.apiService.get(url).then((response) => {
      const availableBalance = Number(response.data.available);
      this.remainingFiat = this.buyer.remaining_fiat + availableBalance;
    });
  }

  submit() {
    if (this.isLoading) {
      return;
    }
    this.updating = true;
    this.buyer.remaining_fiat = this.remainingFiat;
    this.apiService.patch(this.endpoint, this.buyer)
      .then(() => {
        this.isModalVisible = false;
        this.updating = false;
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
  $green: #4caf50;
  #buyer-card {
    border-top: 6px solid $green;
    border-radius: 4px;
  }
  #buyer-button {
    background-color: $green;
    color: #fff;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
    border: none;
    width: 48px;
    height: 48px;
    position: fixed;
    bottom: 40px;
    right: 12px;
    z-index: 1;
  }
</style>
