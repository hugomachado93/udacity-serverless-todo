import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { createTodo } from '../../businessLogic/todos'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('createTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Create todo', { event })

    const userId = getUserId(event)
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
  
    const newItem = await createTodo(userId, newTodo)
  
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)