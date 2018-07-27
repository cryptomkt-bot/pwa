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
    toastText: '',
    toastIsError: false,
    isToastVisible: false,
  },
  actions: {
    showToast(context, text) {
      context.commit('showToast', { text });
    },
    showErrorToast(context, text) {
      if (!text) {
        text = 'Lo sentimos, ocurrió un error.';
      }
      context.commit('showToast', { text, isError: true });
    },
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
    showToast(state, { text, isError }) {
      let timeout = 0;
      if (state.isToastVisible) {
        state.isToastVisible = false;
        timeout = 500;
      }
      setTimeout(() => {
        state.toastText = text;
        state.toastIsError = isError;
        state.isToastVisible = true;
      }, timeout);
    },
    hideToast(state) {
      state.isToastVisible = false;
    },
  },
});
