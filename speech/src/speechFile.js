// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const fs = require('fs');

// Creates a client
const client = new speech.SpeechClient();

// The name of the audio file to transcribe
const fileName = './resources/radio.flac';

// The audio file's encoding, sample rate in hertz, and BCP-47 language code
const audio = {
  content: fs.readFileSync(fileName).toString('base64'),
};

const config = {
  audioChannelCount: 2,
  encoding: 'FLAC',
  sampleRateHertz: 44100,
  languageCode: 'fr-FR'
};
const request = {
  audio: audio,
  config: config,
};

console.log("running...");

// Detects speech in the audio file
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