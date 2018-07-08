export const countries = ['ARS', 'BRL', 'CLP', 'EUR']

const currencies = {
  'ARS': {
    code: 'ARS',
    name: 'Peso Argentino',
    prefix: '$',
    postfix: '',
    decimals: 2
  },
  'BRL': {
    code: 'BRL',
    name: 'Real Brasileño',
    prefix: 'R$',
    postfix: '',
    decimals: 2
  },
  'BTC': {
    code: 'BTC',
    name: 'Bitcoin',
    prefix: '',
    postfix: 'BTC',
    decimals: 6,
    step: 0.000001
  },
  'CLP': {
    code: 'CLP',
    name: 'Pesos Chilenos',
    prefix: '$',
    postfix: '',
    decimals: 0
  },
  'ETH': {
    code: 'ETH',
    name: 'Ether',
    prefix: '',
    postfix: 'ETH',
    decimals: 4,
    step: 0.0001
  },
  'EUR': {
    code: 'EUR',
    name: 'Euro',
    prefix: '',
    postfix: '€',
    decimals: 2
  },
  'XLM': {
    code: 'XLM',
    name: 'Stellar Lumens',
    prefix: '',
    postfix: 'XLM',
    decimals: 4,
    step: 0.0001
  }
}

export const markets = {
  'ARS': [
    {
      code: 'BTCARS',
      baseCurrency: currencies['BTC'],
      quoteCurrency: currencies['ARS'],
      step: 20
    },
    {
      code: 'ETHARS',
      baseCurrency: currencies['ETH'],
      quoteCurrency: currencies['ARS'],
      step: 2
    },
    {
      code: 'XLMARS',
      baseCurrency: currencies['XLM'],
      quoteCurrency: currencies['ARS'],
      step: 0.005
    }
  ],
  'BRL': [
    {
      code: 'BTCBRL',
      baseCurrency: currencies['BTC'],
      quoteCurrency: currencies['BRL']
    },
    {
      code: 'ETHBRL',
      baseCurrency: currencies['ETH'],
      quoteCurrency: currencies['BRL']
    },
    {
      code: 'XLMBRL',
      baseCurrency: currencies['XLM'],
      quoteCurrency: currencies['BRL']
    }
  ],
  'CLP': [
    {
      code: 'BTCCLP',
      baseCurrency: currencies['BTC'],
      quoteCurrency: currencies['CLP']
    },
    {
      code: 'ETHCLP',
      baseCurrency: currencies['ETH'],
      quoteCurrency: currencies['CLP']
    },
    {
      code: 'XLMCLP',
      baseCurrency: currencies['XLM'],
      quoteCurrency: currencies['CLP']
    }
  ],
  'EUR': [
    {
      code: 'BTCEUR',
      baseCurrency: currencies['BTC'],
      quoteCurrency: currencies['EUR']
    },
    {
      code: 'ETHEUR',
      baseCurrency: currencies['ETH'],
      quoteCurrency: currencies['EUR']
    },
    {
      code: 'XLMEUR',
      baseCurrency: currencies['XLM'],
      quoteCurrency: currencies['EUR']
    }
  ]
}
