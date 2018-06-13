<template>
  <div>
    <div id="buyer-modal" class="modal" :class="{'is-active': isModalVisible}">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">Comprador</p>
          </header>
          <div class="card-content">
            <div class="field">
              <label for="spread" class="label is-small">Cantidad</label>
              <div class="control">
                <input id="spread" class="input" type="number" step="0.0001" v-model.number="buyer.remaining_amount">
              </div>
            </div>
            <div class="field">
              <label for="spread" class="label is-small">Fiat restante</label>
              <div class="control">
                <input id="amount" class="input" type="number" v-model.number="buyer.remaining_fiat">
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
    <div id="buyer-button" class="button is-rounded has-text-weight-bold" @click="showModal">C</div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Buyer',
  data () {
    return {
      buyer: {
        remaining_amount: null,
        remaining_fiat: null
      },
      isModalVisible: false,
      url: 'http://localhost:5000/buyer'
    }
  },
  watch: {
    isModalVisible (newValue) {
      if (newValue === true) {
        axios.get(this.url).then(response => {
          this.buyer = response.data
        })
      }
    }
  },
  methods: {
    submit () {
      axios.patch(this.url, this.buyer).then(() => {
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
  $green: #4caf50;
  #buyer-modal .modal-content {
    border-top: 6px solid $green;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
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
