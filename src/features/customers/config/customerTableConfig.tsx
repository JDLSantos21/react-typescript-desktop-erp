import { Customer } from "@/shared/types/entities/customer.types";
import { Column } from "@/shared/components/core/Table";
import { Badge, PhoneIcon, WhatsAppIcon } from "@/shared/components";
import { formatPhoneNumber } from "@/shared/utils";

const renderCustomerPhone = (customer: Customer) => {
  const primaryPhone = customer.phones.find((phone) => phone.isPrimary);

  if (!primaryPhone) return "N/A";

  const Icon = primaryPhone.hasWhatsapp ? WhatsAppIcon : PhoneIcon;
  const iconColor = primaryPhone.hasWhatsapp ? "text-success" : "text-primary";

  return (
    <div className="flex items-center gap-1">
      <Icon className={iconColor} />
      {formatPhoneNumber(primaryPhone.phoneNumber)}
    </div>
  );
};

const renderCustomerAddress = (customer: Customer) => {
  const primaryAddress = customer.addresses.find((addr) => addr.isPrimary);
  return primaryAddress?.direction || "N/A";
};

const renderCustomerStatus = (customer: Customer) => (
  <Badge size="sm" variant={customer.isActive ? "success" : "danger"}>
    {customer.isActive ? "Activo" : "Inactivo"}
  </Badge>
);

export const customerTableColumns: Column<Customer>[] = [
  {
    key: "businessName",
    label: "Nombre del negocio",
  },
  {
    key: "representativeName",
    label: "Representante",
  },
  {
    key: "address",
    label: "Dirección",
    render: renderCustomerAddress,
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
