import { generator } from 'flexid'

export function flexId(size = 8) {
  const alphabet = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ'
  const opts = {
    size, // Total ID size.
  }
  const flexid = generator(alphabet, opts)
  return flexid()
}
