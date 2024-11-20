import { z } from 'zod'

// eslint-disable-next-line no-useless-escape
const DATE_REGEXP = /^$|^(0?[1-9]|[12][0-9]|3[01])[\.](0?[1-9]|1[012])[\.]\d{4}$/
const DATE_FORMAT_ERROR = 'Wrong date format'
const REQUIRED_ERROR = 'Required field'
const REQUIRED_ERRORS = { required_error: REQUIRED_ERROR, invalid_type_error: REQUIRED_ERROR }

export const vDate = z.string().regex(DATE_REGEXP, DATE_FORMAT_ERROR).optional().nullable()
export const vRequiredNumber = z.number(REQUIRED_ERRORS)
export const vRequiredString = z.string(REQUIRED_ERRORS).nonempty(REQUIRED_ERROR)
export const vRequiredDateTime = vRequiredString.datetime({ message: DATE_FORMAT_ERROR })
