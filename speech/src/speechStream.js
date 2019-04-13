// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const fs = require('fs');
const base64 = require('base64-stream').Base64Decode;

// Creates a client
const client = new speech.SpeechClient();

const config = {
  audioChannelCount: 2,
  encoding: 'WAV',
  sampleRateHertz: 44100,
  languageCode: 'fr-FR'
};

const fileName = './resources/radio.wav';
const readStream = fs.createReadStream(fileName);

// Handle stream events --> data, end,
readStream
  .pipe(new base64())
  .on('data', function (chunk) {
    // console.log(chunk.length);
    const request = {
      audio: {content: chunk},
      config: config,
    };
    client
    .recognize(request)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: ${transcription}`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  })
  .on('end', function () {
    console.log("fin");
  });
