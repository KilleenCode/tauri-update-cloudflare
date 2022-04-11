import { testAsset } from './getPlatform'
import semverValid from 'semver/functions/valid'
import semverGt from 'semver/functions/gt'
import { AVAILABLE_ARCHITECTURES, AVAILABLE_PLATFORMS } from './constants'
import { handleLegacyRequest } from './legacy/handler'
import { findAssetSignature, getLatestRelease } from './services/github'
import { TauriUpdateResponse } from './types'
import { sanitizeVersion } from './utils/versioning'

declare global {
  const GITHUB_ACCOUNT: string
  const GITHUB_REPO: string
  const GITHUB_TOKEN: string
}

const responses = {
  NotFound: () => new Response('Not found', { status: 404 }),
  NoContent: () => new Response(null, { status: 204 }),
  SendUpdate: (data: TauriUpdateResponse) =>
    new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    }),
}

type RequestPathParts = [
  string,
  AVAILABLE_PLATFORMS,
  AVAILABLE_ARCHITECTURES,
  string,
]
const handleV1Request = async (request: Request) => {
  const path = new URL(request.url).pathname
  const [, target, arch, appVersion] = path
    .slice(1)
    .split('/') as RequestPathParts

  if (!target || !arch || !appVersion || !semverValid(appVersion)) {
    return responses.NotFound()
  }
  const release = await getLatestRelease(request)

  const remoteVersion = sanitizeVersion(release.tag_name.toLowerCase())
  if (!remoteVersion || !semverValid(remoteVersion)) {
    return responses.NotFound()
  }

  const shouldUpdate = semverGt(remoteVersion, appVersion)
  if (!shouldUpdate) {
    return responses.NoContent()
  }

  const match = release.assets.find(({ name }) => {
    const test = testAsset(target, arch, name)

    return test
  })

  if (typeof match === 'undefined') {
    return responses.NotFound()
  }

  const signature = await findAssetSignature(match.name, release.assets)
  const data: TauriUpdateResponse = {
    url: match.browser_download_url,
    version: remoteVersion,
    notes: release.body,
    pub_date: release.published_at,
    signature,
  }

  return responses.SendUpdate(data)
}

export async function handleRequest(request: Request): Promise<Response> {
  const path = new URL(request.url).pathname
  const version = path.slice(1).split('/')[0]

  if (version.includes('v')) {
    switch (version) {
      case 'v1':
      default:
        return handleV1Request(request)
    }
  }

  return handleLegacyRequest(request)
}
