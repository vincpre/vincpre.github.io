#!/bin/bash
echo "start & initiate shard daemons"
mongo localhost:27001 <<EOF
rs.initiate();
EOF

mongo localhost:27002 <<EOF
rs.initiate();
EOF

echo "start & initiate config daemon"

mongo localhost:27000 <<EOF
rs.initiate({
  _id: "config",
  configsvr: true,
  members: [{ _id: 0, host: "localhost:27000" }]
});
EOF

echo "start & initiate the cluster"
mongos --configdb config/localhost:27000 --port 27017 --bind_ip_all --fork --syslog --pidfilepath /tmp/mongos.pid

echo "create & shard database, collections, ..."
mongo localhost /scripts/initdbs.js

PID=$(cat /tmp/mongos.pid)
#send SIGTERM to the mongos process
kill ${PID} > /dev/null
while [ -e /proc/${PID} ]
do
  sleep 1
done
