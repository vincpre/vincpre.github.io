# MongoDB 3.6
see (https://docs.mongodb.com/v3.6/sharding/#sharded-cluster) to understand the Sharded Cluster concept

## start a mongodb cluster with only one docker container
 - 4 processes: shard1 (27001), shard2 (27002), config db (27000), mongos (27017)

## Installation
 1. git clone https://github.com/vincpre/vincpre.github.io.git
 2. cd docker/mongodb/3.6_sharding_mono_container
 3. docker volume create mongodb
 4. docker image build -t cluster .
 5. docker container run -p 27017:27017 -v mongodb:/data/db cluster ./scripts/initdbs.sh
 6. docker container run -d -p 27017:27017  -v mongodb:/data/db cluster
 7. connect your application to the port #27017
 8. enjoy !

## Next
 * use mydb;
 * db.myCollection.createIndex( { _id: "hashed" } )
 * sh.shardCollection("mydb.myCollection", {_id:"hashed"});
