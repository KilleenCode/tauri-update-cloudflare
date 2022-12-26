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

const SendJSON = (data: Record<string, unknown>) => {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

const responses = {
  NotFound: () => new Response('Not found', { status: 404 }),
  NoContent: () => new Response(null, { status: 204 }),
  SendUpdate: (data: TauriUpdateResponse) =>
    SendJSON(data),
  SendJSON

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
  const proxy = GITHUB_TOKEN?.length;
  const downloadURL = proxy ? createProxiedFileUrl(match.browser_download_url, request) : match.browser_download_url
  const data: TauriUpdateResponse = {
    url: downloadURL,
    version: remoteVersion,
    notes: release.body,
    pub_date: release.published_at,
    signature,
  }

  return responses.SendUpdate(data)
}

const createProxiedFileUrl = (downloadURL: string, request: Request) => {

  const fileName = downloadURL.split('/')?.at(-1)
  if (!fileName) { throw new Error('Could not get file name from download URL') }


  const path = new URL(request.url)
  const root = `${path.protocol}//${path.host}`

  return new URL(`/latest/${fileName}`, root).toString()
}

const getLatestAssets = async (request: Request) => {
  const fileName = request.url.split('/')?.at(-1)
  if (!fileName) { throw new Error('Could not get file name from download URL') }

  const release = await getLatestRelease(request)
  const downloadPath = release.assets.find(({ name }) => name === fileName)?.browser_download_url

  if (!downloadPath) { throw new Error('Could not get file path from download URL') }

  const { readable, writable } = new TransformStream();
  const file_response = await fetch(downloadPath, {
    method: 'GET',
    redirect: 'follow'
  })

  file_response?.body?.pipeTo(writable);
  return new Response(readable, file_response);

}

export async function handleRequest(request: Request): Promise<Response> {
  const path = new URL(request.url).pathname


  if (path.includes('/latest')) {
    return getLatestAssets(request)
  }
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
