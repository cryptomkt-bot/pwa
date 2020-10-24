# CryptoMKT Bot

<img src="https://cryptomktbot.netlify.com/img/icons/android-chrome-512x512.png" label="icon" width="256px">

> A PWA for a trading bot running on [CryptoMarket](https://www.cryptomkt.com).

## Screenshots

<a href="https://user-images.githubusercontent.com/6851095/56870765-e367b880-69ea-11e9-9588-c77f1e4ad266.png"><img src="https://user-images.githubusercontent.com/6851095/56870765-e367b880-69ea-11e9-9588-c77f1e4ad266.png" width="160px"></a>
<a href="https://user-images.githubusercontent.com/6851095/56870766-e4004f00-69ea-11e9-8985-7e6807987821.png"><img src="https://user-images.githubusercontent.com/6851095/56870766-e4004f00-69ea-11e9-8985-7e6807987821.png" width="160px"></a>
<a href="https://user-images.githubusercontent.com/6851095/56870767-e4004f00-69ea-11e9-858a-57f0eb727dc9.png"><img src="https://user-images.githubusercontent.com/6851095/56870767-e4004f00-69ea-11e9-858a-57f0eb727dc9.png" width="160px"></a>
<a href="https://user-images.githubusercontent.com/6851095/56870768-e4004f00-69ea-11e9-8093-db14ecde373f.png"><img src="https://user-images.githubusercontent.com/6851095/56870768-e4004f00-69ea-11e9-8093-db14ecde373f.png" width="160px"></a>
<a href="https://user-images.githubusercontent.com/6851095/56870769-e4004f00-69ea-11e9-9846-9621f71b2623.png"><img src="https://user-images.githubusercontent.com/6851095/56870769-e4004f00-69ea-11e9-9846-9621f71b2623.png" width="160px"></a>

## Build Setup

```bash
# install dependencies
yarn install

# serve with hot reload at localhost:8080
yarn run serve

# build for production with minification
yarn run build
```

## About the API

The API must run on SSL (port 443) and allow [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing).

An `Authorization` header with the token is sent with every request

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
- Response: The authentication token

---

`GET /<market>/buy`

> Get the buyer trading on market `<market>`

- Response
  ```
  {
    "amount": [string],
    "fiat": [string]
    "price": [string]
  }
  ```

---

`PUT /<market>/buy`

> Update the buyer trading on market `<market>`

- Payload
  ```
  {
    "amount": [string],
    "fiat": [string]
  }
  ```

---

`GET /<market_code>/sell`

> Get the seller trading on market `<market>`

- Response:
  ```
  {
    "amount": [string],
    "price": [string],
    "spread": [string]
  }
  ```

---

`PUT /<market_code>/sell`

> Update the seller trading on market `<market>`

- Payload
  ```
  {
    "amount": [string],
    "spread": [string]
  }
  ```

---

`POST /cryptomkt/orders/create`

> Open an order

- Proxy to `api.cryptomkt.com/v2/orders/create`

---

`POST /cryptomkt/orders/cancel`

> Cancel an order

- Proxy to `api.cryptomkt.com/v2/orders/cancel`

---

`GET /cryptomkt/orders/active`

> Get the active orders

- Proxy to `api.cryptomkt.com/v2/orders/active`

---

`GET /cryptomkt/orders/executed`

> Get the executed orders

- Proxy to `api.cryptomkt.com/v2/orders/executed`

---

`GET /cryptomkt/balance`

> Get your CryptoMarket balance

- Proxy to `api.cryptomkt.com/v2/balance`

---

`POST /fcm-tokens`

> Add FCM token

- Payload
  ```
  {
    "token": "the_fcm_token"
  }
  ```
- Response: 201 Created

---

`DELETE /fcm-tokens/<token>`

> Remove FCM token

- Response: 204 No Content
