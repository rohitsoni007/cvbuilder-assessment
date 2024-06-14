const User = require('../models/user.model');
const { createCustomer, updateCustomer, createPaymentIntent, createCheckoutSession, getCheckoutSession, getPaymentIntent, updateDefaultPaymentMethod, attachedPaymentMethodToCustomer } = require('../utils/stripe.util');
const { createResponse } = require('../utils/commonFunctions.util');
const { MESSAGES } = require('../utils/constant.util');
const _stripe = {}
const fs = require('fs/promises');
const Order = require('../models/order.model');

_stripe.createIntent = async(req, res, next) => {
    try {
        const { _id } = req.user


        let customerId = await createAndSaveCustomer(_id);
        

        const amount = 1;

        let paymentIntent = await createPaymentIntent(amount, customerId);

        const resp = {
            amount,
            customerId,
            client_secret: paymentIntent?.client_secret,
        };

        createResponse(req, true, '', resp);
        return next();
    } catch (error) {
        createResponse(req, false, error.message || MESSAGES.ERROR);
        return next();
    }
}

_stripe.createCheckoutLink = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const { resumeId } = req.body;

        let customerId = await createAndSaveCustomer(_id);
        
        const resp = await createCheckoutSession(
            _id,
            customerId,
            resumeId,
            'Download'
        );

        createResponse(req, true, MESSAGES.SUBSCRIPTION_LINK_GENERATED, resp);
        return next();
    } catch (error) {
        createResponse(req, false, error.message || MESSAGES.ERROR);
        return next();
    }
};

_stripe.confirmCheckout = async (req, res, next) => {
    try {
        const { sessionId } = req.body;

        const session = await getCheckoutSession(sessionId);

        if(!session){
            throw { message: MESSAGES.NO_DATA };
        }

        const {
            status,
            customer,
            payment_status,
            amount_total,
            client_reference_id: userId,
        } = session;

        if (status != 'complete') {
            throw { message: MESSAGES.NO_DATA };
        }

        const userDetail = await User.findById(userId)
                .lean();

        if (!userDetail) {
            throw { message: MESSAGES.NO_DATA };
        }

        if (customer != userDetail?.stripeCustomerId) {
            throw { message: MESSAGES.NO_DATA };
        }

        let orderData = {
            user: userDetail._id,
            type: 'download',
            amount: amount_total / 100,
            status: status,
            paymentStatus: payment_status,
        }
        let order = await new Order(orderData).save();

        // // await fs.writeFile('test.json', JSON.stringify(session));
        const paymentIntent = await getPaymentIntent(session?.payment_intent);
        if(paymentIntent?.payment_method){

            let resp = await attachedPaymentMethodToCustomer(paymentIntent?.payment_method, customer);
            if(resp){
                await updateDefaultPaymentMethod(customer, paymentIntent?.payment_method);
            }
        }


        // await fs.writeFile('paymentIntent.json', JSON.stringify(paymentIntent));

        const resp = {
            order
        };

        createResponse(req, true, MESSAGES.PAYMENT_SUCCESSFUL, resp);
        return next();
    } catch (error) {
        createResponse(req, false, error.message || MESSAGES.ERROR);
        return next();
    }
};

const createAndSaveCustomer = async (_id, address = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            const find = { _id: _id, };

            const user = await User.findById(_id)
                .select({ __v: 0 })
                .lean();
            if (!user) {
                throw { message: MESSAGES.NO_DATA };
            }

            let customerId = user?.stripeCustomerId;
            
                const customerData = {
                    email: user.email,
                    // name: user.name,
                    // address: {
                    //     line1: company?.address?.street || '',
                    //     city: company?.address?.city || '',
                    //     state: company?.address?.state || '',
                    //     country: company?.address?.country || '',
                    //     postal_code: company?.address?.pincode || '',
                    // },
                    metadata: {
                        userId: user._id,
                    },
                };
            if (!customerId) {
                const account = await createCustomer(customerData);

                const dataToUpdate = {
                    stripeCustomerId: account.id
                };
                const options = { new: true };

                const updated = await User.findByIdAndUpdate(
                    _id,
                    dataToUpdate,
                    options
                );
                customerId = account?.id;
            }  else {
                const updatedCustomer = await updateCustomer(
                    customerId,
                    customerData
                );
            }

            return resolve(customerId);
        } catch (error) {
            return reject(error);
        }
    });
};


module.exports = _stripe