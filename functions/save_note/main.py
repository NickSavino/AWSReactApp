import boto3

# create a dynamodb resource
dynamodb_resource = boto3.resource("dynamodb")
# create a dynamodb table object
table = dynamodb_resource.Table("lotion-30129329")

def save_handler(event, context):
    print(event)
    http_method = event["httpMethod"]
    if http_method == "POST":
        note = event["queryStringParameters"]["note"]
        # save the note to the dynamodb table, updates if it exists
        res = table.get_item(Key={"email": note["email"], "id": note["id"]})
        if "Item" in res:
            print("updating item")
            update_item(note)
            return {
            "statusCode": 200,
            "body": "Note Updated"
        }
        else:
            print("new item")
            add_item(note)
            return {
            "statusCode": 200,
            "body": "Note Saved"
            }
    else:
        return {
            "statusCode": 401,
            "body": "Bad Request"
        }
    
def add_item(note):
    # add a new item to the table
    return table.put_item(Item=note)

def update_item(note):
    # update an existing item in the table
    return table.update_item(
        Key={"email": note["email"], "id": note["id"]},
        UpdateExpression="set title=:title, content=:content, #d=:date, #i=:index",
        ExpressionAttributeValues={":title": note["title"], ":content": note["content"], ":date": note["date"], ":index": note["index"]},
        ExpressionAttributeNames={"#d": "date", "#i": "index"},
    )
