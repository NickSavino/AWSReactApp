from delete_note.main import *
from get_notes.main import *
from save_note.main import *

import sys
import time
import uuid
import json
import requests

sys.path.append("functions/delete-note")


def test_save_note():

    item = {

    "id": str(uuid.uuid4()),
    "title": "test title",
    "content": "test content",
    "date": "2023-03-08T20:56:55",
    "index": 0,
    }

    url = "https://gf4wtjogzcubvg7ix4262gphjm0coeto.lambda-url.ca-central-1.on.aws/"
    params = {
        "email": "nicksavino2@gmail.com"
    }
    headers = {
        "Content-Type": "application/json",
    }

    res = requests.post(url, params=params, headers=headers, data=json.dumps({"note": item}))
    assert res.status_code == 200

    test_item = table.get_item(Key={"email": item["email"], "id": item["id"]})
    assert "Item" in test_item
    

def test_get_notes():
    url = "https://sgejw7hxcl2axnzjjdmlmai6ua0wghyw.lambda-url.ca-central-1.on.aws/"
    params = {
        "email": "nicksavino2@gmail.com"
    }
    headers = {
        "Content-Type": "application/json",
    }

    res = requests.get(url, params=params, headers=headers)
    print(res)
    #res = get_handler(event, None)
    
    assert res.status_code == 200
    print(res.json())
    notes = res.json()
    assert len(notes["notes"]) > 0
    


def test_update_notes():
    item = {
    "id": str(uuid.uuid4()),
    "title": "test title",
    "content": "test content",
    "date": "2023-03-08T20:56:55",
    "index": 0,
    }
    event = {
        "httpMethod": "POST",
        "queryStringParameters": {
            "note": item
        }
    }
    res = save_handler(event, None)
    assert res is not None
    time.sleep(1)

    updated_item = {
        "id": item["id"],
        "title": "updated title test new",
        "content": "updated content new",
        "date": "2026-05-08T20:56:55",
        "index": 0,
    }
    event = {
        "httpMethod": "POST",
        "queryStringParameters": {
            "note": item
        }
    }
    res = save_handler(event, None)
    
    assert res is not None
    assert res["statusCode"] == 200
    assert res["body"] == "Note Updated"


def test_delete_note():
    item = {
    "id": str(uuid.uuid4()),
    "title": "test title",
    "content": "test content",
    "date": "2023-03-08T20:56:55",
    "index": 0,
    }

    params = {
        "email": "nicksavino2@gmail.com"
    }
    headers = {
        "Content-Type": "application/json",
    }
    

    url = "https://gf4wtjogzcubvg7ix4262gphjm0coeto.lambda-url.ca-central-1.on.aws/"
    res = requests.post(url, params=params, headers=headers, data=json.dumps({"id": item}))
    assert res.status_code == 200
    url = "https://ewizljkbzulolp2odlimtrdakm0snxnp.lambda-url.ca-central-1.on.aws/"
    
    res = requests.delete(url=url, params=params, headers=headers, data=json.dumps({"note": item}))
    print(res)
    time.sleep(2)
    assert res.status_code == 200
    assert res.raw.read() == b"Note Deleted"

    test_item = table.get_item(Key={"email": item["email"], "id": item["id"]})
    assert "Item" not in test_item
    