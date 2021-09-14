import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { createTodo } from '../../businessLogic/todos'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

const logger = createLogger('todos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    logger.info(`event ${event.body}`)
  
    if(!newTodo.name) {
      return {
        statusCode: 400,
        body: JSON.stringify("Todo can't be empty")
      }
    }

    const newItem = await createTodo(userId, newTodo)
  
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
  }
)

handler
.use(
  cors({
    credentials: true
  })
)