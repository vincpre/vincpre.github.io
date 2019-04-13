// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const bucketName = 'radio-vpr';
const fileName = './resources/10205-10.09.2018-ITEMA_21804435-0.wav';

// Uploads a local file to the bucket
storage.bucket(bucketName).upload(fileName);
console.log(`${fileName} uploaded to ${bucketName}.`);
