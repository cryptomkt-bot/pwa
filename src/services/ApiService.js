import axios from 'axios'
import injector from 'vue-inject'

export default class ApiService {
  constructor (ip = null, port = null) {
    const baseIp = ip !== null ? ip : localStorage.getItem('ip')
    const basePort = port !== null ? port : localStorage.getItem('port')
    this.axios = axios.create({
      baseURL: `https://${baseIp}:${basePort}`
    })
    const token = localStorage.getItem('token')
    this.setToken(token)
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
