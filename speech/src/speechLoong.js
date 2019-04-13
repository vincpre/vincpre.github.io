// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

const config = {
  audioChannelCount: 2,
  encoding: 'WAV',
  sampleRateHertz: 44100,
  languageCode: 'fr-FR'
};

const audio = {
  uri: 'gs://radio-vpr/10205-10.09.2018-ITEMA_21804435-0.wav',
};

const request = {
  config: config,
  audio: audio,
};

// Detects speech in the audio file. This creates a recognition job that you
// can wait for now, or get its result later.
client
  .longRunningRecognize(request)
  .then(data => {
    const operation = data[0];
    // Get a Promise representation of the final result of the job
    return operation.promise();
  })
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
