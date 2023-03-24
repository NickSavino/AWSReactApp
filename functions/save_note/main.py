import boto3
import json

# create a dynamodb resource
dynamodb_resource = boto3.resource("dynamodb")
# create a dynamodb table object
table = dynamodb_resource.Table("lotion-30129329")

def save_handler(event, context):
   
    print(event)
    http_method = event["requestContext"]["http"]["method"]
    

    
    if http_method == "POST":
        note = json.loads(event["body"])
        email = event["queryStringParameters"]["email"]
        print("email")
        print(note)
        # save the note to the dynamodb table, updates if it exists
        res = table.get_item(Key={"email": email, "id": note["id"]})
        if "Item" in res:
            print("updating item")
            
            update_item(note, email)
            return {
            "statusCode": 200,
            "headers": {
            "Access-Control-Allow-Headers": ["Content-Type", "Authorization"],
            "Access-Control-Allow-Methods": "POST"
            },
            "message": "Note Updated"
        }
        else:
            print("new item")
            add_item(note, email)
            return {
            "statusCode": 200,
            "headers": {
      
            "Access-Control-Allow-Headers": ["Content-Type", "Authorization"],
            "Access-Control-Allow-Methods": "POST"
            },
            "message": "Note Saved"
            }
    else:
        return {
            "statusCode": 400,
            "message": "Bad Request"
        }
    
def add_item(note, email):
    # add a new item to the table
    note["email"] = email
    return table.put_item(Item=note)

def update_item(note, email):
    # update an existing item in the table
    return table.update_item(
        Key={"email": email, "id": note["id"]},
        UpdateExpression="set title=:title, content=:content, #d=:date",
        ExpressionAttributeValues={":title": note["title"], ":content": note["content"], ":date": note["date"], },
        ExpressionAttributeNames={"#d": "date", },
    )
