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
    historicalBook: [],
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
    ask: (state) => {
      const { sellBook } = state;
      return sellBook.length ? Number(sellBook[0].price) : 0;
    },
    bid: (state) => {
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
    activeOrdersIds: (state) => {
      return state.activeOrders.reduce((order, result) => {
        result[order.id] = true;

        return result;
      }, {});
    },
    isAuthenticated: (state) => state.token,
  },
  actions: {
    login({ commit }, token) {
      commit('setToken', token);
    },
    logout({ commit }) {
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
      const { buy, sell } = payload;
      state.buyBook = buy;
      state.sellBook = sell;
      state.updatedAt = localeTime(new Date());
      state.isLoading = false;
    },
    emptyBooks(state) {
      state.buyBook = [];
      state.sellBook = [];
      state.historicalBook = [];
    },
    setHistoricalBook(state, payload) {
      let { book } = payload;

      // Filter duplicated orders
      const dates = {};
      book = book.filter((order) => {
        if (dates[order.executed_date]) {
          return false;
        }

        dates[order.executed_date] = true;
        return true;
      });

      state.historicalBook = book;
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
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setIsUpdating(state, isUpdating) {
      state.isUpdating = isUpdating;
    },
  },
});
