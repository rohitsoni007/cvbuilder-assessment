const axios = require('axios');

const createResponse = (req, success, message, data) => {
    let respObj = {};
    respObj['success'] = success;
    if (data || data == null) {
        respObj['data'] = data;
    }
    if (message) {
        respObj['message'] = message;
    }
    req.respObj = respObj;
    return;
};

const httpClient = async ({ url, method, headers, params, body }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios({
          url,
          method,
          headers,
          params,
          data: body,
        });
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
};



module.exports = {
    createResponse,
    httpClient
};
