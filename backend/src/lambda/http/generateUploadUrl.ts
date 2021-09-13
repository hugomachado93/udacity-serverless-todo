import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as uuid from 'uuid'

import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { generateUploadUrl, updateAttachmentUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const attachmentId = uuid.v4()
  
    const uploadUrl = await generateUploadUrl(attachmentId)
  
    await updateAttachmentUrl(userId, todoId, attachmentId)
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl
      })
    }
  }
)

handler
.use(httpErrorHandler())
.use(
  cors({
    credentials: true
  })
)
