import axios from 'axios';
import injector from 'vue-inject';
import { Toast } from 'buefy';

import i18n from '../locale/i18n';
import store from '../store';
import StorageHelper from '../helpers/StorageHelper';

class ApiService {
  constructor() {
    this.init();
  }

  init() {
    this.axios = axios.create({ headers: {} });
    const apiUrl = StorageHelper.get('apiUrl');
    const token = StorageHelper.get('token');
    if (!apiUrl || !token) {
      return;
    }
    this.baseUrl = apiUrl;
    this.token = token;
    this.subscribe401();
    this.subscribe401();
    store.commit('setToken', token);
  }

  set baseUrl(url) {
    this.axios.defaults.baseURL = `https://${url}`;
  }

  set token(token) {
    this.axios.defaults.headers.Authorization = `JWT ${token}`;
  }

  login(apiUrl, username, password) {
    this.baseUrl = apiUrl;
    return this.post('/auth', { username, password }).then(response => {
      // Set token
      const token = response.data.access_token;
      this.token = token;

      // Save to storage
      StorageHelper.set('apiUrl', apiUrl);
      StorageHelper.set('username', username);
      StorageHelper.set('token', token);
      store.commit('setToken', token);

      this.subscribe401();
    });
  }

  logout() {
    StorageHelper.remove('token');
    store.commit('logout');
  }

  subscribe401() {
    this.axios.interceptors.response.use(null, error => {
      if (error.response.status === 401 && store.getters.isLogged) {
        this.logout();
        Toast.open({
          message: i18n.t('sessionExpired'),
          type: 'is-info',
          duration: 5000,
        });
        this.unsubscribe401();
      }
      return Promise.reject(error);
    });
  }

  unsubscribe401() {
    this.axios.interceptors.response(null, null);
  }

  getActiveOrders() {
    const { currentMarket } = store.state;
    const url = `/orders/active/${currentMarket.code}`;
    return this.get(url)
      .then(response => {
        store.commit('setActiveOrders', response.data);
      })
      .catch(() => {
        store.commit('setActiveOrders', []);
      });
  }

  getExecutedOrders(limit = 50) {
    const { currentMarket } = store.state;
    const url = `/orders/executed/${currentMarket.code}`;
    return this.get(url, { limit }).then(response => response.data);
  }

  getBalance(marketCode = null) {
    let url = '/balance';
    if (marketCode !== null) {
      url += `/${marketCode}`;
    }
    return this.get(url).then(response => response.data);
  }

  getBuyer() {
    return this.getTrader('buyer');
  }

  getSeller() {
    return this.getTrader('seller');
  }

  getTrader(trader) {
    const url = `/${trader}/${store.state.currentMarket.code}`;
    return this.get(url).then(response => response.data);
  }

  patchBuyer(data) {
    return this.patchTrader('buyer', data);
  }

  patchSeller(data) {
    return this.patchTrader('seller', data);
  }

  patchTrader(trader, data) {
    const url = `/${trader}/${store.state.currentMarket.code}`;
    return this.patch(url, data).then(response => response.data);
  }

  deleteOrder(orderId) {
    const url = `/orders/${orderId}`;
    return this.delete(url);
  }

  get(url, params = null) {
    return this.axios.get(url, { params });
  }

  post(url, data) {
    return this.axios.post(url, data);
  }

  put(url, data) {
    return this.axios.put(url, data);
  }

  patch(url, data) {
    return this.axios.patch(url, data);
  }

  delete(url) {
    return this.axios.delete(url);
  }
}

injector.service('apiService', ApiService);
