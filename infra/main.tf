terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source  = "hashicorp/aws"
    }
  }
}

# specify the provider region
provider "aws" {
  region = "ca-central-1"
}


locals {
  function_type = "lotion-lambda"
  artifact_name = "lambdas/package.zip"
}

# Create an S3 bucket
resource "aws_s3_bucket" "lotion-plus" { 
  tags = { Name = "lotion-plus" } 
  bucket = "lotion-plus"
}

# output the name of the bucket after creation
output "bucket_name" {
  value = aws_s3_bucket.lotion-plus.bucket
}


# create a role for the Lambda function to assume
# every service on AWS that wants to call other 
# AWS services should first assume a role and
# then any policy attached to the role will give permissions
# to the service so it can interact with other AWS services
resource "aws_iam_role" "lotion-plus" {
  name               = "iam-for-lambda-${local.function_type}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

# resource "aws_iam_user_policy" "dynamo-perms" {
#   name = "dynamo-perms"

#   policy = <<EOF
#   {
#     "Version": "2012-10-17",
#     "Statement": [
#         {
#             "Sid": "VisualEditor0",
#             "Effect": "Allow",
#             "Action": [
#                 "dynamodb:PutItem",
#                 "dynamodb:DeleteItem",
#                 "dynamodb:GetItem",
#                 "dynamodb:Query",
#                 "dynamodb:UpdateItem"
#             ],
#             "Resource": "arn:aws:dynamodb:ca-central-1:214547864366:table/lotion-30129329"
#         }
#     ]
# }
# EOF
# }

# resource "aws_iam_user_policy_attachment" "dynamo-perms" {
#   role = aws_iam_role.lotion-plus.arn
#   policy_arn = aws_iam_role_policy.dynamo-perms.arn
# }

resource "aws_iam_policy" "url-invoke" {
  name = "lamba-url-invoke"
  description = "Allow lambda to invoke other lambda functions"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "lambda:InvokeFunctionUrl",
            "Resource": [
                "arn:aws:lambda:ca-central-1:214547864366:function:get-notes-30129329",
                "arn:aws:lambda:ca-central-1:214547864366:function:delete-note-30129329",
                "arn:aws:lambda:ca-central-1:214547864366:function:save-note-30129329"
            ],
            "Condition": {
                "StringEquals": {
                    "lambda:FunctionUrlAuthType": "NONE"
                }
            }
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "url-invoke" {
  role       = aws_iam_role.lotion-plus.name
  policy_arn = aws_iam_policy.url-invoke.arn
}



#  delete note lambda function
resource "aws_lambda_function" "delete-note" {
  s3_bucket = aws_s3_bucket.lotion-plus.bucket
  # the artifact needs to be in the bucket first. Otherwise, this will fail.
  s3_key        = local.artifact_name
  role          = aws_iam_role.lotion-plus.arn
  function_name = "delete-note-30129329"
  handler       = "functions/delete_note/main.delete_handler"

  runtime = "python3.9"

  tags = { Name = "delete-note" }
}

# Create Function URL for delete-note lambda function
resource "aws_lambda_function_url" "delete-url" {
  function_name = aws_lambda_function.delete-note.function_name
  authorization_type = "NONE"
  

  cors {
    allow_credentials = true
    allow_origins = ["http://localhost:3000"]
    allow_methods = ["DELETE"]
    expose_headers = ["keep-alive", "date"]
    allow_headers = ["content-type", "authorization"]
  }
}

output "delete_url" {
  value = aws_lambda_function_url.delete-url.function_url
}

#  get-notes lambda function
resource "aws_lambda_function" "get-notes" {
  s3_bucket = aws_s3_bucket.lotion-plus.bucket
  # the artifact needs to be in the bucket first. Otherwise, this will fail.
  s3_key        = local.artifact_name
  role          = aws_iam_role.lotion-plus.arn
  function_name = "get-notes-30129329"
  handler       = "functions/get_notes/main.get_handler"

  runtime = "python3.9"

  tags = { Name = "get-notes" }
}

# Create Function URL for get-notes lambda function
resource "aws_lambda_function_url" "get-url" {
  function_name = aws_lambda_function.get-notes.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins = ["http://localhost:3000"]
    allow_methods = ["GET"]
    allow_headers = ["content-type", "authorization"]
    expose_headers = ["keep-alive", "date"]
  }
}

output "get_url" {
  value = aws_lambda_function_url.get-url.function_url
}


#  save note lambda function
resource "aws_lambda_function" "save-note" {
  s3_bucket = aws_s3_bucket.lotion-plus.bucket
  # the artifact needs to be in the bucket first. Otherwise, this will fail.
  s3_key        = local.artifact_name
  role          = aws_iam_role.lotion-plus.arn
  function_name = "save-note-30129329"
  handler       = "functions/save_note/main.save_handler"

  runtime = "python3.9"

  tags = { 
    Name = "save-note"
   }
}

# Create Function URL for save-note lambda function
resource "aws_lambda_function_url" "save-url" {
  function_name = aws_lambda_function.save-note.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins = ["http://localhost:3000"]
    allow_methods = ["POST"]
    allow_headers = ["content-type", "authorization"]
    expose_headers = ["keep-alive", "date"]
  }
}

output "save_url" {
  value = aws_lambda_function_url.save-url.function_url
}

### Dynamo db table
resource "aws_dynamodb_table" "notes" {
  name           = "lotion-30129329"
  billing_mode   = "PROVISIONED"

   # up to 8KB read per second (eventually consistent)
  read_capacity = 1

  # up to 1KB per second
  write_capacity = 1

  hash_key = "email"
  range_key = "id"
  

  attribute {
    name = "email"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }
  
}


# create a policy for publishing logs to CloudWatch
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy
resource "aws_iam_policy" "logs" {
  name        = "lambda-logging-lotion"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

# attach the above policy to the function role
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment
resource "aws_iam_role_policy_attachment" "lotion_logs" {
  role       = aws_iam_role.lotion-plus.name
  policy_arn = aws_iam_policy.logs.arn
}



