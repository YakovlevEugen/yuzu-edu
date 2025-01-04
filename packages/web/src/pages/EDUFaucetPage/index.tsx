import Claim from './components/Claim';

import { cn } from '@/helpers/lib';

interface Props {
  className?: string;
}

export default function EDUFaucetPage({ className }: Props) {
  const classRoot = cn('', className);

  return (
    <div className={classRoot}>
      <div className="text-center text-4xl font-bold tracking-tighter md:text-6xl">
        Claim <span className="text-orange">Edu</span> for Gas
      </div>

      <div className="mt-[40px] flex flex-col-reverse items-center gap-5 md:flex-row">
        <div className="md:flex-[1]">
          <img
            className="mt-[40px] w-[218px] md:w-[327px]"
            src="/images/capybara-playing-guitar.png"
            alt="Playing guitar capybara"
          />
        </div>
        <Claim className="flex-[1]" />
      </div>
    </div>
  );
}
