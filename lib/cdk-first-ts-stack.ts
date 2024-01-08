import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib'
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb'
import { Runtime, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as path from 'path'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkFirstTsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // Dynamodb table definition
    const table = new Table(this, 'Request', {
      partitionKey: { name: 'username', type: AttributeType.STRING }
    })

    // lambda function
    const dynamoLambda = new NodejsFunction(this, 'DynamoLambdaHandler', {
      runtime: Runtime.NODEJS_18_X,
      entry: path.join(__dirname, `/../functions/function.ts`),
      handler: 'handler',
      environment: {
        REQUEST_TABLE_NAME: table.tableName
      }
    })

    // permissions to lambda to dynamo table
    table.grantReadWriteData(dynamoLambda)

    const myFunctionUrl = dynamoLambda.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*']
      }
    })

    new CfnOutput(this, 'FunctionUrl', {
      value: myFunctionUrl.url
    })
  }
}
