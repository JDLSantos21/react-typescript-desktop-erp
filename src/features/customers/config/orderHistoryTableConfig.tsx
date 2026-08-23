import { Badge } from "@/shared/components/core/Badge";
import { Column } from "@/shared/components/core/Table";
import { Order } from "@/shared/types/entities/order.types";
import { formatDate } from "@/shared/utils/formatters";
import { Link } from "react-router-dom";

const renderOrderStatus = (order: Order) => {
  const statusVariant =
    order.status === "PENDIENTE"
      ? "warning"
      : order.status === "PREPARANDO"
        ? "info"
        : order.status === "DESPACHADO"
          ? "primary"
          : order.status === "CANCELADO"
            ? "danger"
            : "success";

  return (
    <Badge size="sm" variant={statusVariant}>
      {order.status}
    </Badge>
  );
};

const renderCustomerAddress = (order: Order) => {
  return order.address
    ? `${order.address.direction}, ${order.address.city}`
    : "Sin dirección disponible";
};

const renderTrackingCode = (order: Order) => {
  return (
    <Link className="text-link-color underline" to={`/orders/${order.id}`}>
      {order.trackingCode}
    </Link>
  );
};

const renderOrderDate = (order: Order) => {
  return formatDate(order.date, "DD/MM/YYYY");
};

export const orderHistoryTableColumns: Column<Order>[] = [
  {
    key: "date",
    label: "Fecha",
    render: renderOrderDate,
    className: "w-32", // Ancho fijo 8rem
  },
  {
    key: "trackingCode",
    label: "Código de rastreo",
    render: renderTrackingCode,
    className: "w-40", // Mínimo 10rem, crece si necesita
  },
  {
    key: "address",
    label: "Dirección",
    render: renderCustomerAddress,
    className: "min-w-96", // Mínimo 24rem, crece si necesita
  },
  {
    key: "status",
    label: "Estado",
    render: renderOrderStatus,
    className: "w-32", // Ancho fijo 8rem
  },
];
