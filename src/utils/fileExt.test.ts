import { fileExt } from './fileExt'
import { describe, it, expect } from 'vitest'

describe('fileExt', () => {
  it('returns the file extension', () => {
    expect(fileExt('file.txt')).toBe('txt')
    expect(fileExt('file.json')).toBe('json')
    expect(fileExt('file.tar.gz')).toBe('gz')
  })
  it('throws an error if no file extension is found', () => {
    expect(() => fileExt('file')).toThrowError('No file extension found')
  })
  it('throws an error when no file is provided', () => {
    expect(() => fileExt('')).toThrowError('No file extension found')
  })
})
