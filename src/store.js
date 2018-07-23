/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import { markets } from './constants';
import StorageHelper from './helpers/StorageHelper';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentMarket: StorageHelper.get('currentMarket') || markets.ARS[1],
    isDialogVisible: false,
    dialogText: '',
    dialogCallback: null,
  },
  mutations: {
    changeMarket(state, market) {
      state.currentMarket = market;
      StorageHelper.set('currentMarket', market);
    },
    showDialog(state, payload) {
      state.dialogText = payload.text;
      state.dialogCallback = payload.callback;
      state.isDialogVisible = true;
    },
    hideDialog(state) {
      state.isDialogVisible = false;
    },
  },
});
