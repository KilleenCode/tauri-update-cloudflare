import {
  checkPlatform,
  findAssetSignature,
  sanitizeVersion,
  validatePlatform,
} from './getPlatform'
import semverValid from 'semver/functions/valid'
import semverGt from 'semver/functions/gt'

const GITHUB_ACCOUNT = 'killeencode'
const GITHUB_REPO = 'brancato'
export async function handleRequest(request: Request): Promise<Response> {
  const path = new URL(request.url).pathname
  const [platform, version] = path.slice(1).split('/')
  if (!platform || !validatePlatform(platform) || !version) {
    return new Response('Not found', { status: 404 })
  }
  const reqUrl = new URL(
    `https://api.github.com/repos/${GITHUB_ACCOUNT}/${GITHUB_REPO}/releases/latest`,
  )
  const headers = new Headers({
    Accept: 'application/vnd.github.preview',
    'User-Agent': request.headers.get('User-Agent') as string,
  })
  const release = (await fetch(reqUrl.toString(), {
    method: 'GET',
    headers,
  }).then((resp) => resp.json())) as {
    tag_name: string
    assets: any
    body: any
    published_at: string
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

    return new Response(
      JSON.stringify({
        name: release.tag_name,
        notes: release.body,
        pub_date: release.published_at,
        signature,
        url: browser_download_url,
      }),
      { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
    )
  }

  return new Response(JSON.stringify({ remoteVersion, version, shouldUpdate }))
}
