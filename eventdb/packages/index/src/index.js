const { timer, printPerf } = require("@eventdb/perf");
const EventEmitter = require("events");
const sift = require("sift").default;
const fs = require("fs");
const path = require("path");
const es = require("event-stream");
const JSONStream = require("JSONStream");

/*
=> 100K siret documents
db.getCollection("siret").find({}, {_id: 0, "nombrePeriodesEtablissement" : 0}).limit(1000000)

┌─────────┬────────────┬────────────────┬──────────┬───────┬─────────────┬───────────┐
│ (index) │   title    │    context     │ time__ms │ units │ perUnit__ms │ perSecond │
├─────────┼────────────┼────────────────┼──────────┼───────┼─────────────┼───────────┤
│    0    │ 'loading'  │ '<no context>' │  19085   │   0   │      0      │ Infinity  │
│    1    │ 'request1' │ '<no context>' │   251    │   0   │      0      │ Infinity  │
│    2    │ 'request2' │ '<no context>' │    1     │   0   │      0      │ Infinity  │
└─────────┴────────────┴────────────────┴──────────┴───────┴─────────────┴───────────┘

    RAM: 442 MB
    CPU: 122%
*/

function eventDoc(server, doc) {
  // create a listener attached to the siret values
  server.on(`siren: "${doc.siren}"`, (request, result, data = doc) => {
    const filter = sift(request);
    const filtered = [data].filter(filter);
    if (filtered.length > 0) result.emit("db", filtered);
  });
  // create a listener attached to the etablissementSiege values
  server.on(`etablissementSiege: "${doc.etablissementSiege.toString()}"`, (request, result, data = doc) => {
    const filter = sift(request);
    const filtered = [data].filter(filter);
    if (filtered.length > 0) result.emit("db", filtered);
  });
}

async function load(server) {
  // stream the file content
  const readStream = fs.createReadStream(path.resolve(__dirname, "../../../data/siret.json"), { encoding: "utf8" });
  await new Promise((resolve, reject) => {
    readStream
      // retreive all JSON documents include in the array
      .pipe(JSONStream.parse("*"))
      // create some listener with the doc content
      .pipe(
        es.through((data) => {
          eventDoc(server, data);
        }),
      )
      .on("error", reject)
      .on("end", resolve);
  });
}

async function run() {
  const db = new EventEmitter();
  const client = new EventEmitter();
  db.setMaxListeners(0);

  timer.start("loading");
  // load the data
  await load(db);

  // create a client listener
  let answers = 0;
  client.on("db", (data) => {
    answers += data.length;
  });
  timer.stop("loading");

  // find all siret with some caracteristics
  timer.start("request1");
  answers = 0;
  // eslint-disable-next-line quotes
  db.emit(`etablissementSiege: "true"`, {
    etablissementSiege: true
  }, client);
  console.log(answers);
  timer.stop("request1");

  // find all siret with some caracteristics
  timer.start("request2");
  answers = 0;
  // eslint-disable-next-line quotes
  db.emit(`siren: "005974761"`, {
    siren: "005974761"
  }, client);
  console.log(answers);

  timer.stop("request2");
  printPerf();
}

run();
