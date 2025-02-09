import { generator } from 'flexid'

// const alphabet = BASE['58']
const alphabet = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ'

const opts = {
  size: 8,
}

export const generateId = generator(alphabet, opts)
