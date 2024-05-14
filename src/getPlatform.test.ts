import { AVAILABLE_PLATFORMS, AVAILABLE_ARCHITECTURES } from './constants';
import { testAsset } from './getPlatform';
import { describe, it, expect } from 'vitest';

describe('testAsset', () => {
    it('returns true for matching platform, architecture, and file extension', () => {
        const target = AVAILABLE_PLATFORMS.Windows;
        const arch = AVAILABLE_ARCHITECTURES.x86;
        const fileName = 'example-x86.zip';

        const result = testAsset(target, arch, fileName);

        expect(result).toBe(true);
    });

    it('returns false for non-matching platform', () => {
        const target = AVAILABLE_PLATFORMS.Linux;
        const arch = AVAILABLE_ARCHITECTURES.x86;
        const fileName = 'example-x86.zip';

        const result = testAsset(target, arch, fileName);

        expect(result).toBe(false);
    });

    it('returns false for non-matching architecture', () => {
        const target = AVAILABLE_PLATFORMS.Windows;
        const arch = AVAILABLE_ARCHITECTURES.arm64;
        const fileName = 'example-x86.zip';

        const result = testAsset(target, arch, fileName);

        expect(result).toBe(false);
    });

    it('returns false for non-matching file extension', () => {
        const target = AVAILABLE_PLATFORMS.Windows;
        const arch = AVAILABLE_ARCHITECTURES.x86;
        const fileName = 'example-x86.gz';

        const result = testAsset(target, arch, fileName);

        expect(result).toBe(false);
    });
});
