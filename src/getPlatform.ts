import {
  ARCH_FILTERS,
  AVAILABLE_ARCHITECTURES,
  AVAILABLE_PLATFORMS,
  PLATFORM_FILTERS,
} from './constants'
import { fileExt } from './utils/fileExt'

export const testAsset = (
  target: AVAILABLE_PLATFORMS,
  arch: AVAILABLE_ARCHITECTURES,
  fileName: string,
): boolean => {
  const { matches, extension } = PLATFORM_FILTERS[target]
  const arch_matches = ARCH_FILTERS[arch]
  const rightArch =
    arch_matches && ARCH_FILTERS[arch].some((arch) => fileName.includes(arch))

  // .app gz files don't have arch in the name
  if (!rightArch && target !== AVAILABLE_PLATFORMS.MacOS) {
    return false
  }

  if (fileExt(fileName) !== extension) {
    return false
  }

  return matches.some((match) => fileName.includes(match))
}
