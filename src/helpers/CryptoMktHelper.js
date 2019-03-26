import axios from 'axios';

import store from '../store';

const CryptoMktHelper = {
  apiUrl: 'https://api.cryptomkt.com/v1',

  getBook(market, type, limit = 100) {
    const url = `${this.apiUrl}/book`;
    return axios.get(url, {
      params: { market, type, limit },
    });
  },

  getBooks(market, limit = 50) {
    const sellBookRequest = this.getBook(market, 'sell', limit);
    const buyBookRequest = this.getBook(market, 'buy', limit);
    return axios.all([buyBookRequest, sellBookRequest]).then(
      axios.spread((buyBookResponse, sellBookResponse) => {
        const buyBook = buyBookResponse.data.data;
        const sellBook = sellBookResponse.data.data;
        this._enrichOrders(buyBook, true, false);
        this._enrichOrders(sellBook, false, true);
        store.commit('setBooks', { buyBook, sellBook });
        return new Promise(resolve => resolve({ buyBook, sellBook }));
      })
    );
  },

  getTrades(market, limit = 100) {
    const url = `${this.apiUrl}/trades`;
    const params = { market, limit };
    return axios
      .get(url, { params })
      .then(response => new Promise(resolve => resolve(response.data.data)));
  },

  _enrichOrders(book, isBuy, isSell) {
    /** Add order type and accumulated amount */
    let accumulated = 0;
    return book.forEach(order => {
      accumulated += Number(order.amount);
      order.accumulated = accumulated;
      order.isBuy = isBuy;
      order.isSell = isSell;
    });
  },
};

export default CryptoMktHelper;
