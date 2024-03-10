import { Handler } from 'aws-lambda'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import * as AWS from 'aws-sdk'
import * as nodemailer from 'nodemailer'

// Interface for ReqBody data
interface SaveRequestBody {
  username: string
  githubRepo: string
}

// Interface for DynamoDB entry
interface DynamoDBItem {
  username: string
  githubRepo: string
  date: number
}

// Configure DynamoDB
const dynamo = new DynamoDB.DocumentClient()
const TABLE_NAME: string = process.env.REQUEST_TABLE_NAME!

// Configure SES
const ses = new AWS.SES({ region: 'us-east-2' })
const transporter = nodemailer.createTransport({
  SES: { ses, aws: AWS }
})

// Handler function to check req method
export const handler: Handler<
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2
> = async (event, context) => {
  console.log('Received event:', JSON.stringify(event, null, 2))
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

async function save(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const body: SaveRequestBody = JSON.parse(event.body ?? '{}')
  const { username, githubRepo } = body

  // check for necessary values
  if (!username || !githubRepo) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required parameters' })
    }
  }

  const item: DynamoDBItem = {
    username: username,
    githubRepo: githubRepo,
    date: Date.now()
  }

  try {
    const savedItem = await saveItem(item)
    return {
      statusCode: 200,
      body: JSON.stringify(savedItem)
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    }
  }
}

async function getRequest(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const username = event.queryStringParameters?.username

  if (!username) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Username is required' })
    }
  }

  try {
    const item = await getItem(username)

    if (item !== undefined && item.date) {
      const d = new Date(item.date)

      const message = `Was requested on ${d.getDate()}/${
        d.getMonth() + 1
      }/${d.getFullYear()}`
      return {
        statusCode: 200,
        body: JSON.stringify(message)
      }
    } else {
      const message = 'Was not submitted'
      return {
        statusCode: 200,
        body: JSON.stringify(message)
      }
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    }
  }
}

async function getItem(username: string): Promise<DynamoDBItem | undefined> {
  const params: DynamoDB.DocumentClient.GetItemInput = {
    Key: {
      username: username
    },
    TableName: TABLE_NAME
  }

  return dynamo
    .get(params)
    .promise()
    .then((result) => {
      console.log(result)
      return result.Item as DynamoDBItem
    })
}

async function saveItem(item: DynamoDBItem): Promise<DynamoDBItem> {
  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: TABLE_NAME,
    Item: item
  }

  await dynamo.put(params).promise()

  await sendNotificationEmail(item)

  return dynamo
    .put(params)
    .promise()
    .then(() => {
      return item
    })
}

async function sendNotificationEmail(item: DynamoDBItem): Promise<void> {
  const emailParams = {
    from: 'stephanramalho@gmail.com',
    to: 'sramalho@fordham.edu',
    subject: 'New Entry Notification',
    html: `<p>New entry added: ${item.username} - ${item.githubRepo}</p>`
  }

  try {
    await transporter.sendMail(emailParams)
    console.log('Email sent successfully')
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}
