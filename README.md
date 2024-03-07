# CDK TypeScript project

This is simple project using CDK, TypeScript, Lambda, and DynamoDB

## Project Structure

- The `cdk.json` file tells the CDK Toolkit how to execute the app.
- The `lib` dir contains the stack and resource definitions
- The `functions` dir contains the methods used in the Lambda functions
- The `bin` dir contains the entry point for the CDK app

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template

## Lambda Functions Overview

This CDK TypeScript project includes Lambda functions designed to interact with DynamoDB and send notification emails via AWS SES upon certain triggers. Located in the `functions` directory, these functions are central to the application's operations:

- **Request Handler**: The main Lambda function (`handler`) processes incoming API Gateway events. It supports two primary operations based on the HTTP method:
  - **GET**: Fetches a user's entry from the DynamoDB table using their username.
  - **POST**: Saves a new entry to DynamoDB with details provided in the request body. Upon successful save, it sends a notification email using SES to inform about the new entry.

This setup demonstrates a serverless architecture utilizing AWS services for database management and email notifications, making the application scalable and efficient.
