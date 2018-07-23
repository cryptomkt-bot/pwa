import axios from 'axios';

export default class {
  static apiUrl = 'https://api.cryptomkt.com/v1';

  static getBook(market, type, limit = 100) {
    const url = `${this.apiUrl}/book`;
    return axios.get(url, {
      params: { market, type, limit },
    });
  }

  static getBooks(market, limit = 20) {
    const sellBookRequest = this.getBook(market, 'sell', limit);
    const buyBookRequest = this.getBook(market, 'buy', limit);
    return axios.all([buyBookRequest, sellBookRequest])
      .then(axios.spread((buyBookResponse, sellBookResponse) => {
        const buyBook = buyBookResponse.data.data;
        const sellBook = sellBookResponse.data.data;
        return new Promise(resolve => resolve({ buyBook, sellBook }));
      }));
  }

  static getTrades(market, limit = 100) {
    const url = `${this.apiUrl}/trades`;
    const params = { market, limit };
    return axios.get(url, { params })
      .then(response => new Promise(resolve => resolve(response.data.data)));
  }
}
