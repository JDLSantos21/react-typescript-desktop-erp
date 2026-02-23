import type { ComponentType } from "react";
import type { IconProps } from "../icons";

export interface NavigationChild {
  name: string;
  href: string;
  icon?: ComponentType<IconProps>;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: ComponentType<IconProps>;
  children?: NavigationChild[];
}
