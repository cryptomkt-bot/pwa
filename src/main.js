import injector from 'vue-inject';
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import './helpers/StorageHelper';
import store from './store';
import filters from './filters';
import { formatAmount } from './utils';

Vue.use(Vuex);
Vue.use(injector);

Object.entries(filters).forEach(([key, filter]) => {
  Vue.filter(key, filter);
});

Vue.mixin({
  methods: {
    formatAmount(amount, currency, decimals) {
      return formatAmount(amount, currency, decimals);
    },
  },
});

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
