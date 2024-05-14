import semverValid from 'semver/functions/valid';
import semverGt from 'semver/functions/gt';

/**
 * Normalize version string
 * @param version ex: v1.0.0 or 1.0.0
 * @returns normalized version string
 */
export function sanitizeVersion(version: string): string | undefined {
    // Works with or without v in version
    const semanticV = version.split('v').pop();
    if (!semanticV || semanticV.length === 0) {
        throw new Error('No version found');
    }
    return semanticV;
}

export { semverGt };
export { semverValid };
