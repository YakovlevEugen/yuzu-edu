import SvgIcon from '@/components/SvgIcon';
import { type IBlockchain, blockchains } from '@/constants/currencies';
import { cn } from '@/helpers/lib';

export default function TransformFromTo({
  className,
  from,
  to
}: {
  className?: string;
  from: IBlockchain;
  to: IBlockchain;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-y-7 rounded-2xl bg-green-toxic p-6 md:flex-row md:justify-between md:gap-y-0',
        className
      )}
    >
      <div className="flex-[1]">
        <div className="text-center text-sm md:text-left">From</div>
        <div className="mt-2 flex items-center gap-x-1">
          <SvgIcon className="h-6 w-6" name={from} />
          <span>{blockchains[from]}</span>
        </div>
      </div>

      <SvgIcon
        className="w-[50px] rotate-90 md:-translate-x-2 md:rotate-0"
        name="arrow-curved"
      />

      <div className="flex-[1]">
        <div className="text-center text-sm md:text-left">To</div>
        <div className="mt-2 flex items-center gap-x-1">
          <SvgIcon className="h-6 w-6" name={to} />
          <span>{blockchains[to]}</span>
        </div>
      </div>
    </div>
  );
}
