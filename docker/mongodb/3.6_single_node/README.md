# MongoDB 3.6
start a single mongodb node with docker, see (https://docs.mongodb.com/v3.6/tutorial/install-mongodb-on-debian/#run-mongodb-community-edition)

## Installation
 1. git clone https://github.com/vincpre/vincpre.github.io.git
 2. cd docker/mongodb/3.6_single_node
 3. docker-compose.exe up -d
 4. connect your application to the port #27017
 5. enjoy !

## Next
 * use mydb;
 * db.myCollection.insertOne({properties:"value"});
