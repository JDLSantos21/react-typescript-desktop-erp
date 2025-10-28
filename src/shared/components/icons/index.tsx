import { ComponentProps } from "react";
import {
  TfiAngleLeft,
  TfiAngleDoubleLeft,
  TfiAngleRight,
  TfiAngleDoubleRight,
} from "react-icons/tfi";
import { FaPhoneAlt, FaWhatsapp, FaUserEdit } from "react-icons/fa";
import {
  PiUserPlusLight,
  PiUser,
  PiUsersLight,
  PiPhonePlus,
} from "react-icons/pi";
import { TbShoppingCartPlus } from "react-icons/tb";
import { LuMapPinPlus } from "react-icons/lu";
import { GoHistory, GoStack } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { BsFuelPump } from "react-icons/bs";
import { PiUsersThreeBold } from "react-icons/pi";
import { BsTruckFlatbed } from "react-icons/bs";
import { VscPackage } from "react-icons/vsc";
import { RiFridgeLine } from "react-icons/ri";
import { LiaCogsSolid } from "react-icons/lia";
import { AiOutlineBars } from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";
import { CiSearch } from "react-icons/ci";

// Type para props comunes de iconos
export type IconProps = ComponentProps<"svg"> & {
  size?: number | string;
};

// ============================================
// NAVEGACIÓN
// ============================================
export const ChevronLeftIcon = (props: IconProps) => (
  <TfiAngleLeft {...props} />
);
export const ChevronRightIcon = (props: IconProps) => (
  <TfiAngleRight {...props} />
);
export const ChevronDoubleLeftIcon = (props: IconProps) => (
  <TfiAngleDoubleLeft {...props} />
);
export const ChevronDoubleRightIcon = (props: IconProps) => (
  <TfiAngleDoubleRight {...props} />
);

export const DashboardIcon = (props: IconProps) => (
  <LuLayoutDashboard {...props} />
);

export const StackIcon = (props: IconProps) => <GoStack {...props} />;

export const FuelIcon = (props: IconProps) => <BsFuelPump {...props} />;

export const TruckIcon = (props: IconProps) => <BsTruckFlatbed {...props} />;

export const OrderIcon = (props: IconProps) => <VscPackage {...props} />;

export const FridgeIcon = (props: IconProps) => <RiFridgeLine {...props} />;

export const EquipmentIcon = (props: IconProps) => <LiaCogsSolid {...props} />;

export const MenuIcon = (props: IconProps) => <AiOutlineBars {...props} />;

export const LogoutIcon = (props: IconProps) => <MdOutlineLogout {...props} />;

// ============================================
// COMUNICACIÓN
// ============================================
export const PhoneIcon = (props: IconProps) => <FaPhoneAlt {...props} />;
export const WhatsAppIcon = (props: IconProps) => <FaWhatsapp {...props} />;
export const PhonePlusIcon = (props: IconProps) => <PiPhonePlus {...props} />;

// ============================================
// USUARIOS / ACCIONES
// ============================================
export const UserPlusIcon = (props: IconProps) => (
  <PiUserPlusLight {...props} />
);

export const UserEditIcon = (props: IconProps) => <FaUserEdit {...props} />;

export const UserIcon = (props: IconProps) => <PiUser {...props} />;

export const UsersIcon = (props: IconProps) => <PiUsersThreeBold {...props} />;
export const ShoppingCartPlusIcon = (props: IconProps) => (
  <TbShoppingCartPlus {...props} />
);
export const MapPinPlusIcon = (props: IconProps) => <LuMapPinPlus {...props} />;
export const HistoryIcon = (props: IconProps) => <GoHistory {...props} />;
export const DeleteIcon = (props: IconProps) => <MdDeleteOutline {...props} />;
export const SearchIcon = (props: IconProps) => <CiSearch {...props} />;

// ============================================
// UTILIDADES
// ============================================

/**
 * Wrapper genérico para aplicar estilos consistentes a iconos
 */
export const Icon = ({
  children,
  size = 16,
  className = "",
}: {
  children: React.ReactNode;
  size?: number | string;
  className?: string;
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  );
};

/**
 * Presets de tamaños comunes
 */
export const iconSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
} as const;

/**
 * Presets de colores usando variables CSS
 */
export const iconColors = {
  primary: "text-primary",
  secondary: "text-text-secondary",
  muted: "text-text-muted",
  success: "text-success",
  danger: "text-danger",
  warning: "text-warning",
  info: "text-info",
} as const;
