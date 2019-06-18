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

  `type` is either _buy_ or _sell_.

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
