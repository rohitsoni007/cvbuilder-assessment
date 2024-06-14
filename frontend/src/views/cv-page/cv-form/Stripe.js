import React, { useState } from "react";
import ReactDOM from "react-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Box, Button } from "@mui/material";
import AnimateButton from "ui-component/extended/AnimateButton";
import { addStripeIntent } from "utils/service";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      // Show error to your customer
      setErrorMessage(submitError.message);
      return;
    }

    // Create the PaymentIntent and obtain clientSecret from your server endpoint
    // const res = await fetch("/create-intent", {
    //   method: "POST",
    // });

    const res = await addStripeIntent();
    const clientSecret = res?.data?.data?.client_secret;
    console.log('~ clientSecret', clientSecret);


    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      clientSecret,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
    });

    if (error) {
      console.log('~ error', error);
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button
            // onClick={handleDownload}
            disableElevation
            disabled={!stripe || !elements}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="secondary"
          >
            Pay
          </Button>
        </AnimateButton>
      </Box>

      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

console.log("~ REACT_APP_STRIPE_KEY", process.env.REACT_APP_STRIPE_KEY);
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const options = {
  mode: "payment",
  amount: 1,
  currency: "usd",
  // Fully customizable with appearance API.
  appearance: {
    /*...*/
  },
};

const Stripe = () => (
  <Elements stripe={stripePromise} options={options}>
    <CheckoutForm />
  </Elements>
);
export default Stripe;
