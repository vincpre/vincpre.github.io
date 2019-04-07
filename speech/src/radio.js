var fs = require('fs');
const request = require('request');

// var stream = radio.createReadStream("http://direct.franceinter.fr/live/franceinter-midfi.mp3");
const url = "http://direct.franceinter.fr/live/franceinter-lofi.mp3";
// var file = fs.createWriteStream('./resources/test.wav', { encoding: 'binary' })

request(url).pipe(fs.createWriteStream('./resources/radio.mp3'))