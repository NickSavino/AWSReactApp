import boto3

# create a dynamodb resource
dynamodb_resource = boto3.resource("dynamodb")
# create a dynamodb table object
table = dynamodb_resource.Table("lotion-30129329")


def delete_handler(event, context):
    print(event)
    http_method = event["httpMethod"]
    if http_method == "DELETE":
        # get the email and id from the path parameters
        email = event["queryStringParameters"]["email"]
        id = event["queryStringParameters"]["id"]
        table.delete_item(Key={"email": email, "id": id})

        return {
            "statusCode": 200,
            "body": "Note Deleted"
        }
    else:
        return {
            "statusCode": 401,
            "body": "Bad Request"
        }
    
    

    

