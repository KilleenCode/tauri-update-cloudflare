import { LEGACY_AVAILABLE_PLATFORMS } from './constants';
import { fileExt } from '../utils/fileExt';

export function checkPlatform(
    platform: string,
    fileName: string
): string | undefined {
    const extension = fileExt(fileName);
    // OSX we should have our .app tar.gz
    if (
        (fileName.includes('.app') ||
            fileName.includes('darwin') ||
            fileName.includes('osx')) &&
        extension === 'gz' &&
        platform === LEGACY_AVAILABLE_PLATFORMS.MacOS
    ) {
        return 'darwin';
    }

    // Windows 64 bits
    if (
        (fileName.includes('x64') || fileName.includes('win64')) &&
        extension === 'zip' &&
        platform === LEGACY_AVAILABLE_PLATFORMS.Win64
    ) {
        return 'win64';
    }

    // Windows 32 bits
    if (
        (fileName.includes('x32') || fileName.includes('win32')) &&
        extension === 'zip' &&
        platform === LEGACY_AVAILABLE_PLATFORMS.Win32
    ) {
        return 'win32';
    }

    // Linux app image
    if (
        fileName.includes('AppImage') &&
        extension === 'gz' &&
        platform === LEGACY_AVAILABLE_PLATFORMS.Linux
    ) {
        return 'linux';
    }
}
