import axios from 'axios';
import injector from 'vue-inject';
import { Toast } from 'buefy';
import i18n from '../locale/i18n';
import store from '../store';
import StorageHelper from '../helpers/StorageHelper';

export default class ApiService {
  constructor(baseURL = null) {
    this.baseURL = baseURL || StorageHelper.get('apiAddress');
    if (this.baseURL !== null) {
      this.axios = axios.create({ baseURL: `https://${this.baseURL}`, headers: {} });
    } else {
      this.axios = axios.create();
    }
    this.intercept401();
    const token = StorageHelper.get('token');
    this.setToken(token);
  }

  login(username, password) {
    return this.post('/auth', { username, password }).then((response) => {
      const token = response.data.access_token;
      this.setToken(token);
      // Save to storage
      StorageHelper.set('apiAddress', this.baseURL);
      StorageHelper.set('username', username);
      StorageHelper.set('token', token);
    });
  }

  setToken(token) {
    this.axios.defaults.headers['Authorization'] = `JWT ${token}`;
  }

  intercept401() {
    this.axios.interceptors.response.use(null, (error) => {
      if (error.response.status === 401 && store.state.isLogged) {
        store.dispatch('logout');
        Toast.open({
          message: i18n.t('sessionExpired'),
          type: 'is-info',
          duration: 5000,
        });
      }
      return Promise.reject(error);
    });
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
