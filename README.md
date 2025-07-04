# Endpoints

## WIP

```text
PATCH  /sneakers/:id              MANAGER
DELETE /sneakers/:id              MANAGER
```

## AUTH

COMPLETED

```text
POST   /auth/otp
POST   /auth/login
POST   /auth/register
POST   /auth/refresh
POST   /auth/logout
POST   /auth/forgot-password
POST   /auth/reset-password
```

## USERS

COMPLETED

```text
GET    /user
PATCH  /user
PATCH  /user/:id                  MANAGER
GET    /user/:id                  MANAGER
DELETE /user/:id                  MANAGER
```

## SNEAKERS

WIP

```text
GET    /sneakers?offset=&limit=
GET    /sneakers/search?q=&offset=&limit=
GET    /sneakers/popular
GET    /sneakers/related/:id
GET    /sneakers/recommendations
GET    /sneakers/brands
POST   /sneakers                  MANAGER

GET    /sneakers/:id
POST   /sneakers/:id/stock        MANAGER
PATCH  /sneakers/:id              MANAGER
DELETE /sneakers/:id              MANAGER
POST   /sneakers/:id/images       MANAGER
DELETE /sneakers/:id/images/:img  MANAGER
```

## PAYMENTS

```text
POST   /payments/create-session
POST   /payments/webhook
GET    /payments/status/:id
```

## NOTIFICATIONS

```text
GET    /notifications
PATCH  /notifications/:id/read
DELETE /notifications/:id
```

## CART

```text
GET    /cart
POST   /cart
PATCH  /cart/:itemId
DELETE /cart/:itemId
DELETE /cart
```

## ORDERS

```text
GET    /orders
GET    /orders/:id
POST   /orders
PATCH  /orders/:id/status         MANAGER
```

## DELIVERY

```text
GET    /delivery/options
POST   /delivery/estimate
```

## REVIEWS

```text
GET    /sneakers/:id/reviews
POST   /sneakers/:id/reviews
PATCH  /reviews/:id
DELETE /reviews/:id 
```

## FAVORITES

```text
GET    /favorites
POST   /favorites/:sneakerId
DELETE /favorites/:sneakerId
```

## ANALYTICS

```text
GET    /analytics/sales           MANAGER
GET    /analytics/products        MANAGER
GET    /analytics/users           MANAGER
```
