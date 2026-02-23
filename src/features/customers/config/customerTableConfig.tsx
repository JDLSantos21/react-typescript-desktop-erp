import { Customer } from "@/shared/types/entities/customer.types";
import { Column } from "@/shared/components/core/Table";
import { Badge } from "@/shared/components/core/Badge";
import { PhoneIcon } from "@/shared/components/icons";
import { WhatsAppIcon } from "@/shared/components/icons";
import { formatPhoneNumber } from "@/shared/utils/formatters";

const renderCustomerPhone = (customer: Customer) => {
  const primaryPhone = customer.phones.find((phone) => phone.isPrimary);

  if (!primaryPhone) return <span>No disponible</span>;

  const Icon = primaryPhone.hasWhatsapp ? WhatsAppIcon : PhoneIcon;
  const iconColor = primaryPhone.hasWhatsapp ? "text-success" : "text-primary";

  return (
    <div className="flex items-center gap-1">
      <Icon className={iconColor} />
      {formatPhoneNumber(primaryPhone.phoneNumber)}
    </div>
  );
};

const renderCustomerStatus = (customer: Customer) => (
  <Badge size="sm" variant={customer.isActive ? "success" : "danger"}>
    {customer.isActive ? "Activo" : "Inactivo"}
  </Badge>
);

export const customerTableColumns: Column<Customer>[] = [
  {
    key: "businessName",
    className: "w-1/3",
    label: "Nombre del negocio",
  },
  {
    key: "representativeName",
    label: "Representante",
  },

  {
    key: "phones",
    label: "Contacto",
    render: renderCustomerPhone,
  },
  {
    key: "isActive",
    label: "Estado",
    render: renderCustomerStatus,
  },
];
