const Joi = require('joi');

const registerValidation = {
    body: {
        email: Joi.string().email().trim().max(255).required(),
        password: Joi.string().min(6).max(10).required(),
        // confirmPassword: Joi.any()
        //     .equal(Joi.ref('password'))
        //     .required()
        //     .label('Confirm password')
        //     .messages({ 'any.only': '{{#label}} does not match' }),
        username: Joi.string().trim().max(255).required(),
        contact: Joi.string().max(255).allow('', null).optional(),
        firstName: Joi.string().max(255).allow('', null).optional(),
        lastName: Joi.string().max(255).allow('', null).optional(),
    },
};

const loginValidation = {
    body: {
        email: Joi.string().email().trim().max(255).required(),
        password: Joi.string().min(6).max(10).required(),
        
    },
};

const socialLoginValidation = {
    params: {
        type: Joi.string().allow('google','facebook').required(),
    },
    body: {
        code: Joi.string().max(255).required(),
    },
};



module.exports = {
    registerValidation,
    loginValidation,
    socialLoginValidation
};
