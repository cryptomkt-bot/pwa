import Vue from 'vue';
import Vuex, { mapState } from 'vuex';
import injector from 'vue-inject';
import Buefy from 'buefy';

import App from './App.vue';
import './helpers/StorageHelper';
import store from './store';
import i18n from './locale/i18n';
import filters from './filters';
import { formatAmount } from './utils';

import './registerServiceWorker';
require('./services/ApiService');

Vue.use(injector);
Vue.use(Buefy);
Vue.use(Vuex);

Object.entries(filters).forEach(([key, filter]) => {
  Vue.filter(key, filter);
});

Vue.mixin({
  dependencies: ['apiService'],
  computed: mapState(['currentMarket']),
  methods: {
    formatAmount(amount, currency, decimals) {
      return formatAmount(amount, currency, decimals);
    },
    confirm(config) {
      this.$buefy.dialog.confirm({
        ...config,
        confirmText: this.$i18n.t('yes'),
        cancelText: this.$i18n.t('no'),
      });
    },
  },
});

Vue.config.productionTip = false;

new Vue({
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
