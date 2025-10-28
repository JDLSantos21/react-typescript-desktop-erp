import { useState } from "react";
import { Modal, Button, Badge } from "@/shared/components";
import { formatDate } from "@/shared/utils";
import {
  CustomerEquipment,
  CustomerOrder,
} from "../types/customer-stats.types";

type TabType = "equipment" | "orders";

interface CustomerHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
}

const mockEquipmentHistory: CustomerEquipment[] = [
  {
    id: "1",
    equipmentName: "Laptop Dell Latitude 5420",
    serialNumber: "SN123456789",
    assignedDate: "2024-01-15",
    status: "OPERATIVO",
  },
  {
    id: "2",
    equipmentName: "Monitor LG 27 pulgadas",
    serialNumber: "SN987654321",
    assignedDate: "2024-02-20",
    status: "EN_MANTENIMIENTO",
  },
  {
    id: "3",
    equipmentName: "Teclado mecánico Logitech",
    serialNumber: "SN456789123",
    assignedDate: "2023-11-10",
    status: "FUERA_DE_SERVICIO",
  },
];

const mockOrderHistory: CustomerOrder[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    orderDate: "2024-10-20",
    totalAmount: 25000,
    status: "COMPLETADO",
    itemsCount: 5,
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    orderDate: "2024-09-15",
    totalAmount: 18500,
    status: "COMPLETADO",
    itemsCount: 3,
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    orderDate: "2024-08-05",
    totalAmount: 32000,
    status: "CANCELADO",
    itemsCount: 7,
  },
];

const statusLabels = {
  OPERATIVO: { label: "Operativo", variant: "success" as const },
  EN_MANTENIMIENTO: { label: "Mantenimiento", variant: "warning" as const },
  FUERA_DE_SERVICIO: { label: "Fuera de servicio", variant: "danger" as const },
};

const orderStatusLabels = {
  PENDIENTE: { label: "Pendiente", variant: "warning" as const },
  PROCESANDO: { label: "Procesando", variant: "info" as const },
  COMPLETADO: { label: "Completado", variant: "success" as const },
  CANCELADO: { label: "Cancelado", variant: "danger" as const },
};

export default function CustomerHistoryModal({
  isOpen,
  onClose,
}: CustomerHistoryModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("equipment");

  // const { data: equipmentHistory } = useCustomerEquipmentHistory(customerId);
  // const { data: orderHistory } = useCustomerOrderHistory(customerId);

  const equipmentHistory = mockEquipmentHistory;
  const orderHistory = mockOrderHistory;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <Modal.Header>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text-primary">
              Historial del Cliente
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Visualiza todo el historial de equipos y pedidos
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </Modal.Header>

      <Modal.Body>
        {/* Tabs */}
        <div className="flex gap-2 border-b border-border-light mb-4">
          <button
            onClick={() => setActiveTab("equipment")}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "equipment"
                ? "text-primary"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            Equipos Asignados
            {activeTab === "equipment" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "orders"
                ? "text-primary"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            Pedidos Realizados
            {activeTab === "orders" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px] max-h-[500px] overflow-y-auto">
          {activeTab === "equipment" ? (
            <EquipmentHistoryTab equipment={equipmentHistory} />
          ) : (
            <OrderHistoryTab orders={orderHistory} />
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function EquipmentHistoryTab({
  equipment,
}: {
  equipment: CustomerEquipment[];
}) {
  if (equipment.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto text-text-muted mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="text-text-muted">No hay equipos asignados</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {equipment.map((item) => (
        <div
          key={item.id}
          className="bg-background-secondary border border-border-light rounded-lg p-4 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-text-primary mb-1">
                {item.equipmentName}
              </h4>
              <div className="space-y-1">
                <p className="text-xs text-text-muted">
                  <span className="font-medium">S/N:</span> {item.serialNumber}
                </p>
                <p className="text-xs text-text-muted">
                  <span className="font-medium">Asignado:</span>{" "}
                  {formatDate(item.assignedDate)}
                </p>
              </div>
            </div>
            <Badge variant={statusLabels[item.status].variant} size="sm">
              {statusLabels[item.status].label}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrderHistoryTab({ orders }: { orders: CustomerOrder[] }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto text-text-muted mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p className="text-text-muted">No hay pedidos registrados</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Resumen */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-text-muted mb-1">Total Pedidos</p>
            <p className="text-xl font-bold text-primary">{orders.length}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Completados</p>
            <p className="text-xl font-bold text-success">
              {orders.filter((o) => o.status === "COMPLETADO").length}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Monto Total</p>
            <p className="text-xl font-bold text-primary">{12}</p>
          </div>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-background-secondary border border-border-light rounded-lg p-4 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-text-primary mb-1">
                  Pedido #{order.orderNumber}
                </h4>
                <p className="text-xs text-text-muted">
                  {formatDate(order.orderDate)}
                </p>
              </div>
              <Badge variant={orderStatusLabels[order.status].variant}>
                {orderStatusLabels[order.status].label}
              </Badge>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border-light">
              <div>
                <p className="text-xs text-text-muted">Monto</p>
                <p className="text-lg font-bold text-primary">{12}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted">Items</p>
                <p className="text-sm font-semibold text-text-secondary">
                  {order.itemsCount}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
