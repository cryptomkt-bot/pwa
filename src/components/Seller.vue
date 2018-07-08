<template>
  <div>
    <!-- Modal -->
    <div id="seller-modal" class="modal" :class="{'is-active': isModalVisible}">
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
            <div class="field has-addons">
              <!-- Currency code -->
              <div class="control">
                <span class="button is-static" :disabled="isLoading">{{ currentMarket.baseCurrency.code }}</span>
              </div>
              <!-- Input -->
              <div class="control">
                <input id="amount" class="input" type="number" v-model.number="remainingAmount"
                       :step="currentMarket.baseCurrency.step" :placeholder="inputsPlaceholder" :disabled="isLoading">
              </div>
              <!-- Max button -->
              <div class="control">
                <button class="button is-info" @click="setMaxAmount" :disabled="isLoading">Max</button>
              </div>
            </div>

            <!-- Spread -->
            <label for="spread" class="label is-small">Spread</label>
            <div class="field has-addons">
              <!-- Input -->
              <div class="control">
                <input id="spread" class="input" type="number" step="0.01" v-model.number="minSpread"
                       :placeholder="inputsPlaceholder" :disabled="isLoading">
              </div>
              <!-- Percent sign -->
              <div class="control">
                <span class="button is-static" :disabled="isLoading">%</span>
              </div>
            </div>
          </div>
          <!--/ End body -->

          <!-- Action buttons -->
          <footer class="card-footer">
            <a class="card-footer-item" @click="hideModal">Cancelar</a>
            <a class="card-footer-item" @click="submit">Actualizar</a>
          </footer>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="hideModal"></button>
    </div>
    <!--/ End modal -->
    <div id="seller-button" class="button is-rounded has-text-weight-bold" @click="showModal">V</div>
  </div>
</template>

<script>
import ApiService from '../services/ApiService'

export default {
  name: 'Seller',
  data () {
    return {
      api: new ApiService(),
      seller: null,
      isModalVisible: false,
      updating: false
    }
  },
  computed: {
    currentMarket () {
      return this.$store.state.currentMarket
    },
    endpoint () {
      return `seller/${this.currentMarket.code}`
    },
    isLoading () {
      return this.updating || this.seller === null
    },
    inputsPlaceholder () {
      return this.seller === null ? 'Cargando ...' : ''
    },
    remainingAmount: {
      get () {
        return this.seller ? this.seller.remaining_amount : null
      },
      set (newValue) {
        this.seller.remaining_amount = newValue
      }
    },
    minSpread: {
      get () {
        return this.seller ? this.seller.min_spread : null
      },
      set (newValue) {
        this.seller.min_spread = newValue
      }
    }
  },
  watch: {
    isModalVisible (newValue) {
      if (newValue === true) {
        this.api.get(this.endpoint).then(response => {
          this.seller = response.data
        })
      }
    }
  },
  methods: {
    setMaxAmount () {
      const url = `/balance/${this.currentMarket.baseCurrency.code}`
      this.api.get(url).then(response => {
        this.remainingAmount = Number(response.data.balance)
      })
    },
    submit () {
      if (this.isLoading) {
        return
      }
      this.updating = true
      this.api.patch(this.endpoint, this.seller).then(() => {
        this.hideModal()
        this.updating = false
      })
    },
    showModal () {
      this.isModalVisible = true
    },
    hideModal () {
      this.seller = null
      this.isModalVisible = false
    }
  }
}
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
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 1;
  }
</style>
