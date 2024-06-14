const stripe = require('stripe')(process.env.STRIPE_KEY);
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_KEY, {})

const createCustomer = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const resp = await stripe.customers.create({
                ...data,
            });
            return resolve(resp);
        } catch (error) {
            return reject(error);
        }
    });
};

const updateCustomer = async (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const resp = await stripe.customers.update(id, data);
            return resolve(resp);
        } catch (error) {
            return reject(error);
        }
    });
};


const updateDefaultPaymentMethod = async (customer, default_payment_method) => {
    return new Promise(async (resolve, reject) => {
        try {
            const resp = await stripe.customers.update(customer, {
                invoice_settings: { default_payment_method },
            });
            return resolve(resp);
        } catch (error) {
            console.log('error', error);
            return resolve(true);
        }
    });
};


const createCheckoutSession = (
    userId,
    customerId,
    cvId,
    type
) => {
    return new Promise(async (resolve, reject) => {
        try {
            let sessionLink
                sessionLink = `${process.env.FRONTEND_URL}/cv-page/${cvId}?session_id={CHECKOUT_SESSION_ID}&stripe=confirm-payment`
            const createData = {
                mode: 'payment',
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                              name: `${type} Pdf`,
                            },
                            unit_amount: 100,
                          },
                          quantity: 1,
                    },
                ],
                success_url: sessionLink,
                cancel_url: `${process.env.FRONTEND_URL}/cv-page/${cvId}?session_id={CHECKOUT_SESSION_ID}&stripe=cancel-payment`,
                client_reference_id: userId.toString(),
                customer: customerId,
                customer_update: {
                    address: 'auto',
                },
                // billing_address_collection: 'required',
                metadata: {
                    type: type,
                },

            };

            console.log('~ createData', createData);

            const checkout = await stripe.checkout.sessions.create(createData);

            return resolve(checkout);
        } catch (error) {
            return reject(error);
        }
    });
};

const getCheckoutSession = (sessionId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkout = await stripe.checkout.sessions.retrieve(sessionId);

            return resolve(checkout);
        } catch (error) {
            return reject(error);
        }
    });
};

const getPaymentIntent = async (paymentIntentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(
                paymentIntentId
            );

            return resolve(paymentIntent);
        } catch (error) {
            return reject(error);
        }
    });
};

const createPaymentIntent = async (amount, customer) => {
    return new Promise(async (resolve, reject) => {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
              amount: amount,
              currency: 'usd',
              automatic_payment_methods: {
                enabled: true,
              },
              customer: customer,
            //   setup_future_usage: 'on_session',
              description: 'download pdf'
            });

            return resolve(paymentIntent);
        } catch (error) {
            return reject(error);
        }
    });
};

const constructWebHookEvent = (body, signature, webhookSecret) => {
    return stripe.webhooks.constructEvent(body, signature, webhookSecret);
};

const getCustomer = async (customerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const resp = await stripe.customers.retrieve(customerId);
            return resolve(resp);
        } catch (error) {
            return reject(error);
        }
    });
};

const attachedPaymentMethodToCustomer = async (paymentMethod, customer) => {
    return new Promise(async (resolve, reject) => {
        try {
            const resp = await stripe.paymentMethods.attach(paymentMethod, {
                customer,
            });
            return resolve(resp);
        } catch (error) {
            console.log('error', error);
            return resolve(false);
        }
    });
};


module.exports = {
    createCustomer,
    updateDefaultPaymentMethod,
    getCustomer,
    constructWebHookEvent,
    getPaymentIntent,
    updateCustomer,
    createPaymentIntent,
    createCheckoutSession,
    getCheckoutSession,
    attachedPaymentMethodToCustomer
};
