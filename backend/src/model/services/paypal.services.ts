require('dotenv').config();
const pay = require('@paypal/checkout-server-sdk');

let environment = new pay.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
let paypal = new pay.core.PayPalHttpClient(environment);

module.exports = { paypal };