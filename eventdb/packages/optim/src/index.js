const { timer, printPerf } = require("@eventdb/perf");
const EventEmitter = require("events");
const sift = require("sift").default;
const fs = require("fs");
const path = require("path");
const es = require("event-stream");
const JSONStream = require("JSONStream");

/*
=> 100K siret documents
db.getCollection("siret").aggregate([
  {$addFields: {_id: {$convert:{ input: "$_id", to: "string"}}}},
  {$project: {"nombrePeriodesEtablissement" : 0}},
  {$limit: 2}
  ]);

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
const index = [];

function eventDoc(server, doc) {
  // create a listener attached to the siret values
  let i = index.findIndex(k => k.key === `siren: "${doc.siren}"`);
  if (i !== -1) {
    // eslint-disable-next-line no-underscore-dangle
    index[i].value.push(doc._id);
  } else {
    // eslint-disable-next-line no-underscore-dangle
    i = index[i].push({ key: `siren: "${doc.siren}"`, values: [doc._id] });
    server.on(`siren: "${doc.siren}"`, (request, result, data = index[i]) => {
      const client = new EventEmitter();

      for (let j = 0; j < data.length; j++) {
        // eslint-disable-next-line no-underscore-dangle
        server.emit(`_id: "${data[j]._id}"`, {
          _id: "5d722fbd5cf7b010a8890c6c"
        }, client);
      }
      const filter = sift(request);
      const filtered = [data].filter(filter);
      if (filtered.length > 0) result.emit("result", filtered);
    });
  }

  // create a listener attached to the etablissementSiege values
  server.on(`etablissementSiege: "${doc.etablissementSiege.toString()}"`, (request, result, data = doc) => {
    const filter = sift(request);
    const filtered = [data].filter(filter);
    if (filtered.length > 0) result.emit("result", filtered);
  });
  // create a listener attached to the document values
  // eslint-disable-next-line no-underscore-dangle
  server.on(`_id: "${doc._id}"`, (request, result, data = doc) => {
    const filter = sift(request);
    const filtered = [data].filter(filter);
    if (filtered.length > 0) result.emit("result", filtered);
  });
}

async function load(server) {
  // stream the file content
  const readStream = fs.createReadStream(path.resolve(__dirname, "../../../data/siret.json.2"), { encoding: "utf8" });
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
  client.on("result", (data) => {
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

  // find all siret with some caracteristics
  timer.start("request3");
  answers = 0;
  // eslint-disable-next-line quotes
  db.emit(`_id: "5d722fbd5cf7b010a8890c6c"`, {
    _id: "5d722fbd5cf7b010a8890c6c"
  }, client);
  console.log(answers);

  timer.stop("request3");

  printPerf();
}

run();
