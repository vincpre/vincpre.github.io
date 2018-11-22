#!/bin/bash
su - mongodb -c "mongos --configdb cfg/mongocfg:27019 --port 27017 --bind_ip_all --fork --syslog --pidfilepath /tmp/mongodb.pid"
echo "init sharding.."
mongo <<EOF
sh.addShard( "shard1/shard1:27017" );
sh.addShard( "shard2/shard2:27017"  );
EOF
kill $(cat /tmp/mongodb.pid) > /dev/null
while ps -p$(cat /tmp/mongodb.pid) > /dev/null
do
  sleep 5
  ps -fp$(cat /tmp/mongodb.pid)
done
exec "$@"
