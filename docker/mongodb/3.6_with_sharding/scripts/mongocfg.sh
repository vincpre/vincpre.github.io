#!/bin/bash
su - mongodb -c "mongod --configsvr --replSet cfg --port 27019 --fork --syslog --pidfilepath /tmp/mongodb.pid --bind_ip_all"
echo "init RS.."
mongo mongocfg:27019 <<EOF
rs.initiate({
  _id: "cfg",
  configsvr: true,
  members: [{ _id: 0, host: "mongocfg:27019" }]
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
