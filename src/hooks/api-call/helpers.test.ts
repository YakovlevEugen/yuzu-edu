import { getResponseJson } from './helpers'

describe('getResponseJson', () => {
  it('response body is JSON', async () => {
    const response = {
      json: () => new Promise((resolve) => resolve({ result: 'ok' }))
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await expect(getResponseJson(response as any)).resolves.toEqual('ok')
  })
  it('response body is something else', async () => {
    const response = {
      // @ts-ignore
      json: () => new Promise((resolve, reject) => reject(new Error('Can not parse')))
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await expect(getResponseJson(response as any)).resolves.toBeUndefined()
  })
})
