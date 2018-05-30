'use strict';

const IOTA = require('iota.lib.js');
const iota = new IOTA({provider: process.env.IOTA_URL});

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

module.exports.checkAddress = (event, context, callback) => {
  console.log("CHECKING ADDRESS:", process.env.IOTA_ADDRESS);

  return Promise.all([
    getExistingHashes(),
    findTransactionsPromise()
  ])
  .then(([existingTx, allTx]) => {
    //Remove the existing from all
    const newTx = Object.keys(allTx).filter(hash => existingTx[hash] !== true);
    console.log("new tx are:", newTx);
    //TODO: Trigger a new email/notification

    return saveNewHashes(newTx);
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
};

/**
 * Get the existing tx hashes by looking up files in s3
 * This is limited to 1000, but good enough for our demo
 * 
 * Returns an object, where the key is the hash
 */
const getExistingHashes = () => {
  var params = {
    Bucket: process.env.S3_BUCKET_NAME,
  };

  return s3.listObjects(params).promise()
  .then(data => {
    const existingHashList = data.Contents.map(file => file.Key);
    const existingHashes = {};
    existingHashList.forEach(hash => existingHashes[hash] = true);
    
    return existingHashes;
  });
}


/**
 * Creates new files in s3 for each hash in the hash list
 * essentially adding them to a 'seen' list
 */
const saveNewHashes = (hashList) => {
  return Promise.all(hashList.map(hash => {
    const params = {
      Body: '\"true\"',
      Bucket: process.env.S3_BUCKET_NAME,
      Key: hash
    };

    return s3.putObject(params).promise();
  }));
}


const findTransactionsPromise = () => {
  const searchValues = { addresses: [process.env.IOTA_ADDRESS] };

  return new Promise((resolve, reject) => {
    iota.api.findTransactionObjects(searchValues, (err, res) => {
      if (err) {
        reject(err);
      }

      const foundHashList = res.map(tx => tx.hash);
      const foundHashes = {};
      foundHashList.forEach(hash => foundHashes[hash] = true);
      resolve(foundHashes);
    });
  })
}