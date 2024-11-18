import { cn } from '@/helpers/lib'

export interface Props {
  className?: string
}

export default function TemplateComponent({ className }: Props) {
  const classRoot = cn('', className)

  return <div className={classRoot}>TemplateComponent</div>
}
