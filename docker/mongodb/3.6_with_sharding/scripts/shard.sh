#!/bin/bash
#retreive the default docker command and initiate the database configuration
echo "${@} --fork --syslog --pidfilepath /tmp/mongodb.pid" > /tmp/cmd.sh && chmod +x /tmp/cmd.sh
su - mongodb -c /tmp/cmd.sh

echo "init shard $(hostname)"
mongo <<EOF
rs.initiate({
  _id: "$(hostname)",
  members: [{ _id: 0, host: "$(hostname):27017" }]
});
sleep(2000)
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

