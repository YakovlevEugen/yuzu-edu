import camelcaseKeys from 'camelcase-keys'

export async function getResponseJson<T>(response: Response) {
  try {
    const responseJson = await response.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return camelcaseKeys(responseJson?.result as any, { deep: true }) as T
  } catch (error) {
    console.error(error)
    return undefined
  }
}
