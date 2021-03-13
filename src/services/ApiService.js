import { Client } from 'cryptomarket';
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

class ApiService {
  pollActiveInterval = null;
  previousVisibility = 'visible';

  constructor() {
    this.init();
  }

  init() {
    this.connectToSocket();
    this.apiClient = axios.create();

    const token = this.token;
    const apiUrl = this.apiUrl;

    if (!apiUrl || !token) {
      return;
    }

    this.apiClient.defaults.baseURL = apiUrl;
    this.token = token;
    store.commit('setToken', token);
    this.subscribe401(this.apiClient);
    this.pollActiveOrders();
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
        // Stop socket and polling
        this.disconnectFromSocket();
        clearInterval(this.pollActiveInterval);
      } else {
        // Restart socket and polling
        this.connectToSocket();
        this.pollActiveOrders();
      }

      this.previousVisibility = visibilityState;
    });
  }

  connectToSocket() {
    // Use dummy key, not needed for public endpoints
    const client = new Client({ apiKey: 'dummy', apiSecret: 'dummy' });
    this.socket = client.socket;
    // Mock socket auth to avoid CORS error
    this.socket._authSocket = () => {};
    this.socket.connect().then(() => {
      this.listenToOpenBook();
      this.listenToHistoricalBook();
      this.subscribeToMarket(store.state.currentMarket);
    });
  }

  disconnectFromSocket() {
    if (!this.socket) {
      return;
    }

    this.socket.socketClient.close();
  }

  subscribeToMarket(market) {
    this.socket.subscribe(market.code);
  }

  unsubscribeFromMarket(market) {
    this.socket.unsubscribe(market.code);
  }

  login(apiUrl, username, password) {
    this.apiUrl = apiUrl;
    this.apiClient.defaults.baseURL = this.apiUrl;

    return this.apiClient
      .post('/auth', { username, password })
      .then((response) => {
        // Set state
        const token = response.data;
        this.token = token;
        this.username = username;
        store.dispatch('login', this.token).then(() => {
          this.pollActiveOrders();
          startPushNotifications();
        });
      });
  }

  logout() {
    clearInterval(this.pollActiveInterval);
    stopPushNotifications();
    this.token = null;

    store.dispatch('logout');
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

  addFcmToken(token) {
    return this.apiClient.post('/fcm-tokens', { token });
  }

  removeFcmToken(token) {
    const url = `/fcm-tokens/${token}`;
    return this.apiClient.delete(url);
  }

  pollActiveOrders(ms = 5000) {
    this.pollActiveInterval = setInterval(() => {
      const { code } = store.state.currentMarket;
      this.fetchActiveOrders(code);
    }, ms);
  }

  fetchActiveOrders(market, limit = 100) {
    const params = { market, limit };

    return this.apiClient
      .get('cryptomkt/orders/active', { params })
      .then((response) => {
        const orders = response.data.data;
        return store.commit('setActiveOrders', orders);
      })
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

  getExecutedOrders(market, limit = 100, page = 0) {
    const params = { market, limit, page };

    return this.apiClient
      .get('cryptomkt/orders/executed', { params })
      .then((response) => response.data);
  }

  listenToOpenBook() {
    this.socket.on('open-book', (data) => {
      const { code } = store.state.currentMarket;
      if (!data[code]) {
        return;
      }

      const { buy, sell } = data[code];
      this._addAccumulated(buy);
      this._addAccumulated(sell);
      store.commit('setBooks', { buy, sell });
    });
  }

  listenToHistoricalBook() {
    this.socket.on('historical-book', (data) => {
      const { code } = store.state.currentMarket;
      const book = data[code];
      store.commit('setHistoricalBook', { book });
    });
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
