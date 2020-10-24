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
    this.apiClient.defaults.headers.Authorization = token;
    this.subscribe401(this.apiClient);
    store.commit('setToken', token);
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
    this.setOrRemoveStorage('token', token);
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

  login(apiUrl, username, password) {
    this.apiUrl = apiUrl;

    return this.apiClient
      .post('/auth', { username, password })
      .then((response) => {
        this.stopBookFetch(); // Stop fetching in anonymous mode

        // Set state
        this.token = response.data;
        this.username = username;
        this.apiClient.defaults.baseURL = apiUrl;
        this.apiClient.defaults.headers.Authorization = token;
        store.dispatch('login', this.token).then(() => {
          this.startBookFetch(); // Start fetching in authenticated mode
          startPushNotifications();
        });
      });
  }

  logout() {
    this.token = undefined;

    store.dispatch('logout').then(() => {
      this.restartBookFetch(); // Start fetching again in anonymous mode
      stopPushNotifications();
    });
  }

  subscribe401(client) {
    client.interceptors.response.use(null, (error) => {
      if (error.response.status === 401 && store.getters.isAuthenticated) {
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
    this.getBooks(currentMarket.code).then(({ buyBook, sellBook }) => {
      store.commit('setBooks', { buyBook, sellBook });
    });
  }

  fetchBooksAndActive() {
    const { currentMarket } = store.state;
    const activeOrdersPromise = this.getActiveOrders();
    const orderBookPromise = this.getBooks(currentMarket.code);
    Promise.all([activeOrdersPromise, orderBookPromise]).then((response) => {
      const activeOrders = response[0];
      store.commit('setActiveOrders', activeOrders);
      const { buyBook, sellBook } = response[1];
      store.commit('setBooks', { buyBook, sellBook });
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

  getBooks(market, limit = 50) {
    const sellBookRequest = this.getBook(market, 'sell', limit);
    const buyBookRequest = this.getBook(market, 'buy', limit);

    return Promise.all([buyBookRequest, sellBookRequest]).then(
      ([buyBook, sellBook]) => {
        this._enrichOrders(buyBook, true, false);
        this._enrichOrders(sellBook, false, true);
        return new Promise((resolve) => resolve({ buyBook, sellBook }));
      }
    );
  }

  getExecutedOrders(limit = 50) {
    const { currentMarket } = store.state;
    const params = { market: currentMarket.code, limit };

    return this.apiClient
      .get('cryptomkt/orders/executed', { params })
      .then((response) => response.data.data);
  }

  getBuyer() {
    return this.getTrader('buy');
  }

  getSeller() {
    return this.getTrader('sell');
  }

  getTrader(trader) {
    const url = `/${store.state.currentMarket.code}/${trader}`;
    return this.apiClient.get(url).then((response) => response.data);
  }

  getTrades(market, limit = 50) {
    const params = { market, limit };

    return this.cryptoMktClient
      .get('/trades', { params })
      .then((response) => response.data.data);
  }

  patchBuyer(data) {
    return this.patchTrader('buy', data);
  }

  patchSeller(data) {
    return this.patchTrader('sell', data);
  }

  patchTrader(side, data) {
    const url = `/${store.state.currentMarket.code}/${side}`;
    return this.apiClient.put(url, data);
  }

  openOrder(order) {
    return this.apiClient.post('cryptomkt/orders/create', order);
  }

  deleteOrder(id) {
    return this.apiClient.post('cryptomkt/orders/cancel', { id });
  }

  setOrRemoveStorage(key, value) {
    if (value) {
      StorageHelper.set(key, value);
    } else {
      StorageHelper.remove(key);
    }
  }

  _enrichOrders(book, isBuy, isSell) {
    /** Add order type and accumulated amount */
    let accumulated = 0;
    return book.forEach((order) => {
      accumulated += Number(order.amount);
      order.accumulated = accumulated;
      order.isBuy = isBuy;
      order.isSell = isSell;
    });
  }
}

injector.service('apiService', ApiService);
