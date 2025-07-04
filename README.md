# Endpoints

## WIP

```text
GET    /sneakers/:id/reviews
POST   /sneakers/:id/reviews
PATCH  /reviews/:id
DELETE /reviews/:id 
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

COMPLETED (BASE)

```text
GET    /sneakers?offset=&limit=              *
GET    /sneakers/search?q=&offset=&limit=    *
GET    /sneakers/popular                     *
GET    /sneakers/related/:slug
GET    /sneakers/recommendations
GET    /sneakers/brands                      *
POST   /sneakers                    MANAGER  *

GET    /sneakers/:slug                       *
PATCH  /sneakers/:slug              MANAGER  *
DELETE /sneakers/:slug              MANAGER  *

POST   /sneakers/:slug/images       MANAGER  
DELETE /sneakers/:slug/images/:img  MANAGER  

GET    /sneakers/:slug/stock                 * // quantities, sizes
POST   /sneakers/:slug/stock        MANAGER  * // quantities, sizes
PATCH  /sneakers/:slug/stock        MANAGER  * // quantities, sizes
```

COMPLETED

## FAVORITES

```text
GET    /favorites
POST   /favorites/:slug
DELETE /favorites/:slug
```

## CART

COMPLETED

```text
GET    /cart
POST   /cart
PATCH  /cart/:slug
DELETE /cart/:slug
DELETE /cart
```

## REVIEWS

COMPLETED

```text
GET    /sneakers/:id/reviews
POST   /sneakers/:id/reviews
PATCH  /reviews/:id
DELETE /reviews/:id 
```

## NOTIFICATIONS

WIP

```text
GET    /notifications
PATCH  /notifications/:id/read
DELETE /notifications/:id
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

## PAYMENTS

```text
POST   /payments/create/:orderId
POST   /payments/webhook
```

## ANALYTICS

```text
GET    /analytics/sales           MANAGER
GET    /analytics/products        MANAGER
GET    /analytics/users           MANAGER
```
