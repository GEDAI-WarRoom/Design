import type { ReactNode } from "react";

export interface MenuItem {
  label: string;
  route: string;
  icon?: ReactNode;
}

export interface MenuCategory {
  title: string;
  icon: ReactNode;
  items: MenuItem[];
}
