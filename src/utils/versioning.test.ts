import { sanitizeVersion } from './versioning'
import { describe, it, expect } from 'vitest'

describe('sanitizeVersion', () => {
  it("removes the 'v' prefix from a version string", () => {
    expect(sanitizeVersion('v1.0.0')).toBe('1.0.0')
    expect(sanitizeVersion('1.0.0')).toBe('1.0.0')
  })
  it('throws error if the version string is empty', () => {
    expect(() => sanitizeVersion('')).toThrowError('No version found')
  })
})
