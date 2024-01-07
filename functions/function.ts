import { Handler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'

const dynamo = new DynamoDB.DocumentClient()
const TABLE_NAME: string = process.env.REQUEST_TABLE_NAME!

export const hander: Handler = async (event, context) => {
  const method = event.requestContext.http.method

  if (method === 'GET') {
    return await getRequest(event)
  } else if (method === 'POST') {
    return await save(event)
  } else {
    return {
      statusCode: 400,
      body: 'Not a valid operation'
    }
  }
}
