export interface MenuChild {
  label: string;
  link: string;
}

export interface Menu {
  title: string;
  children: MenuChild[];
}
