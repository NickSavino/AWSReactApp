import boto3
import json
from decimal import Decimal

# create a dynamodb resource
dynamodb_resource = boto3.resource("dynamodb")
# create a dynamodb table object
table = dynamodb_resource.Table("lotion-30129329")


def get_handler(event, context):

    httpMethod = event["httpMethod"]
    if httpMethod == "GET":
        email = event["queryStringParameters"]["email"]
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
            'body': json.dumps({
                'notes': items
            })
        }
    else:
        return {
            "statusCode": 401,
            "body": "Bad Request"
        }