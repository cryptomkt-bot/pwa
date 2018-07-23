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
          <CurrencyField :id="'amount'" :currency="currentMarket.baseCurrency" v-model="order.amount"
                         :showMaxButton="true" @maxButtonClicked="setMaxAmount" />

          <!-- Price -->
          <label for="price" class="label is-small">Precio</label>
          <CurrencyField :id="'price'" :currency="currentMarket.quoteCurrency" v-model="order.price" />

          <!-- Info message -->
          <p class="is-size-7">{{ infoMessage }}</p>
        </div>

        <!-- Action buttons -->
        <footer class="card-footer">
          <a class="card-footer-item" @click="hideModal">Cancelar</a>
          <a class="card-footer-item" @click="submit">
            <span v-if="isLoading" class="icon"><i class="fa fa-spinner fa-pulse"></i></span>
            <span v-else>Abrir orden</span>
          </a>
        </footer>
      </div>
    </div>
  </div>
  <!--/ End modal -->
</template>

<script>
import CurrencyField from './CurrencyField.vue';
import { formatAmount } from '../utils';

export default {
  name: 'OpenOrder',
  components: { CurrencyField },
  dependencies: ['apiService'],
  data() {
    return {
      order: null,
      isLoading: false,
    };
  },
  created() {
    this.init();
  },
  computed: {
    currentMarket() {
      return this.$store.state.currentMarket;
    },
    isOrderValid() {
      return (
        (this.order.price > 0) &&
        (this.order.amount >= this.currentMarket.baseCurrency.step) &&
        (this.order.type === 'buy' || this.order.type === 'sell')
      );
    },
    infoMessage() {
      let amount = this.order.amount * this.order.price;
      const currency = this.currentMarket.quoteCurrency;
      amount = this.formatAmount(amount, currency, currency.decimals);
      if (this.order.type === 'buy') {
        return `Gastando ${amount}`;
      }
      return `Recibirás ${amount} (menos comisión)`;
    },
  },
  methods: {
    formatAmount,
    init() {
      this.order = {
        type: 'buy',
        price: null,
        amount: null,
      };
    },
    setMaxAmount() {
      let currency;
      if (this.order.type === 'sell') {
        currency = this.currentMarket.baseCurrency;
      } else {
        currency = this.currentMarket.quoteCurrency;
      }
      const endpoint = `/balance/${currency.code}`;
      this.apiService.get(endpoint).then((response) => {
        let amount = Number(response.data.available);
        if (this.order.type === 'buy') {
          if (this.order.price > 0) {
            amount /= this.order.price;
          } else {
            amount = 0;
          }
        }
        this.order.amount = amount;
      });
    },
    confirmOrder() {
      const { baseCurrency } = this.currentMarket;
      const amount = this.formatAmount(this.order.amount, baseCurrency, baseCurrency.decimals);
      const price = this.formatAmount(
        this.order.price,
        this.currentMarket.quoteCurrency,
        this.currentMarket.decimals
      );
      const typeVerb = this.order.type === 'buy' ? 'comprar' : 'vender';
      const text = `¿Desea ${typeVerb} ${amount} a ${price}?`;
      const callback = this.doSubmit;
      this.$store.commit('showDialog', { text, callback });
    },
    submit() {
      if (!this.isOrderValid) {
        return;
      }
      this.confirmOrder();
    },
    doSubmit() {
      this.isLoading = true;
      const url = `/orders/${this.currentMarket.code}`;
      this.apiService.post(url, this.order).then(() => {
        this.isLoading = false;
        this.hideModal();
        this.order = {
          type: 'buy',
          price: null,
          amount: null,
        };
      });
    },
    hideModal() {
      this.$emit('close');
      this.init();
    },
  },
};
</script>

<style>
  #open-order-modal .modal-content {
    border-top: 6px solid;
    border-radius: 4px;
  }
  .green { border-top-color: #4caf50 !important }
  .red { border-top-color: #f44336 !important }
</style>
