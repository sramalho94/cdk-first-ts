# CDK TypeScript project

This is simple project using CDK, TypeScript, Lambda, and DynamoDB

## Project Structure

The `cdk.json` file tells the CDK Toolkit how to execute the app.
The `lib` dir contains the stack and resource definitions
The `functions` dir contains the methods used in the Lambda functions
The `bin` dir contains the entry point for the CDK app

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template
