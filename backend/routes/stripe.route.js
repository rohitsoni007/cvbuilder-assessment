var express = require("express");
var router = express.Router();
const stripeController = require("../controllers/stripe.controller");
const validate = require("../middlewares/validate.middleware");
const handleResponse = require("../middlewares/handleResponse.middleware");
const authorize = require("../middlewares/authorize.middleware");
const { createIntentValidation, confirmCheckoutValidation } = require("../validations/stripe.validation");

router.post("/create-intent", authorize, validate(createIntentValidation), stripeController.createCheckoutLink, handleResponse);
router.post("/confirm-checkout", authorize, validate(confirmCheckoutValidation), stripeController.confirmCheckout, handleResponse);

module.exports = router;
