import type { FC, ReactNode } from 'react/index';

export interface IInfoItem {
  title?: ReactNode | number | string;
  value?: ReactNode | number | string;
}

export interface ITab {
  id: string;
  contentComponent?: FC;
  disabled?: boolean;
  title: string;
}
