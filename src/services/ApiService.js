import axios from 'axios';
import injector from 'vue-inject';
import { Toast } from 'buefy';
import i18n from '../locale/i18n';
import store from '../store';
import StorageHelper from '../helpers/StorageHelper';

export default class ApiService {
  constructor() {
    this.axios = axios.create({ headers: {}});
    this.init()
  }

  init() {
    const apiAddress = StorageHelper.get('apiAddress');
    const token = StorageHelper.get('token', token);
    if (!apiAddress || !token) {
      return;
    }
    this.axios.defaults.baseURL = `https://${apiAddress}`;
    this.axios.defaults.headers.Authorization = `JWT ${token}`;
    this.subscribe401();
    store.commit('login');
  }

  login(apiAddress, username, password) {
    this.axios.defaults.baseURL = `https://${apiAddress}`;
    return this.post('/auth', { username, password }).then((response) => {
      // Set token
      const token = response.data.access_token;
      this.axios.defaults.headers.Authorization = `JWT ${token}`;

      // Save to storage
      StorageHelper.set('apiAddress', apiAddress);
      StorageHelper.set('username', username);
      StorageHelper.set('token', token);

      this.subscribe401();
    });
  }

  subscribe401() {
    this.axios.interceptors.response.use(null, (error) => {
      if (error.response.status === 401 && store.state.isLogged) {
        store.dispatch('logout');
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

  get(endpoint, params = null) {
    return this.axios.get(endpoint, { params });
  }

  post(endpoint, data) {
    return this.axios.post(endpoint, data);
  }

  put(endpoint, data) {
    return this.axios.put(endpoint, data);
  }

  patch(endpoint, data) {
    return this.axios.patch(endpoint, data);
  }

  delete(endpoint) {
    return this.axios.delete(endpoint);
  }
}

injector.service('apiService', ApiService);
