import axios from 'axios'
import injector from 'vue-inject'

export default class ApiService {
  constructor (baseURL = null) {
    this.storageService = injector.get('storageService')
    this.baseURL = baseURL || this.storageService.get('apiAddress')
    if (this.baseURL !== null) {
      this.axios = axios.create({ baseURL: `https://${this.baseURL}` })
    } else {
      this.axios = axios.create()
    }
    const token = this.storageService.get('token')
    this.setToken(token)
  }

  login (username, password) {
    return this.post('/auth', { username, password }).then(response => {
      const token = response.data.access_token
      this.setToken(token)
      // Save to storage
      this.storageService.set('apiAddress', this.baseURL)
      this.storageService.set('username', username)
      this.storageService.set('token', token)
    })
  }

  setToken (token) {
    this.axios.defaults.headers.common['Authorization'] = `JWT ${token}`
  }

  get (endpoint, params = null) {
    return this.axios.get(endpoint, { params })
  }

  post (endpoint, data) {
    return this.axios.post(endpoint, data)
  }

  put (endpoint, data) {
    return this.axios.put(endpoint, data)
  }

  patch (endpoint, data) {
    return this.axios.patch(endpoint, data)
  }

  delete (endpoint) {
    return this.axios.delete(endpoint)
  }
}

injector.service('apiService', ApiService)
