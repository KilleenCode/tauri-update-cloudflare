# Tauri Update Server: Cloudflare

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/killeencode/tauri-update-cloudflare)

## One-Click Deploy
1. Click the button above, let Cloudflare walk you through: it's easy!
2. Go to your forked repository, edit `wrangler.toml`:
    -  Update `GITHUB_ACCOUNT` and `GITHUB_REPO` to point to the Tauri project you're publishing releases from

Much credit to [@lemarier](https://github.com/lemarier) for the underlying logic at https://github.com/lemarier/updater-deno

## Tauri Version Support
### Tauri >= v1.0.0-rc5:

use `https://your-update-server.com/v1` route
For example usage, see [Brancato config](https://github.com/KilleenCode/brancato/blob/main/src-tauri/tauri.conf.json#L55)

### Legacy
use `https://your-update-server.com/`

## Cloudflare Wrangler

### 👩 💻 Developing

`wrangler dev`

[`src/index.ts`](./src/index.ts) calls the request handler in [`src/handler.ts`](./src/handler.ts), and will return the [request method](https://developer.mozilla.org/en-US/docs/Web/API/Request/method) for the given request.

### 🧪 Testing

This template comes with jest tests which simply test that the request handler can handle each request method. `npm test` will run your tests.

### 👀 Previewing and Publishing

`wrangler preview`
`wrangler publish`

For information on how to preview and publish your worker, please see the [Wrangler docs](https://developers.cloudflare.com/workers/tooling/wrangler/commands/#publish).
