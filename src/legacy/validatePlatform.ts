import { LEGACY_AVAILABLE_PLATFORMS } from './constants'

export function validatePlatform(platform: string): string | undefined {
  switch (platform) {
    case LEGACY_AVAILABLE_PLATFORMS.MacOS:
    case LEGACY_AVAILABLE_PLATFORMS.Win32:
    case LEGACY_AVAILABLE_PLATFORMS.Win64:
    case LEGACY_AVAILABLE_PLATFORMS.Linux:
      return platform
  }
}
