/* eslint-disable quotes */
/* eslint-disable no-underscore-dangle */
const { timer, printPerf } = require("@eventdb/perf");
const EventEmitter = require("events");
const sift = require("sift").default;
const fs = require("fs");
const path = require("path");
const es = require("event-stream");
const JSONStream = require("JSONStream");

/*
=> 100K siret documents

warning, collscan used: {"etablissementSiege":true}
75053
warning, collscan used: {"etablissementSiege":false}
24947
5
1
1
1
warning, collscan used: {"dateCreationEtablissement":{"$gte":"2008-01-01","$lt":"2012-01-01"},"trancheEffectifsEtablissement":{"$gte":"10"}}
1543
┌─────────┬────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────┬───────┬─────────────┬───────────┐
│ (index) │   title    │                                                        context                                                         │ time__ms │ units │ perUnit__ms │ perSecond │
├─────────┼────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────┼───────┼─────────────┼───────────┤
│    0    │ 'loading'  │                                                     '<no context>'                                                     │  25057   │   0   │      0      │ Infinity  │
│    1    │ 'requests' │                                             '{"etablissementSiege":true}'                                              │   383    │   0   │      0      │ Infinity  │
│    2    │ 'requests' │                                             '{"etablissementSiege":false}'                                             │   229    │   0   │      0      │ Infinity  │
│    3    │ 'requests' │                                                '{"siren":"000325175"}'                                                 │    3     │   0   │      0      │ Infinity  │
│    4    │ 'requests' │                                                '{"siren":"005974761"}'                                                 │    1     │   0   │      0      │ Infinity  │
│    5    │ 'requests' │                                          '{"_id":"5d722fbd5cf7b010a8890c6c"}'                                          │    1     │   0   │      0      │ Infinity  │
│    6    │ 'requests' │                                   '{"siren":"005974761","etablissementSiege":true}'                                    │    1     │   0   │      0      │ Infinity  │
│    7    │ 'requests' │ '{"dateCreationEtablissement":{"$gte":"2008-01-01","$lt":"2012-01-01"},"trancheEffectifsEtablissement":{"$gte":"10"}}' │   437    │   0   │      0      │ Infinity  │
└─────────┴────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────┴───────┴─────────────┴───────────┘

    RAM: 557 MB
    CPU: 118%
*/
const index = new Map();
let total = 0;

function eventDoc(server, doc) {
  // create a listener for each document's key/value
  total++;
  // eslint-disable-next-line no-restricted-syntax
  for (const x in doc) {
    if (typeof doc[x] !== "object") {
      // Todo, add the object properties recursly
      const valeur = index.get(JSON.stringify({ [x]: doc[x] }));
      if (valeur !== undefined) {
        valeur.values++;
        // remove the listener if the key/value pair represent more than 10% of the population
        if (total > 1000 && valeur.values > total / 10 && valeur.enable) {
          server.removeAllListeners(JSON.stringify({ [x]: doc[x] }));
          valeur.enable = false;
        } else if (valeur.enable) {
          server.on(JSON.stringify({ [x]: doc[x] }), (request, result, data = doc) => {
            const filter = sift(request);
            const filtered = [data].filter(filter);
            if (filtered.length > 0) result.emit("result", filtered);
          });
        }
      } else {
        index.set(JSON.stringify({ [x]: doc[x] }), { values: 0, enable: true });
        server.on(JSON.stringify({ [x]: doc[x] }), (request, result, data = doc) => {
          const filter = sift(request);
          const filtered = [data].filter(filter);
          if (filtered.length > 0) result.emit("result", filtered);
        });
      }
    }
  }

  // create a listener for all documents
  server.on("db", (request, result, data = doc) => {
    const filter = sift(request);
    const filtered = [data].filter(filter);
    if (filtered.length > 0) result.emit("result", filtered);
  });
}

async function load(server) {
  // stream the file content
  const readStream = fs.createReadStream(path.resolve(__dirname, "../../../data/siret.json"), { encoding: "utf8" });
  await new Promise((resolve, reject) => {
    readStream
      // retreive all JSON documents include in the array
      .pipe(JSONStream.parse("*"))
      // index all document properties with listeners per document's key/value
      .pipe(
        es.through((data) => {
          eventDoc(server, data);
        })
      )
      .on("error", reject)
      .on("end", resolve);
  });
}

function find(db, query) {
  const client = new EventEmitter();
  // create a client listener
  let answers = 0;

  client.on("result", (data) => {
    answers += data.length;
  });

  if (!db.emit(JSON.stringify(query), query, client)) {
    let flag = true;
    // si l'index n'existe pas pour la query, on recherche un index filtre / filtre
    const keys = Object.keys(query);
    if (keys.length > 1) {
    // eslint-disable-next-line no-restricted-syntax
      for (const x in query) {
        if (typeof query[x] !== "object") {
          if (db.emit(JSON.stringify({ [x]: query[x] }), query, client)) {
            flag = false;
            break;
          }
        }
      }
    }
    if (flag) {
      console.log(`warning, collscan used: ${JSON.stringify(query)}`);
      db.emit("db", query, client);
    }
  }
  return answers;
}

async function run() {
  const db = new EventEmitter();
  db.setMaxListeners(0);

  timer.start("loading");
  // load the data
  await load(db);

  timer.stop("loading");

  const requests = [
    {
      etablissementSiege: true
    },
    {
      etablissementSiege: false
    },
    {
      siren: "000325175"
    },
    {
      siren: "005974761"
    },
    {
      _id: "5d722fbd5cf7b010a8890c6c"
    },
    {
      siren: "005974761",
      etablissementSiege: true
    },
    {
      dateCreationEtablissement: {
        $gte: "2008-01-01",
        $lt: "2012-01-01"
      },
      trancheEffectifsEtablissement: {
        $gte: "10"
      }
    }
  ];

  // perform all requests
  for (let i = 0; i < requests.length; i++) {
    timer.start("requests", JSON.stringify(requests[i]));
    console.log(find(db, requests[i]));
    timer.stop("requests", JSON.stringify(requests[i]));
  }

  printPerf();
}

run();
/*
  // create a listener attached to the etablissementSiege values
  server.on(`{"siren":"${doc.siren}"}`, (request, result, data = doc) => {
    const filter = sift(request);
    const filtered = [data].filter(filter);
    if (filtered.length > 0) result.emit("result", filtered);
  });
  // create a listener attached to the document values
  server.on(`{"_id":"${doc._id}"}`, (request, result, data = doc) => {
    const filter = sift(request);
    const filtered = [data].filter(filter);
    if (filtered.length > 0) result.emit("result", filtered);
  });
*/
