import BorderBlock from '@/components/BorderBlock';
import ReferralBlock from '@/containers/ReferralBlock';

import { cn } from '@/helpers/lib';

export default function Earn({ className }: { className?: string }) {
  return (
    <BorderBlock className={cn(className)}>
      <ReferralBlock />
    </BorderBlock>
  );
}
