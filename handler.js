'use strict';

const IOTA = require('iota.lib.js');
const iota = new IOTA(process.env.IOTA_URL);

module.exports.checkAddress = (event, context, callback) => {

  console.log("CHECKING ADDRESS:", process.env.IOTA_ADDRESS);
};
