const solution = require('../src/solution')

describe('test solution', () => {
  test('test solution', () => {
    const a = [2, 4,7,5, 3, 5, 8, 5, 1, 7]
    const m = 4
    const k = 10
    const result = solution.pair(a, m, k)

    expect(result).toBe(6)
  })

  test('test solution', () => {
    const a = [15, 8, 8, 2, 6, 4, 1, 7]
    const m = 2
    const k = 8
    const result = solution.pair(a, m, k)

    expect(result).toBe(2)
  })
})