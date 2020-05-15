const express = require("express")
const router = express.Router()
const { ROOT_APIENDPOINT } = require("../config")
const request = require("request")

router.get("/health", (req, res, next) => {
  res.status(200).send("api is up")
})

router.post("/create-payment", (req, res, next) => {
  const { amount } = req.body
  request.post(
    `${ROOT_APIENDPOINT}/v1/payments/payment`,
    {
      auth: {
        user: process.env.CLIENT_ID,
        pass: process.env.SECRET,
      },
      body: {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        transactions: [
          {
            amount: {
              total: amount,
              currency: "USD",
            },
          },
        ],
        redirect_urls: {
          return_url: "https://example.com",
          cancel_url: "https://example.com",
        },
      },
      json: true,
    },
    function (err, response) {
      if (err) {
        console.error(err)
        return res.sendStatus(500)
      }
      // 3. Return the payment ID to the client
      res.json({
        id: response.body.id,
      })
    }
  )
  // res.status(200).send("ok")
})

router.post("/execute-payment", (req, res, next) => {
  const { paymentID, payerID } = req.body
  request.post(
    `${ROOT_APIENDPOINT}/v1/payments/payment/${paymentID}/execute`,
    {
      auth: {
        user: process.env.CLIENT_ID,
        pass: process.env.SECRET,
      },
      body: {
        payer_id: payerID,
        transactions: [
          {
            amount: {
              total: "10.99",
              currency: "USD",
            },
          },
        ],
      },
      json: true,
    },
    function (err, response) {
      if (err) {
        console.error(err)
        return res.sendStatus(500)
      }
      // 4. Return a success response to the client
      res.json({
        status: "success",
      })
    }
  )
})

module.exports = router
