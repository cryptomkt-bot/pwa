<template>
  <div id="open-order-modal" class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content" :class="[order.type === 'buy' ? 'green' : 'red']">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">Abrir orden de mercado</p>
        </header>
        <div class="card-content">
          <div class="field">
            <div class="control">
              <label for="order-type" class="label is-size-7">Tipo de orden</label>
              <div class="select">
                <select id="order-type" v-model="order.type">
                  <option value="buy">Orden de compra</option>
                  <option value="sell">Orden de venta</option>
                </select>
              </div>
            </div>
          </div>
          <label for="amount" class="label is-small">Cantidad</label>
          <div class="field has-addons">
            <div class="control">
              <input id="amount" class="input" v-model.number="order.amount" type="number" min="0" step="0.0001">
            </div>
            <div class="control">
              <button class="button is-info" @click="setMaxAmount">Max</button>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <label for="price" class="label is-size-7">Precio</label>
              <input id="price" class="input" v-model.number="order.price" type="number" min="0" step="1">
            </div>
          </div>
        </div>
        <footer class="card-footer">
          <a class="card-footer-item" @click="hideModal">Cancelar</a>
          <a class="card-footer-item" @click="submit">Abrir orden</a>
        </footer>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="hideModal"></button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'OpenOrder',
  data () {
    return {
      order: null
    }
  },
  created () {
    this.initialize()
  },
  computed: {
    isOrderValid () {
      if (this.order.type !== 'buy' && this.order.type !== 'sell') {
        return false
      }
      if (this.order.price <= 0) {
        return false
      }
      if (this.order.amount < 0.0001) {
        return false
      }
      return true
    }
  },
  methods: {
    initialize () {
      this.order = {
        type: 'buy',
        price: null,
        amount: null
      }
    },
    setMaxAmount () {
      let amount
      const asset = this.order.type === 'sell' ? 'ETH' : 'ARS'
      const url = `http://localhost:5000/balance/${asset}`
      axios.get(url).then(response => {
        amount = Number(response.data.available)
        if (this.order.type === 'buy' && this.order.price > 0) {
          amount = amount / this.order.price
        }
        this.order.amount = amount
      })
    },
    submit () {
      if (!this.isOrderValid || !this.confirmOrder()) {
        return
      }
      const url = 'http://localhost:5000/orders'
      axios.post(url, this.order).then(() => {
        this.hideModal()
        this.order = {
          type: 'buy',
          price: null,
          amount: null
        }
      })
    },
    hideModal () {
      this.$emit('close')
      this.initialize()
    },
    confirmOrder () {
      const typeVerb = this.order.type === 'buy' ? 'comprar' : 'vender'
      const msg = `¿Desea ${typeVerb} ${this.order.amount} ETH a $${this.order.price}?`
      return confirm(msg)
    }
  }
}
</script>

<style>
  #open-order-modal .modal-content {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-top: 6px solid;
  }
  .green { border-top-color: #4caf50 !important }
  .red { border-top-color: #f44336 !important }
</style>
