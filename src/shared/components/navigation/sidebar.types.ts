import type { ComponentType } from "react";
import type { IconProps } from "../icons";
import type { PermissionLevel } from "@/shared/authorization/permissions";

export interface NavigationChild {
  name: string;
  href: string;
  icon?: ComponentType<IconProps>;
  minimumPermissionLevel?: PermissionLevel;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: ComponentType<IconProps>;
  children?: NavigationChild[];
  minimumPermissionLevel?: PermissionLevel;
}
