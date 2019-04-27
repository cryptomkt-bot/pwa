import Vue from 'vue';
import VueI18n from 'vue-i18n';
import StorageHelper from '../helpers/StorageHelper';
import en from './messages/en';
import es from './messages/es';

Vue.use(VueI18n);

export default new VueI18n({
  locale: StorageHelper.get('lang') || 'es',
  messages: { en, es },
});
