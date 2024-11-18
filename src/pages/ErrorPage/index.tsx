import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { ROUTES } from '@/constants/routes'

type Status = 403 | 404

export type Props = {
  /** Error status */
  status: Status
}

const description: Record<Status, string> = {
  403: 'Forbidden',
  404: 'Not Found'
}

export default function ErrorPage({ status }: Props) {
  const statusDescription = description?.[status] ?? ''
  const title = `${status}${statusDescription ? ' - ' + statusDescription : ''}`

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <div className="h-screen w-screen flex-col items-center justify-center">
        <h1 className="mb-5 text-2xl">
          {status} {description[status]}
        </h1>
        <nav>
          <Link className="text-orange underline hover:no-underline" to={ROUTES.home}>
            Home
          </Link>
        </nav>
      </div>
    </>
  )
}
