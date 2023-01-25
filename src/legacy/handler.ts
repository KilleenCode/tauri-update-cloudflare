import { validatePlatform } from './validatePlatform'
import { checkPlatform } from './checkPlatform'
import { Asset, findAssetSignature, getReleases } from '../services/github'
import { TauriUpdateResponse } from '../types'
import { sanitizeVersion, semverGt, semverValid } from '../utils/versioning'

export const handleLegacyRequest = async (
  request: Request,
): Promise<Response> => {
  const path = new URL(request.url).pathname
  const [platform, version] = path.slice(1).split('/')

  const releases = await getReleases(request)

  const release = (await releases.clone().json()) as {
    tag_name: string
    assets: Asset[]
    body: string
    published_at: string
  }
  if (!platform || !validatePlatform(platform) || !version) {
    return releases
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
    const signature = await findAssetSignature(name, release.assets, request)
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
