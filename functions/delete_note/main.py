import boto3
import json

# create a dynamodb resource
dynamodb_resource = boto3.resource("dynamodb")
# create a dynamodb table object
table = dynamodb_resource.Table("lotion-30129329")


def delete_handler(event, context):
    print(event)
    http_method = event["requestContext"]["http"]["method"]
    if http_method == "DELETE":
        # get the email and id from the path parameters
        id = json.loads(event["body"])["id"]
        email = event["queryStringParameters"]["email"]
        print(id)
        print(email)
        table.delete_item(Key={"email": email, "id": id})

        return {
            "statusCode": 200,
            "headers": {
            "Access-Control-Allow-Headers": ["Content-Type", "Authorization"],
            "Access-Control-Allow-Methods": "DELETE"
            },
            "message": "Note Deleted"
        }
    else:
        return {
            "statusCode": 401,
            "message": "Bad Request"
        }
    
    

    

