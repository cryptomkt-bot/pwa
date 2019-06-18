import Vue from 'vue';
import Vuex from 'vuex';

import StorageHelper from './helpers/StorageHelper';
import { markets } from './constants';
import { localeTime } from './utils';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentMarket: StorageHelper.get('currentMarket') || markets.ARS[0],
    buyBook: [],
    sellBook: [],
    activeOrders: [],
    updatedAt: null,
    token: null,
    isLoading: true,
    isBalanceModalVisible: false,
    isLanguageModalVisible: false,
    isLoginModalVisible: false,
    isOpenOrderModalVisible: false,
    isUpdating: false,
  },
  getters: {
    ask: state => {
      const { sellBook } = state;
      return sellBook.length ? Number(sellBook[0].price) : 0;
    },
    bid: state => {
      const { buyBook } = state;
      return buyBook.length ? Number(buyBook[0].price) : 0;
    },
    spread: (_, getters) => {
      const { ask, bid } = getters;
      return ask - bid;
    },
    spreadPercentage: (_, getters) => {
      const { spread, ask } = getters;
      const spreadPercentage = (spread / ask) * 100;
      return spreadPercentage.toFixed(2);
    },
    activeOrdersTimestamp: state => {
      return state.activeOrders.map(order => order.created_at);
    },
    isAuthenticated: state => state.token !== null,
  },
  actions: {
    login({ commit, state }, token) {
      state.isLoading = true;
      commit('setToken', token);
    },
    logout({ commit, state }) {
      state.isLoading = true;
      commit('setToken', null);
      commit('setActiveOrders', []);
    },
    changeMarket({ commit, state }, market) {
      state.isLoading = true;
      commit('emptyBooks');
      commit('setActiveOrders', []);
      commit('setCurrentMarket', market);
      StorageHelper.set('currentMarket', market);
    },
  },
  mutations: {
    setActiveOrders(state, orders) {
      state.activeOrders = orders;
    },
    setCurrentMarket(state, market) {
      state.currentMarket = market;
    },
    setBooks(state, payload) {
      const { buyBook, sellBook } = payload;
      state.buyBook = buyBook;
      state.sellBook = sellBook;
      state.updatedAt = localeTime(new Date());
      state.isLoading = false;
    },
    emptyBooks(state) {
      state.buyBook = [];
      state.sellBook = [];
    },
    setBalanceModalVisibility(state, isVisible) {
      state.isBalanceModalVisible = isVisible;
    },
    setLanguageModalVisibility(state, isVisible) {
      state.isLanguageModalVisible = isVisible;
    },
    setLoginModalVisibility(state, isVisible) {
      state.isLoginModalVisible = isVisible;
    },
    setOpenOrderModalVisibility(state, isVisible) {
      state.isOpenOrderModalVisible = isVisible;
    },
    setToken(state, token) {
      state.token = token;
    },
    setIsUpdating(state, isUpdating) {
      state.isUpdating = isUpdating;
    },
  },
});
