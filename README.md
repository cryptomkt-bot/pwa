# CryptoMKT Bot
<img src="https://tanoabeleyra.github.io/cryptomkt-bot-webapp/static/icon-512.png" label="icon" width="256px">

> A web app for a trading bot running on [CryptoMarket](https://www.cryptomkt.com).

## Screenshots
<a href="https://user-images.githubusercontent.com/6851095/43031298-50406514-8c75-11e8-869e-db5ac7e657b8.png"><img src="https://user-images.githubusercontent.com/6851095/43031298-50406514-8c75-11e8-869e-db5ac7e657b8.png" width="160px"></a>
<a href="https://user-images.githubusercontent.com/6851095/43031499-8209d25c-8c79-11e8-9451-8d172b84f860.png"><img src="https://user-images.githubusercontent.com/6851095/43031499-8209d25c-8c79-11e8-9451-8d172b84f860.png" width="160px"></a>
<a href="https://user-images.githubusercontent.com/6851095/43031498-81e53bfe-8c79-11e8-8589-e24200a43ac2.png"><img src="https://user-images.githubusercontent.com/6851095/43031498-81e53bfe-8c79-11e8-8589-e24200a43ac2.png" width="160px"></a>
<a href="https://user-images.githubusercontent.com/6851095/43031297-50177da2-8c75-11e8-9ba0-ad0df3478f71.png"><img src="https://user-images.githubusercontent.com/6851095/43031297-50177da2-8c75-11e8-9ba0-ad0df3478f71.png" width="160px"></a>
<a href="https://user-images.githubusercontent.com/6851095/43031296-4ff4962a-8c75-11e8-8a95-d0f305d26eca.png"><img src="https://user-images.githubusercontent.com/6851095/43031296-4ff4962a-8c75-11e8-8a95-d0f305d26eca.png" width="160px"></a>

## Build Setup
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## About the API
The API must run on SSL (port 443) and allow [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing).

You can protect the API with [JWT](https://en.wikipedia.org/wiki/JSON_Web_Token).  
An `Authorization` header with the following format is sent with every request: `JWT <token>`

### Endpoints
`POST /auth`
> Obtain the JWT
- Payload
  ```
  {
    "username": [string],
    "password": [string]
  }
  ```
- Response
  ```
  {
    "access_token": [string]
  }
  ```
---
`GET /buyer/<market>`
> Get the buyer trading on market `<market>`
- Response
  ```
  {
    "remaining_amount": [number],
    "remaining_fiat": [number]
  }
  ```
---
`PATCH /buyer/<market>`
> Update the buyer trading on market `<market>`
- Payload
  ```
  {
    "remaining_amount": [number],
    "remianing_fiat": [number]
  }
  ```
- Response: Same as `GET /buyer/<market_code>`
---
`GET /seller/<market_code>`
> Get the seller trading on market `<market>`
- Response:
  ```
  {
    "remaining_fiat": [number],
    "min_spread": [number]
  }
  ```
---
`PATCH /seller/<market_code>`
> Update the seller trading on market `<market>`
- Payload
  ```
  {
    "remaining_fiat": [number],
    "min_spread": [number]
  }
  ```
- Response: Same as `GET /seller/<market_code>`
--- 
`GET /orders/<id>`
> Get the order with id `<id>`
- Response: data from `GET api.cryptomkt.com/v1/orders/status?id=<id>`
--- 
`POST /orders/<market>`
> Open an order on market `<market>`
- Payload
  ```
  {
    "amount": [number],
    "price: [number],
    "type": [string]
  }
  ```
  `type` is either *buy* or *sell*.

- Response: data from `POST api.cryptomkt.com/v1/orders/create`
---
`DELETE /orders/<id>`
> Cancel the order with id `<id>`
- Response: data from `POST api.cryptomkt.com/v1/orders/cancel?id=<id>`
---
`GET /orders/active/<market>`
> Get the active orders for market `<market>`
- Response: data from `GET api.cryptomkt.com/v1/orders/active?market=<market>`
---
`GET /orders/executed/<market>`
> Get the executed orders for market `<market>`
- Response: data from `GET api.cryptomkt.com/v1/orders/executed?market=<market>`
---
`GET /balance`
> Get your CryptoMarket balance
- Response: data from `GET api.cryptomkt.com/v1/balance`
