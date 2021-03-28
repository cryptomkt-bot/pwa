import axios from 'axios';
import injector from 'vue-inject';
import { Toast } from 'buefy';

import i18n from '../locale/i18n';
import store from '../store';
import StorageHelper from '../helpers/StorageHelper';
import {
  startPushNotifications,
  stopPushNotifications,
} from '../push-notification';

const cryptoMktApiVersion = 'v2';
const cryptoMktApiUrl = `https://api.cryptomkt.com/${cryptoMktApiVersion}/`;
class ApiService {
  previousVisibility = 'visible';
  bookInterval = null;

  constructor() {
    this.init();
    this.startBookFetch();
  }

  init() {
    this.apiClient = axios.create();
    this.cryptoMktClient = axios.create({
      baseURL: cryptoMktApiUrl,
    });

    const token = this.token;
    const apiUrl = this.apiUrl;

    if (!apiUrl || !token) {
      return;
    }

    this.apiClient.defaults.baseURL = apiUrl;
    this.token = token;
    store.commit('setToken', token);
    this.subscribe401(this.apiClient);
    this.subscribeToVisibility();
  }

  get username() {
    return StorageHelper.get('username');
  }

  set username(username) {
    StorageHelper.set('username', username);
  }

  get token() {
    return StorageHelper.get('token');
  }

  set token(token) {
    this.apiClient.defaults.headers.Authorization = token;
    StorageHelper.set('token', token);
  }

  get apiUrl() {
    return StorageHelper.get('apiUrl');
  }

  set apiUrl(url) {
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }

    StorageHelper.set('apiUrl', url);
  }

  subscribeToVisibility() {
    document.addEventListener('visibilitychange', () => {
      const { visibilityState } = document;
      if (visibilityState === this.previousVisibility) {
        // Visibility didn't change, abort.
        return;
      }

      if (visibilityState === 'hidden') {
        this.stopBookFetch();
      } else {
        this.startBookFetch();
      }

      this.previousVisibility = visibilityState;
    });
  }

  login(apiUrl, username, password) {
    this.apiUrl = apiUrl;
    this.apiClient.defaults.baseURL = this.apiUrl;

    return this.apiClient
      .post('/auth', { username, password })
      .then((response) => {
        this.stopBookFetch(); // Stop fetching in anonymous mode

        // Set state
        const token = response.data;
        this.token = token;
        this.username = username;
        store.dispatch('login', { token, username }).then(() => {
          this.startBookFetch();
          startPushNotifications();
        });
      });
  }

  logout() {
    this.token = null;

    store.dispatch('logout').then(() => {
      this.restartBookFetch(); // Start fetching again in anonymous mode
      stopPushNotifications();
    });
  }

  subscribe401(client) {
    client.interceptors.response.use(null, (error) => {
      if (error.response?.status === 401 && store.getters.isAuthenticated) {
        this.logout();
        Toast.open({
          message: i18n.t('sessionExpired'),
          type: 'is-info',
          duration: 5000,
        });
      }
      return Promise.reject(error);
    });
  }

  startBookFetch() {
    /** Periodic fetch books **/
    const { isAuthenticated } = store.getters;
    const fetchMethod = isAuthenticated
      ? () => this.fetchBooksAndActive()
      : () => this.fetchBooks();
    fetchMethod();
    this.bookInterval = setInterval(fetchMethod, 5000); // Every 5 seconds
  }

  stopBookFetch() {
    clearInterval(this.bookInterval);
  }

  restartBookFetch() {
    this.stopBookFetch();
    this.startBookFetch();
  }

  addFcmToken(token) {
    return this.apiClient.post('/fcm-tokens', { token });
  }

  removeFcmToken(token) {
    const url = `/fcm-tokens/${token}`;
    return this.apiClient.delete(url);
  }

  fetchBooks() {
    const { currentMarket } = store.state;
    this.getBooks(currentMarket.code).then(({ buy, sell }) => {
      store.commit('setBooks', { buy, sell });
    });
  }

  fetchBooksAndActive() {
    const { currentMarket } = store.state;
    const activeOrdersPromise = this.getActiveOrders();
    const orderBookPromise = this.getBooks(currentMarket.code);
    Promise.all([activeOrdersPromise, orderBookPromise]).then((response) => {
      const activeOrders = response[0];
      store.commit('setActiveOrders', activeOrders);
      const { buy, sell } = response[1];
      store.commit('setBooks', { buy, sell });
    });
  }

  getActiveOrders(limit = 100) {
    const { currentMarket } = store.state;
    const params = { market: currentMarket.code, limit };

    return this.apiClient
      .get('cryptomkt/orders/active', { params })
      .then((response) => response.data.data)
      .catch(() => []);
  }

  getBalance(wallet = null) {
    return this.apiClient.get('cryptomkt/balance').then((response) => {
      let balance = response.data.data;

      if (wallet) {
        balance = balance.find((b) => b.wallet === wallet);
      }

      return balance;
    });
  }

  getBook(market, side, limit = 100) {
    const params = { market, side, limit };

    return this.cryptoMktClient
      .get('/book', { params })
      .then((response) => response.data.data);
  }

  getBooks(market, limit = 100) {
    const sellBookRequest = this.getBook(market, 'sell', limit);
    const buyBookRequest = this.getBook(market, 'buy', limit);

    return Promise.all([buyBookRequest, sellBookRequest]).then(
      ([buy, sell]) => {
        this._addAccumulated(buy);
        this._addAccumulated(sell);
        return new Promise((resolve) => resolve({ buy, sell }));
      }
    );
  }

  getExecutedOrders(market, limit = 100, page = 0) {
    const params = { market, limit, page };

    return this.apiClient
      .get('cryptomkt/orders/executed', { params })
      .then((response) => response.data);
  }

  getBuyer(market) {
    return this.getTrader(market, 'buy');
  }

  getSeller(market) {
    return this.getTrader(market, 'sell');
  }

  getTrader(market, trader) {
    const url = `/${market}/${trader}`;
    return this.apiClient.get(url).then((response) => response.data);
  }

  getTrades(market, limit = 100, page = 0) {
    const params = { market, limit, page };

    return this.cryptoMktClient
      .get('/trades', { params })
      .then((response) => response.data);
  }

  patchBuyer(market, data) {
    return this.patchTrader(market, 'buy', data);
  }

  patchSeller(market, data) {
    return this.patchTrader(market, 'sell', data);
  }

  patchTrader(market, side, data) {
    const url = `/${market}/${side}`;
    return this.apiClient.put(url, data);
  }

  openOrder(order) {
    return this.apiClient.post('cryptomkt/orders/create', order);
  }

  deleteOrder(id) {
    return this.apiClient.post('cryptomkt/orders/cancel', { id });
  }

  _addAccumulated(book) {
    /** Add accumulated amount */
    let accumulated = 0;
    book.forEach((order) => {
      accumulated += Number(order.amount);
      order.accumulated = accumulated;
    });
  }
}

injector.service('apiService', ApiService);
