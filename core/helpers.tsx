import base64url from 'base64url'

export const defaultTarget = encodeTarget(
  'https://gitlab.com/formation.tools/eng/engineering/-/raw/main/README.org',
)

export function encodeTarget(url: string): string {
  return base64url.encode(url)
}

export function decodeTarget(target: string): string {
  return base64url.decode(target)
}
