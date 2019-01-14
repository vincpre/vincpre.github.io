#!/bin/bash
echo "${@} --fork --syslog --pidfilepath /tmp/mongodb.pid" > /tmp/cmd.sh && chmod +x /tmp/cmd.sh
su - mongodb -c /tmp/cmd.sh

echo "init sharding.."
mongo <<EOF
sleep(2000);
sh.addShard( "shard1/shard1:27017" );
sh.addShard( "shard2/shard2:27017"  );
EOF

PID=$(cat /tmp/mongodb.pid)
#send SIGTERM to the process mongod
kill ${PID} > /dev/null
while [ -e /proc/${PID} ]
do
  sleep 1
done

#start the default docker command with the appropriate owner
exec gosu mongodb "${@}"
