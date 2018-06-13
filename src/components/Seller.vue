<template>
  <div>
    <div id="seller-modal" class="modal" :class="{'is-active': isModalVisible}">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">Vendedor</p>
          </header>
          <div class="card-content">
            <div class="field">
              <label for="spread" class="label is-small">Cantidad</label>
              <div class="control">
                <input id="spread" class="input" type="number" step="0.0001" v-model.number="seller.remaining_amount">
              </div>
            </div>
            <div class="field">
              <label for="spread" class="label is-small">Spread (%)</label>
              <div class="control">
                <input id="amount" class="input" type="number" step="0.01" v-model.number="seller.min_spread">
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <a class="card-footer-item" @click="hideModal">Cancelar</a>
            <a class="card-footer-item" @click="submit">Actualizar</a>
          </footer>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="hideModal"></button>
    </div>
    <div id="seller-button" class="button is-rounded has-text-weight-bold" @click="showModal">V</div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Seller',
  data () {
    return {
      seller: {
        remaining_amount: null,
        min_spread: null
      },
      isModalVisible: false,
      url: 'http://localhost:5000/seller'
    }
  },
  watch: {
    isModalVisible (newValue) {
      if (newValue === true) {
        axios.get(this.url).then(response => {
          this.seller = response.data
        })
      }
    }
  },
  methods: {
    submit () {
      axios.patch(this.url, this.seller).then(() => {
        this.hideModal()
      })
    },
    showModal () {
      this.isModalVisible = true
    },
    hideModal () {
      this.isModalVisible = false
    }
  }
}
</script>

<style lang="scss">
  $red: #f44336;
  #seller-modal .modal-content {
    border-top: 6px solid $red;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
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
