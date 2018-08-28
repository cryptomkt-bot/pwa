/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import { markets } from './constants';
import StorageHelper from './helpers/StorageHelper';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ask: 0,
    bid: 0,
    currentMarket: StorageHelper.get('currentMarket') || markets.ARS[1],
    activeOrders: [],
    isLogged: false,
  },
  actions: {
    logout(context) {
      StorageHelper.remove('token');
      context.commit('logout');
    },
  },
  mutations: {
    changeMarket(state, market) {
      state.currentMarket = market;
      StorageHelper.set('currentMarket', market);
    },
    updatePrices(state, payload) {
      state.ask = payload.ask;
      state.bid = payload.bid;
    },
    updateActiveOrders(state, orders) {
      state.activeOrders = orders;
    },
    login(state) {
      state.isLogged = true;
    },
    logout(state) {
      state.isLogged = false;
    },
  },
});
