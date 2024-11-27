import { cn } from '@/helpers/lib'
import Balance from '@/components/Balance'
import BorderBlock from '@/components/BorderBlock'

interface Props {
  className?: string
}

export default function EDULandPage({ className }: Props) {
  const classRoot = cn('pb-10', className)

  return (
    <div className={classRoot}>
      <div className="text-center text-4xl font-bold tracking-tighter text-white md:text-6xl">
        Community Partnerships
      </div>

      <div className="flex flex-col items-center">
        <div className="z-[1] -mb-[50px] mt-6">
          <img className="w-[218px] md:w-[327px]" src="/images/capybara-orange.svg" alt="Playing guitar capybara" />
        </div>

        <BorderBlock>
          <div className="mt-5 text-center">
            <span className="text-orange">Yuzu</span> earned from community partnerships
          </div>
          <Balance className="mt-5 justify-center" value={'0.1'} />
        </BorderBlock>
      </div>
    </div>
  )
}
