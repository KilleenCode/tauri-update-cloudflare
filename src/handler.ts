import {
  Asset,
  checkPlatform,
  findAssetSignature,
  sanitizeVersion,
  validatePlatform,
} from './getPlatform'
import semverValid from 'semver/functions/valid'
import semverGt from 'semver/functions/gt'

type TauriUpdateResponse = {
  url: string
  version: string
  notes?: string
  pub_date?: string
  signature?: string
}

declare global {
  const GITHUB_ACCOUNT: string
  const GITHUB_REPO: string
}

export async function handleRequest(request: Request): Promise<Response> {
  const path = new URL(request.url).pathname
  const [platform, version] = path.slice(1).split('/')

  const reqUrl = new URL(
    `https://api.github.com/repos/${GITHUB_ACCOUNT}/${GITHUB_REPO}/releases/latest`,
  )
  const headers = new Headers({
    Accept: 'application/vnd.github.preview',
    'User-Agent': request.headers.get('User-Agent') as string,
  })
  const releaseResponse = await fetch(reqUrl.toString(), {
    method: 'GET',
    headers,
  })

  const release = (await releaseResponse.clone().json()) as {
    tag_name: string
    assets: Asset[]
    body: string
    published_at: string
  }
  if (!platform || !validatePlatform(platform) || !version) {
    return releaseResponse
  }
  const remoteVersion = sanitizeVersion(release.tag_name.toLowerCase())

  if (!remoteVersion || !semverValid(remoteVersion)) {
    return new Response('Not found', { status: 404 })
  }

  const shouldUpdate = semverGt(remoteVersion, version)
  if (!shouldUpdate) {
    return new Response(null, { status: 204 })
  }

  for (const asset of release.assets) {
    const { name, browser_download_url } = asset
    const findPlatform = checkPlatform(platform, name)
    if (!findPlatform) {
      continue
    }

    // try to find signature for this asset
    const signature = await findAssetSignature(name, release.assets)
    const data: TauriUpdateResponse = {
      url: browser_download_url,
      version: remoteVersion,
      notes: release.body,
      pub_date: release.published_at,
      signature,
    }
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  }

  return new Response(JSON.stringify({ remoteVersion, version, shouldUpdate }))
}
