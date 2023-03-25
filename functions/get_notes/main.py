import boto3
import json
from decimal import Decimal



# create a dynamodb resource
dynamodb_resource = boto3.resource("dynamodb")
# create a dynamodb table object
table = dynamodb_resource.Table("lotion-30129329")


def get_handler(event, context):
    try:
        print(event)
        email = event["queryStringParameters"]["email"]
        #token = event["headers"]["Authorization"]
        #print(token)
        print(email)
        
        httpMethod = event["requestContext"]["http"]["method"]
        if httpMethod == "GET":
            
            response = table.query(
                KeyConditionExpression=" email = :email",
                ExpressionAttributeValues={ ":email": email },
            )
    
            items = response["Items"]
            for item in items:
                for key, value in item.items():
                    if isinstance(value, Decimal):
                        item[key] = str(value)
            return {
                'statusCode': 200,
                "headers": {
                
                "Access-Control-Allow-Headers": ["Content-Type", "Authorization"],
                "Access-Control-Allow-Methods": "GET"
                },
                'body': json.dumps({
                    'notes': items
                })
            }
        else:
            return {
                "statusCode": 400,
                "body": "Bad Request"
            }
            
    except ValueError:
        pass
    return {
        'statusCode': 401,
        'body': 'Invalid Token'
    }