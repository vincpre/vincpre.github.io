#!/bin/bash
su - mongodb -c "mongod --shardsvr --replSet $(hostname) --port 27017 --bind_ip_all --fork --syslog --pidfilepath /tmp/mongodb.pid"
echo "init shard $(hostname)"
mongo <<EOF
rs.initiate({
  _id: "$(hostname)",
  members: [{ _id: 0, host: "$(hostname):27017" }]
});
sleep(2000)
EOF
kill $(cat /tmp/mongodb.pid) > /dev/null
while ps -p$(cat /tmp/mongodb.pid) > /dev/null
do
  sleep 5
  ps -fp$(cat /tmp/mongodb.pid)
done
exec "$@"
