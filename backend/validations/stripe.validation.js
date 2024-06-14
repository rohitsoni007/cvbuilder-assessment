const Joi = require('joi');

const createIntentValidation = {
    body: {
        resumeId: Joi.string().hex().length(24).required(),
    },
};

const confirmCheckoutValidation = {
    body: {
        sessionId: Joi.string().required(),
    },
};






module.exports = {
    createIntentValidation,
    confirmCheckoutValidation,
};
