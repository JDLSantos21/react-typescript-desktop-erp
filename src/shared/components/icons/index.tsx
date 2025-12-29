import { ComponentProps } from "react";
import {
  TfiAngleLeft,
  TfiAngleDoubleLeft,
  TfiAngleRight,
  TfiAngleDoubleRight,
} from "react-icons/tfi";
import { FaWhatsapp, FaUserEdit } from "react-icons/fa";
import {
  PiUserPlusLight,
  PiUser,
  PiPhonePlus,
  PiPhoneThin,
  PiClipboardTextLight,
} from "react-icons/pi";
import { TbShoppingCartPlus } from "react-icons/tb";
import { LuMapPinPlus, LuMessageSquareMore } from "react-icons/lu";
import { GoAlert, GoHistory, GoMail, GoStack } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { BsExclamationCircle, BsFuelPump } from "react-icons/bs";
import { PiUsersThreeBold } from "react-icons/pi";
import { BsTruckFlatbed } from "react-icons/bs";
import { VscPackage } from "react-icons/vsc";
import { RiFridgeLine, RiMapPinUserLine } from "react-icons/ri";
import { LiaCogsSolid } from "react-icons/lia";
import { AiOutlineBars } from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";
import { CiCalendar, CiFilter, CiLocationOn, CiSearch } from "react-icons/ci";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import { VscSearchStop } from "react-icons/vsc";
import { CiCircleQuestion } from "react-icons/ci";
import { GiPathDistance } from "react-icons/gi";
import {
  IoCopyOutline,
  IoNavigateOutline,
  IoReturnUpBackOutline,
} from "react-icons/io5";
import { SlPrinter, SlRefresh } from "react-icons/sl";
import { GrUserWorker } from "react-icons/gr";
import { TbEdit } from "react-icons/tb";
import { FiExternalLink } from "react-icons/fi";

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
export const ReturnIcon = (props: IconProps) => (
  <IoReturnUpBackOutline {...props} />
);

export const ClipboardIcon = (props: IconProps) => (
  <PiClipboardTextLight {...props} />
);

export const FilterIcon = (props: IconProps) => <CiFilter {...props} />;

export const CalendarIcon = (props: IconProps) => <CiCalendar {...props} />;

export const StackIcon = (props: IconProps) => <GoStack {...props} />;

export const FuelIcon = (props: IconProps) => <BsFuelPump {...props} />;

export const TruckIcon = (props: IconProps) => <BsTruckFlatbed {...props} />;

export const OrderIcon = (props: IconProps) => <VscPackage {...props} />;

export const PlusIcon = (props: IconProps) => <FiPlusCircle {...props} />;

export const FridgeIcon = (props: IconProps) => <RiFridgeLine {...props} />;

export const EquipmentIcon = (props: IconProps) => <LiaCogsSolid {...props} />;

export const MenuIcon = (props: IconProps) => <AiOutlineBars {...props} />;

export const LogoutIcon = (props: IconProps) => <MdOutlineLogout {...props} />;

export const CloseIcon = (props: IconProps) => <IoMdClose {...props} />;

export const MessagesIcon = (props: IconProps) => (
  <LuMessageSquareMore {...props} />
);

// ============================================
// COMUNICACIÓN
// ============================================
export const WhatsAppIcon = (props: IconProps) => (
  <FaWhatsapp className="text-green-500" {...props} />
);
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
export const CheckIcon = (props: IconProps) => <IoMdCheckmark {...props} />;
export const SearchOffIcon = (props: IconProps) => <VscSearchStop {...props} />;
export const HelpIcon = (props: IconProps) => <CiCircleQuestion {...props} />;
export const WarningIcon = (props: IconProps) => (
  <BsExclamationCircle {...props} />
);

export const NavigateIcon = (props: IconProps) => (
  <IoNavigateOutline {...props} />
);

export const RefreshIcon = (props: IconProps) => <SlRefresh {...props} />;

export const MapPinUserIcon = (props: IconProps) => (
  <RiMapPinUserLine {...props} />
);

export const DistanceIcon = (props: IconProps) => <GiPathDistance {...props} />;

export const PhoneIcon = (props: IconProps) => <PiPhoneThin {...props} />;

export const LocationIcon = (props: IconProps) => <CiLocationOn {...props} />;

export const CopyIcon = (props: IconProps) => <IoCopyOutline {...props} />;

export const PrinterIcon = (props: IconProps) => <SlPrinter {...props} />;

export const MailIcon = (props: IconProps) => <GoMail {...props} />;

export const DriverIcon = (props: IconProps) => <GrUserWorker {...props} />;

export const EditIcon = (props: IconProps) => <TbEdit {...props} />;

export const AlertIcon = (props: IconProps) => <GoAlert {...props} />;

export const ExternalLinkIcon = (props: IconProps) => (
  <FiExternalLink {...props} />
);

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
