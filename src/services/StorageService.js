import injector from 'vue-inject'

class StorageService {
  get (key) {
    const item = localStorage.getItem(key)
    return JSON.parse(item)
  }
  set (key, value) {
    value = JSON.stringify(value)
    localStorage.setItem(key, value)
  }
}

injector.service('storageService', StorageService)
