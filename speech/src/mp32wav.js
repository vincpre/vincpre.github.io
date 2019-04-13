const Lame = require("node-lame").Lame;

const decoder = new Lame({
    output: "./resources/radio.wav"
}).setFile("./resources/radio.mp3");

(async function mp32wav(params) {
    await decoder.decode()
})()
