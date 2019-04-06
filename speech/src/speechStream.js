// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();
const request = require('request');
const url = "http://direct.franceinter.fr/live/franceinter-lofi.mp3";

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const encoding = 'MPEG';
const sampleRateHertz = 24000;
const languageCode = 'fr-FR';

const options = { config:
  { encoding: 1,
    sampleRateHertz: 30000,
    languageCode: 'fr-FR',
    maxAlternatives: 0,
    profanityFilter: true },
 singleUtterance: true,
 InterimResults: true 
};

// Create a recognize stream
const recognizeStream = client
  .streamingRecognize(options)
  .on('error', console.error)
  .on('data', function (data) {
    console.log(data.results.length);
    return process.stdout.write(
      data.results[0] && data.results[0].alternatives[0]
        ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
        : `\n\nReached transcription time limit, press Ctrl+C\n`
    ) 
  }
  );

request(url).pipe(recognizeStream);

console.log('Listening, press Ctrl+C to stop.');