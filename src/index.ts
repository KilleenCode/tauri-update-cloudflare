import { handleRequest } from './handler'
import { Request, ExecutionContext } from '@cloudflare/workers-types'
import { Env } from '../worker-configuration'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return handleRequest(request, env, ctx)
  },
}
