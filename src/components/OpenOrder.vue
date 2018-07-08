<template>
  <!-- Modal -->
  <div id="open-order-modal" class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content" :class="[order.type === 'buy' ? 'green' : 'red']">
      <div class="card">
        <!-- Title -->
        <header class="card-header">
          <p class="card-header-title">Abrir orden de mercado</p>
        </header>

        <!-- Body -->
        <div class="card-content">
          <!-- Order type -->
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

          <!-- Amount -->
          <label for="amount" class="label is-small">Cantidad</label>
          <div class="field has-addons">
            <div class="control">
              <span class="button is-static">{{ currentMarket.baseCurrency.code }}</span>
            </div>
            <div class="control">
              <input id="amount" class="input" v-model.number="order.amount" type="number" min="0"
                     :step="currentMarket.baseCurrency.step">
            </div>
            <div class="control">
              <button class="button is-info" @click="setMaxAmount">Max</button>
            </div>
          </div>

          <!-- Price -->
          <label for="price" class="label is-size-7">Precio</label>
          <div class="field has-addons">
            <!-- Prefix -->
            <div class="control" v-if="currentMarket.quoteCurrency.prefix">
              <span class="button is-static">{{ currentMarket.quoteCurrency.prefix }}</span>
            </div>
            <!-- Input -->
            <div class="control">
              <input id="price" class="input" v-model.number="order.price" type="number" min="0"
                     :step="currentMarket.step">
            </div>
            <!-- Postfix -->
            <div class="control" v-if="currentMarket.quoteCurrency.postfix">
              <span class="button is-static">{{ currentMarket.quoteCurrency.postfix }}</span>
            </div>
          </div>

          <!-- Info message -->
          <p class="is-size-7">{{ infoMessage }}</p>
        </div>

        <!-- Action buttons -->
        <footer class="card-footer">
          <a class="card-footer-item" @click="hideModal">Cancelar</a>
          <a class="card-footer-item" @click="submit">Abrir orden</a>
        </footer>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="hideModal"></button>
  </div>
  <!--/ End modal -->
</template>

<script>
import ApiService from '../services/ApiService'
import { formatAmount } from '../utils'

export default {
  name: 'OpenOrder',
  data () {
    return {
      api: new ApiService(),
      order: null
    }
  },
  created () {
    this.initialize()
  },
  computed: {
    currentMarket () {
      return this.$store.state.currentMarket
    },
    isOrderValid () {
      if (this.order.type !== 'buy' && this.order.type !== 'sell') {
        return false
      }
      if (this.order.price <= 0) {
        return false
      }
      if (this.order.amount < this.currentMarket.baseCurrency.step) {
        return false
      }
      return true
    },
    infoMessage () {
      let amount = this.order.amount * this.order.price
      amount = this.formatAmount(amount, this.currentMarket.quoteCurrency)
      if (this.order.type === 'buy') {
        return `Gastando ${amount}`
      } else {
        return `Recibirás ${amount} (menos comisión)`
      }
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
      let currency, amount
      if (this.order.type === 'sell') {
        currency = this.currentMarket.baseCurrency
      } else {
        currency = this.currentMarket.quoteCurrency
      }
      const endpoint = `/balance/${currency.code}`
      this.api.get(endpoint).then(response => {
        amount = Number(response.data.available)
        if (this.order.type === 'buy') {
          if (this.order.price > 0) {
            amount = amount / this.order.price
          } else {
            amount = 0
          }
        }
        this.order.amount = amount
      })
    },
    submit () {
      if (!this.isOrderValid || !this.confirmOrder()) {
        return
      }
      this.api.post('/orders', this.order).then(() => {
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
      const amount = this.formatAmount(this.order.amount, this.currentMarket.baseCurrency)
      const price = this.formatAmount(this.order.price, this.currentMarket.quoteCurrency)
      const msg = `¿Desea ${typeVerb} ${amount} a ${price}?`
      return confirm(msg)
    },
    formatAmount
  }
}
</script>

<style>
  #open-order-modal .modal-content {
    border-top: 6px solid;
    border-radius: 4px;
  }
  .green { border-top-color: #4caf50 !important }
  .red { border-top-color: #f44336 !important }
</style>
