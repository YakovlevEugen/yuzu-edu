import { cn } from '@/helpers/lib';

interface Props {
  className?: string;
}

export default function TemplateComponent({ className }: Props) {
  const classRoot = cn('', className);

  return <div className={classRoot}>TemplateComponent</div>;
}
