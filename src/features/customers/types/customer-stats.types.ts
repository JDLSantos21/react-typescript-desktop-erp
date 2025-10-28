export interface CustomerEquipment {
  id: string;
  equipmentName: string;
  serialNumber: string;
  assignedDate: string;
  status: "OPERATIVO" | "EN_MANTENIMIENTO" | "FUERA_DE_SERVICIO";
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  status: "PENDIENTE" | "PROCESANDO" | "COMPLETADO" | "CANCELADO";
  itemsCount: number;
}

export interface CustomerStats {
  currentEquipment: CustomerEquipment[];
  lastOrder: CustomerOrder | null;
  totalOrders: number;
  totalEquipmentAssigned: number;
}
