const express = require("express")
const router = express.Router()
const { ROOT_APIENDPOINT } = require("../config")
const request = require("request")

const paypal = require("@paypal/checkout-server-sdk")
const payPalClient = require("../common/paypalSdkClient")

router.get("/health", (req, res, next) => {
  res.status(200).send("api is up")
})

router.post("/create-paypal-transaction", async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest()
  request.prefer("return=representation")
  request.requestBody({
    intent: "CAPTURE",
    application_context: {
      return_url: "https://example.com",
      cancel_url: "https://example.com",
    },
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "0.369",
        },
      },
    ],
  })

  let order
  try {
    order = await payPalClient.client().execute(request)
  } catch (err) {
    // 4. Handle any errors from the call
    console.error(err)
    return res.status(500)
  }

  // 5. Return a successful response to the client with the order ID
  res.status(200).json({
    orderID: order.result.id,
  })
})

router.post("/capture-paypal-transaction", async (req, res) => {
  // 2a. Get the order ID from the request body
  const orderID = req.body.orderID

  // 3. Call PayPal to capture the order
  const request = new paypal.orders.OrdersCaptureRequest(orderID)
  request.requestBody({})

  const requestTransactionDetail = new paypal.orders.OrdersGetRequest(orderID)

  try {
    const capture = await payPalClient.client().execute(request)

    // 4. Save the capture ID to your database. Implement logic to save capture to your database for future reference.
    const captureID = capture.result.purchase_units[0].payments.captures[0].id
    // await database.saveCaptureID(captureID);

    // get transaction detail information
    const transactionDetail = await payPalClient
      .client()
      .execute(requestTransactionDetail)

    console.log(transactionDetail.result)
    res.status(200).send(transactionDetail.result)
  } catch (err) {
    // 5. Handle any errors from the call
    console.error(err)
    return res.status(500)
  }

  // 6. Return a successful response to the client
})

module.exports = router
