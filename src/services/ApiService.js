import axios from 'axios'

export default class ApiService {
  constructor (ip = null, port = null) {
    const baseIp = ip !== null ? ip : localStorage.getItem('ip')
    const basePort = port !== null ? port : localStorage.getItem('port')
    this.axios = axios.create({
      baseURL: `http://${baseIp}:${basePort}` // TODO: Don't hardcode the protocol
    })
    const token = localStorage.getItem('token')
    this.setToken(token)
  }

  setToken (token) {
    this.axios.defaults.headers.common['Authorization'] = `JWT ${token}`
  }

  get (endpoint) {
    return this.axios.get(endpoint)
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
