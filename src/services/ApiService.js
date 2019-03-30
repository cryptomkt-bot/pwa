import axios from 'axios';
import injector from 'vue-inject';
import { Toast } from 'buefy';

import i18n from '../locale/i18n';
import store from '../store';
import StorageHelper from '../helpers/StorageHelper';

class ApiService {
  cryptoMktApiUrl = 'https://api.cryptomkt.com/v1';

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

  startBookFetch() {
    /** Periodic fetch books **/
    this.fetchBooksAndActive();
    this.bookInterval = setInterval(() => {
      this.fetchBooksAndActive();
    }, 5000); // Every 5 seconds
  }

  stopBookFetch() {
    clearInterval(this.bookInterval);
  }

  fetchBooksAndActive() {
    const { currentMarket } = store.state;
    const activeOrdersPromise = this.getActiveOrders();
    const orderBookPromise = this.getBooks(currentMarket.code);
    Promise.all([activeOrdersPromise, orderBookPromise]).then(response => {
      const activeOrders = response[0];
      store.commit('setActiveOrders', activeOrders);
      const { buyBook, sellBook } = response[1];
      store.commit('setBooks', { buyBook, sellBook });
    });
  }

  getActiveOrders() {
    const { currentMarket } = store.state;
    const url = `/orders/active/${currentMarket.code}`;
    return this.get(url)
      .then(response => response.data)
      .catch(() => []);
  }

  getBalance(marketCode = null) {
    let url = '/balance';
    if (marketCode !== null) {
      url += `/${marketCode}`;
    }
    return this.get(url).then(response => response.data);
  }

  getBook(market, type, limit = 100) {
    const url = `${this.cryptoMktApiUrl}/book`;
    return axios.get(url, {
      params: { market, type, limit },
    });
  }

  getBooks(market, limit = 50) {
    const sellBookRequest = this.getBook(market, 'sell', limit);
    const buyBookRequest = this.getBook(market, 'buy', limit);
    return axios.all([buyBookRequest, sellBookRequest]).then(
      axios.spread((buyBookResponse, sellBookResponse) => {
        const buyBook = buyBookResponse.data.data;
        const sellBook = sellBookResponse.data.data;
        this._enrichOrders(buyBook, true, false);
        this._enrichOrders(sellBook, false, true);
        return new Promise(resolve => resolve({ buyBook, sellBook }));
      })
    );
  }

  _enrichOrders(book, isBuy, isSell) {
    /** Add order type and accumulated amount */
    let accumulated = 0;
    return book.forEach(order => {
      accumulated += Number(order.amount);
      order.accumulated = accumulated;
      order.isBuy = isBuy;
      order.isSell = isSell;
    });
  }

  getExecutedOrders(limit = 50) {
    const { currentMarket } = store.state;
    const url = `/orders/executed/${currentMarket.code}`;
    return this.get(url, { limit }).then(response => response.data);
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

  getTrades(market, limit = 50) {
    const url = `${this.cryptoMktApiUrl}/trades`;
    const params = { market, limit };
    return axios
      .get(url, { params })
      .then(response => new Promise(resolve => resolve(response.data.data)));
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
