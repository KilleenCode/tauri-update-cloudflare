/**
 * Get the file extension from a filename
 * @param filename ex: file.txt or file.json
 * @returns file extension
 */
export function fileExt(filename: string): string {
  const extName: string = filename.split('.').pop() || ''
  if (!extName || extName === filename) {
    throw new Error('No file extension found')
  }
  return extName
}
