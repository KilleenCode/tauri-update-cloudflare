export function fileExt(filename: string): string {
  return filename.split('.').pop() || ''
}
