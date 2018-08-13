<template>
  <div>
    <transition name="fade">
      <!-- Modal -->
      <div v-show="isModalVisible" id="buyer-modal" class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
          <div class="card">
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
              <a class="card-footer-item" @click="hideModal">Cancelar</a>
              <a class="card-footer-item" @click="submit">
                <span v-if="updating" class="icon"><i class="fa fa-spinner fa-pulse"></i></span>
                <span v-else>Actualizar</span>
              </a>
            </footer>
          </div>
        </div>
      </div>
      <!--/ End modal -->
    </transition>
    <transition name="scale">
      <div v-show="isButtonVisible" id="buyer-button" @click="showModal"
           class="button is-rounded has-text-weight-bold">C</div>
    </transition>
  </div>
</template>

<script>
import CurrencyField from './CurrencyField.vue';

export default {
  name: 'Buyer',
  components: { CurrencyField },
  props: ['isButtonVisible'],
  dependencies: ['apiService'],
  data() {
    return {
      buyer: null,
      remainingFiat: null,
      isModalVisible: false,
      updating: false,
    };
  },
  computed: {
    currentMarket() {
      return this.$store.state.currentMarket;
    },
    endpoint() {
      return `buyer/${this.currentMarket.code}`;
    },
    maxPrice() {
      if (this.buyer === null || this.remainingAmount === 0) {
        return 0;
      }
      const amount = this.remainingFiat / this.remainingAmount;
      return this.formatAmount(
        amount,
        this.currentMarket.quoteCurrency,
        this.currentMarket.decimals,
      );
    },
    isLoading() {
      return this.updating || this.buyer === null;
    },
    inputsPlaceholder() {
      return this.buyer === null ? 'Cargando ...' : '';
    },
    remainingAmount: {
      get() {
        return this.buyer ? this.buyer.remaining_amount : null;
      },
      set(newValue) {
        this.buyer.remaining_amount = newValue;
      },
    },
  },
  watch: {
    isModalVisible(newValue) {
      if (newValue === true) {
        this.buyer = null;
        this.remainingFiat = null;
        this.apiService.get(this.endpoint).then((response) => {
          this.buyer = response.data;
          this.remainingFiat = this.buyer.remaining_fiat;
        });
      }
    },
  },
  methods: {
    setMaxFiat() {
      const url = `/balance/${this.currentMarket.quoteCurrency.code}`;
      this.apiService.get(url).then((response) => {
        const availableBalance = Number(response.data.available);
        this.remainingFiat = this.buyer.remaining_fiat + availableBalance;
      });
    },
    submit() {
      if (this.isLoading) {
        return;
      }
      this.updating = true;
      this.buyer.remaining_fiat = this.remainingFiat;
      this.apiService.patch(this.endpoint, this.buyer)
        .then(() => {
          this.hideModal();
          this.updating = false;
        })
        .catch(() => {
          this.$store.dispatch('showErrorToast');
        });
    },
    showModal() {
      this.isModalVisible = true;
    },
    hideModal() {
      this.isModalVisible = false;
    },
  },
};
</script>

<style lang="scss">
  $green: #4caf50;
  #buyer-modal .modal-content {
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
