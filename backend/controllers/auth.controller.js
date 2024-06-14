const User = require('../models/user.model');
const { createResponse, httpClient } = require('../utils/commonFunctions.util');
const { MESSAGES } = require('../utils/constant.util');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FRONTEND_URL } = process.env;
const {OAuth2Client} = require('google-auth-library');


const _auth = {};

_auth.register = async (req, res, next) => {
    try {
        const {
            email,
            password,
            confirmPassword,
            firstName,
            lastName,
            username,
            contact
        } = req.body;

        const exist = await User.findOne({ email });

        if (exist) {
            throw { message: MESSAGES.EMAIL_EXIST };
        }

        const userData = {
            email,
            identifier: `email-${email}`,
            password,
            firstName,
            lastName,
            username,
            contact
        };

        let user = await new User(userData).save();
        
        user.password = undefined;

        const resp = {
            user,
        };

        createResponse(req, true, MESSAGES.REGISTER, resp);
        return next();
    } catch (error) {
        createResponse(req, false, error.message || MESSAGES.ERROR);
        return next();
    }
};

_auth.login = async (req, res, next) => {
    try {
        const { email, password, type } = req.body;

        
        const userFilter = {
            email,
        };

        const user = await User.findOne(userFilter).select('+password');

        if (!user) {
            throw { message: MESSAGES.EMAIL_NOT_EXIST };
        }

        if (user.isDeleted || !user.isActive) {
            throw { message: MESSAGES.ACCOUNT_DEACTIVATED };
        }
        
        const checkPassword = user.comparePassword(password, user.password);

        if (!checkPassword) {
            throw { message: MESSAGES.INVALID_CREDENTIAL };
        }

        const token = getToken(user._id);

        user.password = undefined;

        const resp = {
            user,
            token,
        };


        createResponse(req, true, MESSAGES.LOGIN, resp);
        return next();
    } catch (error) {
        createResponse(req, false, error.message || MESSAGES.ERROR);
        return next();
    }
};

_auth.socialLogin = async (req, res, next) => {
    try {
        const {
            code
        } = req.body;

        const {
            type
        } = req.params;

        if(!['google','facebook'].includes(type)){
            throw{ message: 'Not supported' }
        }

        
        let updateData = {};
        let createData = {};
        let find = {};

        if(type == 'google'){

            const client = new OAuth2Client({
                clientId: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                grant_type: 'authorization_code',
                redirectUri: FRONTEND_URL,
            });
    
            const tokenResp = await client.getToken({
                code: code,
            });
    
            const ticket = await client.verifyIdToken({
                idToken: tokenResp.tokens.id_token,
                audience: GOOGLE_CLIENT_ID,
            });

            const { name, email, picture } = ticket.getPayload();
            let identifier = `google-${email}`;
            let provider = 'google';

            find = { $or: [{ email }, { identifier }] };
    
            let splitedname = name.split(' ');
            updateData = { 
                firstName: splitedname[0]?splitedname[0]:'',
                lastName: splitedname[1]?splitedname[1]:'', 
            };
            createData = {
                ...updateData,
                email,
                identifier,
                provider,
            };
        }

        if(type == 'facebook'){

            const response = await httpClient({
                url: "https://graph.facebook.com/me",
                method: "get",
                params: {
                  fields: ["id", "name", "picture", "email"].join(","),
                  access_token: code,
                },
              });
            const { id, name, picture, email } = response;
            let provider = 'facebook';

            let identifier = `facebook-${id}`;
            find = { $or: [{ identifier }] };
            if (email) {
                find["$or"].push({ email });
            }
            let splitedname = name.split(' ');
            update = { 
                firstName: splitedname[0]?splitedname[0]:'',
                lastName: splitedname[1]?splitedname[1]:'', 
            };

            createData = {
                ...updateData,
                identifier,
                provider,
            };
            if (email) {
                createData.email = email;
            }
        }
        



        const exist = await User.findOne(find);
        let user = null
        if (exist) {
            let options = { new: true }
            user = await User.findByIdAndUpdate(
                exist._id,
                options,
                updateData
            )

        }else{

            user = await new User(createData).save();
        }

        const token = getToken(user._id);

        user.password = undefined;

        const resp = {
            user,
            token,
        };

        createResponse(req, true, MESSAGES.LOGIN, resp);
        return next();
    } catch (error) {
        createResponse(req, false, error.message || MESSAGES.ERROR);
        return next();
    }
};

_auth.me = async (req, res, next) => {
    try {
        const resp = {
            user: req.user,
        };


        createResponse(req, true, '', resp);
        return next();
    } catch (error) {
        createResponse(req, false, error.message || MESSAGES.ERROR);
        return next();
    }
};


const getToken = (id) => {
    const jwtObj = { id };

    const token = jwt.sign(jwtObj, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
    });
    return token;
};



module.exports = _auth;