import { validatePlatform } from './validatePlatform';
import { LEGACY_AVAILABLE_PLATFORMS } from './constants';
import { describe, it, expect } from 'vitest';

describe('validatePlatform', () => {
    it('should return the platform if it is valid using enum', () => {
        expect(validatePlatform(LEGACY_AVAILABLE_PLATFORMS.MacOS)).toBe(LEGACY_AVAILABLE_PLATFORMS.MacOS);
        expect(validatePlatform(LEGACY_AVAILABLE_PLATFORMS.Win32)).toBe(LEGACY_AVAILABLE_PLATFORMS.Win32);
        expect(validatePlatform(LEGACY_AVAILABLE_PLATFORMS.Win64)).toBe(LEGACY_AVAILABLE_PLATFORMS.Win64);
        expect(validatePlatform(LEGACY_AVAILABLE_PLATFORMS.Linux)).toBe(LEGACY_AVAILABLE_PLATFORMS.Linux);
    });

    it('should return the platform if it is valid using string', () => {
        expect(validatePlatform('darwin')).toBe(LEGACY_AVAILABLE_PLATFORMS.MacOS);
        expect(validatePlatform('win32')).toBe(LEGACY_AVAILABLE_PLATFORMS.Win32);
        expect(validatePlatform('win64')).toBe(LEGACY_AVAILABLE_PLATFORMS.Win64);
        expect(validatePlatform('linux')).toBe(LEGACY_AVAILABLE_PLATFORMS.Linux);
    });

    it('should return undefined if the platform is not valid', () => {
        expect(validatePlatform('InvalidPlatform')).toBeUndefined();
        expect(validatePlatform('Linux')).toBeUndefined();
        expect(validatePlatform('Win64')).toBeUndefined();
        expect(validatePlatform('Mac')).toBeUndefined();
    });
});