var fs = require('fs');
const request = require('request');
// const url = "http://direct.franceinter.fr/live/franceinter-midfi.mp3";
// const url = "http://direct.franceinter.fr/live/franceinter-lofi.mp3";
// https://www.franceinter.fr/emissions/carnets-de-campagne/carnets-de-campagne-11-septembre-2018
const url = "https://media.radiofrance-podcast.net/podcast09/10205-10.09.2018-ITEMA_21804435-0.mp3"
request(url).pipe(fs.createWriteStream('./resources/radio.mp3'))
