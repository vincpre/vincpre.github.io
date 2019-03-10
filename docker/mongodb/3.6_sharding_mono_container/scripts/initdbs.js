sleep(2000)
sh.addShard("shard1/localhost:27001")
sh.addShard("shard2/localhost:27002")
sh.enableSharding("mydb")
