import injector from 'vue-inject';
import Vue from 'vue';
import Buefy from 'buefy';
import Vuex from 'vuex';
import App from './App.vue';
import './helpers/StorageHelper';
import store from './store';
import i18n from './locale/i18n';
import filters from './filters';
import { formatAmount } from './utils';

Vue.use(Buefy);
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
    confirm(config) {
      this.$dialog.confirm({
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
