export enum AVAILABLE_PLATFORMS {
  MacOS = 'darwin',
  Windows = 'windows',
  Linux = 'linux',
}

export enum AVAILABLE_ARCHITECTURES {
  x64 = 'x86_64',
  x86 = 'i686',
  arm64 = 'aarch64',
  armv7 = 'armv7',
}

//TODO: check if this is correct
export const ARCH_FILTERS = {
  [AVAILABLE_ARCHITECTURES.x64]: ['x64', 'amd64'],
  [AVAILABLE_ARCHITECTURES.x86]: ['x86'],
  [AVAILABLE_ARCHITECTURES.arm64]: ['arm64'],
  [AVAILABLE_ARCHITECTURES.armv7]: ['armv7'],
} as { [key in AVAILABLE_ARCHITECTURES]: string[] }

export type Filter = {
  extension: string
  matches: string[]
}
export const PLATFORM_FILTERS = {
  [AVAILABLE_PLATFORMS.MacOS]: {
    extension: 'gz',
    matches: ['.app', 'osx'],
  },
  [AVAILABLE_PLATFORMS.Windows]: {
    extension: 'zip',
    matches: ['x64', 'x32'],
  },
  [AVAILABLE_PLATFORMS.Linux]: {
    extension: 'gz',
    matches: ['AppImage'],
  },
} as {
  [key in AVAILABLE_PLATFORMS]: Filter
}
