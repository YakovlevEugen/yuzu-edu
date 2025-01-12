import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';

import BorderBlock from '@/components/BorderBlock';
import SvgIcon from '@/components/SvgIcon';
import Menu from '@/containers/Menu';
import WalletBlock from '@/containers/WalletBlock';

import { ROUTES } from '@/constants/routes';
import { cn } from '@/helpers/lib';
import { Link } from 'react-router-dom';

interface Props {
  className?: string;
}

export default function Header({ className }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const classRoot = cn(
    'flex items-center justify-between relative shadow-none px-5 py-3 md:py-6 md:px-10 md:shadow-border-box rounded-t-none md:rounded-2xl',
    className
  );
  const classMenuWrapper = cn(
    'md:flex flex-col md:flex-row md:flex-auto md:items-center md:justify-between absolute md:static top-full left-0  w-[calc(100%+4px)] -ml-[2px] md:ml-0 p-11 md:p-0 border-2 md:border-none rounded-2xl md:rounded-none bg-beige z-[2]',
    isMenuOpen ? 'flex' : 'hidden'
  );

  const menuRef = useRef(null);
  useClickAway(menuRef, () => {
    setIsMenuOpen(false);
  });

  function toggleMenu() {
    setIsMenuOpen((prevValue) => !prevValue);
  }

  return (
    <BorderBlock className={classRoot}>
      <div className="flex items-center">
        <Link to={ROUTES.home}>
          <SvgIcon className="h-10 w-[114px] md:h-8 md:w-[83px]" name="logo" />
        </Link>
      </div>

      <div className="ml-4 flex md:flex-auto">
        <SvgIcon
          className="h-6 w-6 cursor-pointer md:hidden"
          name={isMenuOpen ? 'close' : 'burger'}
          onClick={toggleMenu}
        />
        <div ref={menuRef} className={classMenuWrapper}>
          <Menu className="order-1 md:order-none" />
          <WalletBlock />
        </div>
      </div>
    </BorderBlock>
  );
}
