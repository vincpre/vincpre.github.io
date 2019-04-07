const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');

const speechToText = new SpeechToTextV1({
  iam_apikey: 'xxxx',
  url: 'zzz'
});
const fs = require('fs');

const params = {
  objectMode: true,
  content_type: 'audio/flac',
  model: 'en-US_BroadbandModel',
  keywords: ['colorado', 'tornado', 'tornadoes'],
  keywords_threshold: 0.5,
  max_alternatives: 3
};

// Create the stream.
const recognizeStream = speechToText.recognizeUsingWebSocket(params);

// Pipe in the audio.
fs.createReadStream('./resources/radio.mp3').pipe(recognizeStream);

/*
 * Uncomment the following two lines of code ONLY if `objectMode` is `false`.
 *
 * WHEN USED TOGETHER, the two lines pipe the final transcript to the named
 * file and produce it on the console.
 *
 * WHEN USED ALONE, the following line pipes just the final transcript to
 * the named file but produces numeric values rather than strings on the
 * console.
 */
// recognizeStream.pipe(fs.createWriteStream('transcription.txt'));

/*
 * WHEN USED ALONE, the following line produces just the final transcript
 * on the console.
 */
// recognizeStream.setEncoding('utf8');

// Listen for events.
recognizeStream.on('data', function(event) { onEvent('Data:', event); });
recognizeStream.on('error', function(event) { onEvent('Error:', event); });
recognizeStream.on('close', function(event) { onEvent('Close:', event); });

// Display events on the console.
function onEvent(name, event) {
    console.log(name, JSON.stringify(event, null, 2));
};
