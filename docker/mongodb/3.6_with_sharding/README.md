# MongoDB 3.6
see (https://docs.mongodb.com/manual/sharding/#sharded-cluster) to understand the Sharded Cluster concept

## start a mongodb cluster with docker
 - shard1: the node #1
 - shard2: the node #2
 - mongocfg: the config db
 - mongos: a router

## Installation
 1. git clone https://github.com/vincpre/vincpre.github.io.git
 2. cd docker/mongodb/3.6_with_sharding
 3. docker-compose.exe up -d
 4. connect your application to the port #27017
 5. enjoy !

## Next
 1. use mydb;
 2. sh.enableSharding("mydb");
 3. db.myCollection.createIndex( { _id: "hashed" } )
 4. sh.shardCollection("mydb.myCollection", {_id:"hashed"});
