<template>
  <div>
    <!-- Modal -->
    <div id="buyer-modal" class="modal" :class="{'is-active': isModalVisible}">
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
            <div class="field has-addons">
              <div class="control">
                <span class="button is-static" :disabled="isLoading">{{ currentMarket.baseCurrency.code }}</span>
              </div>
              <div class="control">
                <input id="amount" class="input" type="number" v-model.number="remainingAmount"
                       :step="currentMarket.baseCurrency.step" :placeholder="inputsPlaceholder" :disabled="isLoading">
              </div>
            </div>

            <!-- Fiat -->
            <label for="fiat" class="label is-small">Fiat restante</label>
            <div class="field has-addons">
              <!-- Prefix -->
              <div class="control" v-if="currentMarket.quoteCurrency.prefix">
                <span class="button is-static" :disabled="isLoading">{{ currentMarket.quoteCurrency.prefix }}</span>
              </div>
              <div class="control" v-else>
                <button class="button is-info" @click="setMaxFiat" :disabled="isLoading">Max</button>
              </div>
              <!-- Input -->
              <div class="control">
                <input id="fiat" class="input" type="number" v-model.number="remainingFiat"
                       :placeholder="inputsPlaceholder" :disabled="isLoading">
              </div>
              <!-- Postfix -->
              <div class="control" v-if="currentMarket.quoteCurrency.postfix">
                <span class="button is-static" :disabled="isLoading">{{ currentMarket.quoteCurrency.postfix }}</span>
              </div>
              <div class="control" v-else>
                <button class="button is-info" @click="setMaxFiat" :disabled="isLoading">Max</button>
              </div>
            </div>
            <p class="is-size-7">Precio máximo: ${{ maxPrice }}</p>
          </div>

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
    <div id="buyer-button" class="button is-rounded has-text-weight-bold" @click="showModal">C</div>
  </div>
</template>

<script>
import ApiService from '../services/ApiService'

export default {
  name: 'Buyer',
  data () {
    return {
      api: new ApiService(),
      buyer: null,
      isModalVisible: false,
      updating: false
    }
  },
  computed: {
    currentMarket () {
      return this.$store.state.currentMarket
    },
    endpoint () {
      return `buyer/${this.currentMarket.code}`
    },
    maxPrice () {
      if (this.buyer === null || this.remainingAmount === 0) {
        return 0
      }
      return Math.round(this.remainingFiat / this.remainingAmount)
    },
    isLoading () {
      return this.updating || this.buyer === null
    },
    inputsPlaceholder () {
      return this.buyer === null ? 'Cargando ...' : ''
    },
    remainingAmount: {
      get () {
        return this.buyer ? this.buyer.remaining_amount : null
      },
      set (newValue) {
        this.buyer.remaining_amount = newValue
      }
    },
    remainingFiat: {
      get () {
        return this.buyer ? this.buyer.remaining_fiat : null
      },
      set (newValue) {
        this.buyer.remaining_fiat = newValue
      }
    }
  },
  watch: {
    isModalVisible (newValue) {
      if (newValue === true) {
        this.api.get(this.endpoint).then(response => {
          this.buyer = response.data
        })
      }
    }
  },
  methods: {
    setMaxFiat () {
      const url = `/balance/${this.currentMarket.quoteCurrency.code}`
      this.api.get(url).then(response => {
        this.remainingFiat = Number(response.data.balance)
      })
    },
    submit () {
      if (this.isLoading) {
        return
      }
      this.updating = true
      this.api.patch(this.endpoint, this.buyer).then(() => {
        this.hideModal()
        this.updating = false
      })
    },
    showModal () {
      this.isModalVisible = true
    },
    hideModal () {
      this.buyer = null
      this.isModalVisible = false
    }
  }
}
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
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 1;
  }
</style>
