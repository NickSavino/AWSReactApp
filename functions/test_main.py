from delete_note.main import *
from get_notes.main import *
from save_note.main import *

import sys
import time
import uuid
import json

sys.path.append("functions/delete-note")


def test_save_item():

    item = {
    "email": "nicksavino2@gmail.com",
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
    assert res["statusCode"] == 200
    assert res["body"] == "Note Saved"

    test_item = table.get_item(Key={"email": item["email"], "id": item["id"]})
    assert "Item" in test_item
    

def test_get_notes():
    event = {
        "httpMethod": "GET",
        "queryStringParameters": {
            "email": "nicksavino2@gmail.com"
        }
    }
    res = get_handler(event, None)
    assert res is not None
    assert res["statusCode"] == 200
    print(res["body"])
    notes = json.loads(res["body"])
    assert len(notes["notes"]) > 0
    


def test_update_notes():
    item = {
    "email": "nicksavino2@gmail.com",
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
        "email": "nicksavino2@gmail.com",
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


def test_delete_notes():
    item = {
    "email": "nicksavino2@gmail.com",
    "id": str(uuid.uuid4()),
    "title": "test title",
    "content": "test content",
    "date": "2023-03-08T20:56:55",
    "index": 0,
    }

    event = {
        "httpMethod": "DELETE",
        "queryStringParameters": {
            "email": item["email"],
            "id": item["id"]
        }
    }
    res = delete_handler(event, None)
    print(res)
    time.sleep(2)
    assert res is not None
    assert res["statusCode"] == 200
    assert res["body"] == "Note Deleted"

    test_item = table.get_item(Key={"email": item["email"], "id": item["id"]})
    assert "Item" not in test_item
    