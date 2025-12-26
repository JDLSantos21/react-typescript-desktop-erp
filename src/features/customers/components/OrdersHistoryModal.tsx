import { Modal, Table } from "@/shared/components";
import { orderTableColumns } from "../config/orderHistoryTableConfig";

interface OrdersHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId?: string;
}

const customerOrdersMockData = [
  {
    trackingCode: "PD-2024-001121",
    status: "ENTREGADO" as const,
    date: "2024-11-01T10:30:00Z",
    scheduledDate: "2024-11-02T14:00:00Z",
    deliveredDate: "2024-11-02T15:45:00Z",
    deliveryNotes: "Entregado sin novedades",
    notes: "Cliente solicita factura",
    products: [
      {
        id: 1,
        name: "Harina de trigo",
        quantity: 50,
        size: "25kg",
        unit: "sacos",
      },
      {
        id: 2,
        name: "Azúcar refinada",
        quantity: 30,
        size: "50kg",
        unit: "sacos",
      },
    ],
    address: {
      id: 1,
      branchName: "Sucursal Principal",
      direction: "Av. Winston Churchill #123, Piantini",
      city: "Santo Domingo",
      isPrimary: true,
    },
    phone: {
      id: 1,
      phoneNumber: "809-555-1234",
      type: "MOVIL" as const,
      description: "Teléfono principal",
      hasWhatsapp: true,
      isPrimary: true,
    },
    customer: {
      id: "CUST-001",
      businessName: "Panadería El Trigal",
      representativeName: "Juan Pérez",
    },
    assignedTo: {
      id: "EMP-001",
      name: "Carlos Rodríguez",
    },
  },
  {
    trackingCode: "PD-2024-002232",
    status: "PREPARANDO" as const,
    date: "2024-11-03T08:15:00Z",
    scheduledDate: "2024-11-04T10:00:00Z",
    deliveredDate: null,
    deliveryNotes: null,
    notes: "Urgente - Cliente VIP",
    products: [
      {
        id: 3,
        name: "Aceite vegetal",
        quantity: 20,
        size: "5L",
        unit: "botellas",
      },
      {
        id: 4,
        name: "Sal marina",
        quantity: 10,
        size: "1kg",
        unit: "paquetes",
      },
      {
        id: 5,
        name: "Levadura fresca",
        quantity: 15,
        size: "500g",
        unit: "bloques",
      },
    ],
    address: {
      id: 2,
      branchName: "Almacén Central",
      direction: "Calle Duarte #456, Los Mina",
      city: "Santo Domingo Este",
      isPrimary: false,
    },
    phone: {
      id: 2,
      phoneNumber: "809-555-5678",
      type: "FIJO" as const,
      description: "Oficina administrativa",
      hasWhatsapp: false,
      isPrimary: false,
    },
    customer: {
      id: "CUST-001",
      businessName: "Panadería El Trigal",
      representativeName: "Juan Pérez",
    },
    assignedTo: {
      id: "EMP-002",
      name: "María García",
    },
  },
  {
    trackingCode: "PD-2024-003333",
    status: "CANCELADO" as const,
    date: "2024-10-28T16:45:00Z",
    scheduledDate: "2024-10-30T09:00:00Z",
    deliveredDate: null,
    deliveryNotes: null,
    notes: "Cliente canceló por cambio de proveedor",
    products: [
      {
        id: 6,
        name: "Chocolate en polvo",
        quantity: 25,
        size: "2kg",
        unit: "latas",
      },
    ],
    address: {
      id: 1,
      branchName: "Sucursal Principal",
      direction: "Av. Winston Churchill #123, Piantini",
      city: "Santo Domingo",
      isPrimary: true,
    },
    phone: {
      id: 1,
      phoneNumber: "809-555-1234",
      type: "MOVIL" as const,
      description: "Teléfono principal",
      hasWhatsapp: true,
      isPrimary: true,
    },
    customer: {
      id: "CUST-001",
      businessName: "Panadería El Trigal",
      representativeName: "Juan Pérez",
    },
    assignedTo: {
      id: "EMP-001",
      name: "Carlos Rodríguez",
    },
  },
];

export default function OrdersHistoryModal({
  isOpen,
  onClose,
  customerId,
}: OrdersHistoryModalProps) {
  return (
    <Modal
      title="Historial de pedidos"
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
    >
      <Modal.Body>
        <Table
          isLoading={false}
          minRows={customerOrdersMockData.length}
          columns={orderTableColumns}
          data={customerOrdersMockData}
          keyExtractor={(order) => order.trackingCode}
        />
      </Modal.Body>
    </Modal>
  );
}
