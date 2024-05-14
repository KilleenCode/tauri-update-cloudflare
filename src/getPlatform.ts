import {
    ARCH_FILTERS,
    AVAILABLE_ARCHITECTURES,
    AVAILABLE_PLATFORMS,
    PLATFORM_FILTERS
} from './constants';
import { fileExt } from './utils/fileExt';

export function testAsset(
    target: AVAILABLE_PLATFORMS,
    arch: AVAILABLE_ARCHITECTURES,
    fileName: string
): boolean {
    const { matches, extension } = PLATFORM_FILTERS[target];
    const arch_matches = ARCH_FILTERS[arch];
    const rightArch =
        arch_matches &&
        ARCH_FILTERS[arch].some((arch) => fileName.includes(arch));

    // .app gz files don't have arch in the name
    if (!rightArch && target !== AVAILABLE_PLATFORMS.MacOS) {
        console.error(`File ${fileName} has wrong architecture`);
        return false;
    }

    if (fileExt(fileName) !== extension) {
        console.error(`File ${fileName} has wrong extension`);
        return false;
    }

    return matches.some((match) => fileName.includes(match));
}
