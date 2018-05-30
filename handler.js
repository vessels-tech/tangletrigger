'use strict';

const IOTA = require('iota.lib.js');
const iota = new IOTA(process.env.IOTA_URL);

module.exports.checkAddress = (event, context, callback) => {

  console.log("CHECKING ADDRESS:", process.env.IOTA_ADDRESS);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
