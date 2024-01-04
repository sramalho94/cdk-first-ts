import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib'
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb'
import { Runtime, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkFirstTsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
  }
}
