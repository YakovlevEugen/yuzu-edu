import { DEFAULT_ERRORS, DEFAULT_GENERAL_ERROR } from './constants'
import { getResponseJson } from './helpers'

export function useApiCall() {
  async function apiCall<T>(input: RequestInfo | URL, init?: RequestInit | undefined) {
    if (!input) return null

    const headers: HeadersInit = {
      ...init?.headers,
      'Content-Type': 'application/json'
    }
    let status = 0

    const response = await fetch(input, { ...init, headers })
    status = response?.status
    const responseJson = await getResponseJson<T>(response)

    // Error
    if (status >= 400) {
      const errorMessage: string = DEFAULT_ERRORS[status] || DEFAULT_GENERAL_ERROR

      if (status === 422 && responseJson) {
        throw responseJson
      }

      throw new Error(errorMessage)
    }

    // Success
    return responseJson
  }

  return apiCall
}
