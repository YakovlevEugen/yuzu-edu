import Earn from './components/Earn';
import Stake from './components/Stake';

export default function StakePage() {
  return (
    <div>
      <div className="text-center text-4xl font-bold tracking-tighter md:text-6xl">
        Stake <span className="text-orange">Edu</span>
      </div>

      <div className="flex flex-col gap-x-6 md:flex-row">
        <div className="flex-[1]">
          <img
            className="relative z-[1] mx-auto h-[190px] md:h-[248px]"
            src="/images/capybara.png"
            alt="Capybara"
          />
          <Earn className="-translate-y-5" />
        </div>

        <div className="flex-[1] pt-0 md:pt-[115px]">
          <Stake />
        </div>
      </div>
    </div>
  );
}
