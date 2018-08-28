export default class {
  static get(key) {
    const item = localStorage.getItem(key);
    return JSON.parse(item);
  }
  static set(key, value) {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
  }
  static remove(key) {
    localStorage.removeItem(key);
  }
}
