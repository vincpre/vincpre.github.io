docker run -it brod bash
/scripts/backup.sh -u "mongodb://localhost:27017/local" -t "essai"

docker image build -t nexus3.prod.svc.darva.prive:5000/transverse/mdbr:0.0.1 .
docker run -it --volume //d/Users/vpre294/Documents/git/vincpre/mdbr/data:/data/db nexus3.prod.svc.darva.prive:5000/transverse/mdbr:0.0.1
