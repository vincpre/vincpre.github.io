#!/bin/bash
mkdir -p /data/db/shard1 2>/dev/null
mkdir -p /data/db/shard2 2>/dev/null
mkdir -p /data/db/config 2>/dev/null

mongod --configsvr --replSet config --port 27000 --fork --syslog --dbpath /data/db/config
mongod --shardsvr --replSet shard1 --port 27001 --fork --syslog --dbpath /data/db/shard1
mongod --shardsvr --replSet shard2 --port 27002 --fork --syslog --dbpath /data/db/shard2

echo "$@"
exec "$@"
