import { AVAILABLE_PLATFORMS } from './constants'

export function sanitizeVersion(version: string): string | undefined {
  // if it start with app-name-v1.0.0, get the version.
  // If there is a string name, assume a `v` char.
  const semanticV = version.split('v').pop()

  return semanticV
}

export function checkPlatform(
  platform: string,
  fileName: string,
): string | undefined {
  const extension = extname(fileName)

  // OSX we should have our .app tar.gz
  if (
    (fileName.includes('.app') ||
      fileName.includes('darwin') ||
      fileName.includes('osx')) &&
    extension === 'gz' &&
    platform === AVAILABLE_PLATFORMS.MacOS
  ) {
    return 'darwin'
  }

  // Windows 64 bits
  if (
    (fileName.includes('x64') || fileName.includes('win64')) &&
    (extension === 'zip' || extension === 'msi') &&
    platform === AVAILABLE_PLATFORMS.Win64
  ) {
    return 'win64'
  }

  // Windows 32 bits
  if (
    (fileName.includes('x32') || fileName.includes('win32')) &&
    extension === 'zip' &&
    platform === AVAILABLE_PLATFORMS.Win32
  ) {
    return 'win32'
  }

  // Linux app image
  if (
    fileName.includes('AppImage') &&
    extension === 'gz' &&
    platform === AVAILABLE_PLATFORMS.Linux
  ) {
    return 'linux'
  }
}

function extname(filename: string) {
  return filename.split('.').pop() || ''
}

export async function findAssetSignature(
  fileName: string,
  assets: any[],
): Promise<string | null> {
  // check in our assets if we have a file: `fileName.sig`
  // by example fileName can be: App-1.0.0.zip

  const foundSignature = assets.find(
    (asset) => asset.name.toLowerCase() === `${fileName.toLowerCase()}.sig`,
  )

  if (!foundSignature) {
    return null
  }

  const response = await fetch(foundSignature.browser_download_url)
  if (response.status !== 200) {
    return null
  }
  const signature = await response.text()
  return signature
}

export function validatePlatform(platform: string): string | undefined {
  switch (platform) {
    case AVAILABLE_PLATFORMS.MacOS:
    case AVAILABLE_PLATFORMS.Win32:
    case AVAILABLE_PLATFORMS.Win64:
    case AVAILABLE_PLATFORMS.Linux:
      return platform
  }
}
