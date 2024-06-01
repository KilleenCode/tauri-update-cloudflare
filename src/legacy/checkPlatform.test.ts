import { checkPlatform } from './checkPlatform';
import { LEGACY_AVAILABLE_PLATFORMS } from './constants';
import { describe, it, expect } from 'vitest';

describe('checkPlatform', () => {
    it('should return "darwin" for MacOS .app tar.gz files', () => {
        expect(
            checkPlatform(LEGACY_AVAILABLE_PLATFORMS.MacOS, 'myApp.app.tar.gz')
        ).toBe('darwin');
        expect(
            checkPlatform(
                LEGACY_AVAILABLE_PLATFORMS.MacOS,
                'myApp.darwin.tar.gz'
            )
        ).toBe('darwin');
        expect(
            checkPlatform(LEGACY_AVAILABLE_PLATFORMS.MacOS, 'myApp.osx.tar.gz')
        ).toBe('darwin');
    });

    it('should return "win64" for Windows 64 bits zip files', () => {
        expect(
            checkPlatform(LEGACY_AVAILABLE_PLATFORMS.Win64, 'myApp.x64.zip')
        ).toBe('win64');
        expect(
            checkPlatform(LEGACY_AVAILABLE_PLATFORMS.Win64, 'myApp.win64.zip')
        ).toBe('win64');
    });

    it('should return "win32" for Windows 32 bits zip files', () => {
        expect(
            checkPlatform(LEGACY_AVAILABLE_PLATFORMS.Win32, 'myApp.x32.zip')
        ).toBe('win32');
        expect(
            checkPlatform(LEGACY_AVAILABLE_PLATFORMS.Win32, 'myApp.win32.zip')
        ).toBe('win32');
    });

    it('should return "linux" for Linux AppImage gz files', () => {
        expect(
            checkPlatform(
                LEGACY_AVAILABLE_PLATFORMS.Linux,
                'myApp.AppImage.tar.gz'
            )
        ).toBe('linux');
    });

    it('should return undefined for non-matching files', () => {
        expect(
            checkPlatform(LEGACY_AVAILABLE_PLATFORMS.MacOS, 'myApp.exe')
        ).toBeUndefined();
        expect(
            checkPlatform(LEGACY_AVAILABLE_PLATFORMS.Win64, 'myApp.app.tar.gz')
        ).toBeUndefined();
        expect(
            checkPlatform(
                LEGACY_AVAILABLE_PLATFORMS.Win32,
                'myApp.AppImage.tar.gz'
            )
        ).toBeUndefined();
        expect(
            checkPlatform(LEGACY_AVAILABLE_PLATFORMS.Linux, 'myApp.x64.zip')
        ).toBeUndefined();
    });
});
