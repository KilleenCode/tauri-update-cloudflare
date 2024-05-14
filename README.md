# Tauri Update Server: Cloudflare

## Overview
This tool allows you to easily take advantage of Tauri's dynamic update server capabilities using Cloudflare Workers. This project is a fork of [KilleenCode/tauri-update-cloudflare](https://github.com/KilleenCode/tauri-update-cloudflare), which hasn't been maintained for a while. This fork aims to keep the project up-to-date with the latest Tauri and Cloudflare Workers APIs.

## Configuration
Wrangler.toml variables:
- `GITHUB_ACCOUNT`: GitHub account name (e.g. `mackenly`)
- `GITHUB_REPO`: GitHub repository name (e.g. `my-tauri-app`)

This project works with private GitHub repositories. To enable this, you need to set the `GITHUB_API_TOKEN` secret in your GitHub repository and it will be picked up by the deployment action. Alternatively, add the secret [manually](https://developers.cloudflare.com/workers/configuration/secrets/#add-secrets-to-your-project) for manual deployments. This token should have the `repo` permission. Create a new token [here](https://github.com/settings/tokens/new).

## Deployment
### With CI/CD GitHub Actions
CI/CD via GitHub Actions is set up to test and lint the code. CD requires the repository owner to set two repository secrets:
- `CF_API_TOKEN` - Cloudflare API token (requires 'Edit Cloudflare Workers' permission template)
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID

### Manual Deployment
1. Install dependencies: `npm install` and ensure `wrangler` [is installed](https://developers.cloudflare.com/workers/wrangler/install-and-update/).
2. Run `npm run test` to ensure the code is working as expected.
3. Run `wrangler publish` to deploy the code to Cloudflare Workers.

## Usage with Tauri
### Tauri >= v1.0.0-rc5:

use `https://your-update-server.com/v1` route

Read the [Tauri documentation](https://tauri.app/v1/guides/distribution/updater#tauri-configuration) for more information. For an example usage, see [Brancato config](https://github.com/KilleenCode/brancato/blob/main/src-tauri/tauri.conf.json#L55).

### Legacy
use `https://your-update-server.com/`

## Disclaimer
Not affiliated with Rust, Tauri, or Cloudflare. Use at your own risk and follow the [license](./LICENSE).