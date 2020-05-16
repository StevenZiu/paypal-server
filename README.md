## PayPal Checkout Demo (Server Side Implementation backend)

This backend was bootstrapped with Express.

### Live demo (Hosted in Google App Engine)

https://planar-cistern-277404.uc.r.appspot.com

Health test url:

https://planar-cistern-277404.uc.r.appspot.com/api/v1/health

### Local Build

In the project directory, you can run:

### `npm i`

### `npm install nodemon -g`

then:

### `nodemon`

Runs the app in the development mode.<br />
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

### Structure

This is backend for Server Side Implementation of PayPal Checkout flow, which relys on paypal server checkout sdk. In the Server Side Implementation, the frontend for user is basically same, but when payer click paypal button which is actually calling node server to use server sdk to create order, then return orderId to client side. Once payer approved the order, the frontend will tell node to call order capture to get the fund, after that, there is another call in the node to get transaction detail, the detail of order will be send back to client for user reference.

### API

/api/v1/create-paypal-transaction
/api/v1/capture-paypal-transaction
