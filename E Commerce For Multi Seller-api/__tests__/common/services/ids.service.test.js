import { generateId } from 'services/ids.service'

it.skip('should return a unique id', () => {
  const id = generateId()
  //   expect(id).toMatch(/^[0-9a-f]{24}$/)
  console.log(id)
})
