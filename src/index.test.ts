import {
    createExecutionContext,
    waitOnExecutionContext
} from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import { Env } from '../worker-configuration';
// Could import any other source file/function here
import worker from '../src';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('handle GET', () => {
    it('responds with 200', async () => {
        const request = new IncomingRequest('http://example.com');
        // Create an empty context to pass to `worker.fetch()`
        const ctx = createExecutionContext();
        const env: Env = {
            GITHUB_ACCOUNT: 'killeencode',
            GITHUB_REPO: 'brancato'
        };
        const response = await worker.fetch(request, env, ctx);
        // Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
        await waitOnExecutionContext(ctx);
        expect(response.status).toBe(200);
    });
});
