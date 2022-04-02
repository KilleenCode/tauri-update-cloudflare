import semverValid from 'semver/functions/valid'
import semverGt from 'semver/functions/gt'

export function sanitizeVersion(version: string): string | undefined {
  // Works with or without v in version
  const semanticV = version.split('v').pop()
  return semanticV
}

export { semverGt }
export { semverValid }
