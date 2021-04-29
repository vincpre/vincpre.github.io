import requests
from requests.auth import HTTPDigestAuth

BASE_URL = 'http://mongodb-mms-1.prod.svc.darva.prive:8080/api/public/v1.0'
ORG_ID = '5b62f97d10a9388742a956a9'
ATLAS_USER = 'vpre294'
ATLAS_USER_KEY = 'b34cbdec-7fd3-4b0d-ada1-f36434431961'
auth = HTTPDigestAuth(ATLAS_USER, ATLAS_USER_KEY)

# Retrieve all projects
response = requests.get(f"{BASE_URL}/orgs/{ORG_ID}/groups", auth=auth).json()
projects = response['results']

# Retrieve all automation configuration files
config_per_project_to_edit = {}
for project in projects:
    config = requests.get(f"{BASE_URL}/groups/{project['id']}/automationConfig", auth=auth).json()
    agent_update_path = config.get('agentVersion', {}).get('directoryUrl')
    if '8080' in (agent_update_path or ''):
        print(f"{project['name']} | {project['id']}")
        config_per_project_to_edit[project['id']] = config

headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}
import json
for project_id, config in config_per_project_to_edit.items():
    config['agentVersion']['directoryUrl'] = 'https://mongodb-mms.prod.svc.darva.prive/download/agent/automation/'
    config_json = json.dumps(config)
    reponse=requests.put(f"{BASE_URL}/groups/{project_id}/automationConfig", data=config_json, auth=auth, headers=headers)
    print(reponse.text)



