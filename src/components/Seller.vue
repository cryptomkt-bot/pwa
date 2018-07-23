<template>
  <div>
    <transition name="fade">
      <!-- Modal -->
      <div v-show="isModalVisible" id="seller-modal" class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
          <div class="card">
            <!-- Title -->
            <header class="card-header">
              <p class="card-header-title">Vendedor</p>
            </header>

            <!-- Body -->
            <div class="card-content">
              <!-- Amount -->
              <label for="amount" class="label is-small">Cantidad</label>
              <CurrencyField :id="'amount'" v-model="remainingAmount" :disabled="isLoading"
                             :currency="currentMarket.baseCurrency" :placeholder="inputsPlaceholder"
                             :showMaxButton="true" @maxButtonClicked="setMaxAmount" />

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
      <div v-show="isButtonVisible" id="seller-button" @click="showModal"
           class="button is-rounded has-text-weight-bold">V</div>
    </transition>
  </div>
</template>

<script>
import CurrencyField from './CurrencyField.vue';

export default {
  name: 'Seller',
  components: { CurrencyField },
  props: ['isButtonVisible'],
  dependencies: ['apiService'],
  data() {
    return {
      seller: null,
      remainingAmount: null,
      isModalVisible: false,
      updating: false,
    };
  },
  computed: {
    currentMarket() {
      return this.$store.state.currentMarket;
    },
    endpoint() {
      return `seller/${this.currentMarket.code}`;
    },
    isLoading() {
      return this.updating || this.seller === null;
    },
    inputsPlaceholder() {
      return this.seller === null ? 'Cargando ...' : '';
    },
    minSpread: {
      get() {
        return this.seller ? this.seller.min_spread : null;
      },
      set(newValue) {
        this.seller.min_spread = newValue;
      },
    },
  },
  watch: {
    isModalVisible(newValue) {
      if (newValue === true) {
        this.seller = null;
        this.remainingAmount = null;
        this.apiService.get(this.endpoint).then((response) => {
          this.seller = response.data;
          this.remainingAmount = this.seller.remaining_amount;
        });
      }
    },
  },
  methods: {
    setMaxAmount() {
      const url = `/balance/${this.currentMarket.baseCurrency.code}`;
      this.apiService.get(url).then((response) => {
        const availableBalance = Number(response.data.available);
        this.remainingAmount = this.seller.remaining_amount + availableBalance;
      });
    },
    submit() {
      if (this.isLoading) {
        return;
      }
      this.updating = true;
      this.seller.remaining_amount = this.remainingAmount;
      this.apiService.patch(this.endpoint, this.seller).then(() => {
        this.hideModal();
        this.updating = false;
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
  $red: #f44336;
  #seller-modal .modal-content {
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
