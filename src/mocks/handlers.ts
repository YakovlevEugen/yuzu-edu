import { http, HttpHandler } from 'msw'

import { formatApiUrl } from '@/helpers/url'

const DELAY = 500

export const mockHandlers: HttpHandler[] = []
