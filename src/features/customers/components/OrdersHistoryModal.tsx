import { Modal } from "@/shared/components/core/Modal";
// import { Table } from "@/shared/components/core/Table";
// import { orderHistoryTableColumns } from "../config/orderHistoryTableConfig";

interface OrdersHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// const customerOrdersMockData = [
//   {
//     id: 1,
//     trackingCode: "ORD-2023-001",
//     status: "ENTREGADO" as const,
//     date: "2023-11-20T10:30:00",
//     scheduledDate: "2023-11-21T08:00:00",
//     deliveredDate: "2023-11-21T09:15:00",
//     deliveryNotes: "Entregado en recepción",
//     notes: "Cliente prefiere entrega por la mañana",
//     products: [
//       { id: 101, name: "Producto A", quantity: 2, size: "Garrafón", unit: "L" },
//       { id: 102, name: "Producto B", quantity: 1, size: "Botella", unit: "ml" },
//     ],
//     address: {
//       street: "Calle 1",
//       neighborhood: "Centro",
//       city: "Ciudad",
//       state: "Estado",
//     },
//     phone: { number: "1234567890", type: "Móvil" as const },
//     customer: {
//       name: "Juan Pérez",
//       businessName: "Empresa S.A.",
//       type: "RESIDENCIAL" as const,
//     },
//     assignedTo: { id: 1, name: "Chofer 1" },
//   },
//   {
//     id: 2,
//     trackingCode: "ORD-2023-002",
//     status: "CANCELADO" as const,
//     date: "2023-11-18T14:20:00",
//     scheduledDate: "2023-11-19T10:00:00",
//     deliveredDate: null,
//     deliveryNotes: null,
//     notes: "Cancelado por el cliente",
//     products: [
//       {
//         id: 103,
//         name: "Producto C",
//         quantity: 5,
//         size: "Paquete",
//         unit: "pzas",
//       },
//     ],
//     address: {
//       street: "Avenida 2",
//       neighborhood: "Norte",
//       city: "Ciudad",
//       state: "Estado",
//     },
//     phone: { number: "0987654321", type: "Trabajo" as const },
//     customer: {
//       name: "María Gómez",
//       businessName: "Negocio Local",
//       type: "NEGOCIO" as const,
//     },
//     assignedTo: { id: 2, name: "Chofer 2" },
//   },
//   {
//     id: 3,
//     trackingCode: "ORD-2023-003",
//     status: "EN_CAMINO" as const,
//     date: "2023-11-22T09:00:00",
//     scheduledDate: "2023-11-22T13:00:00",
//     deliveredDate: null,
//     deliveryNotes: null,
//     notes: "Entrega urgente",
//     products: [
//       {
//         id: 104,
//         name: "Producto D",
//         quantity: 10,
//         size: "Caja",
//         unit: "unidades",
//       },
//     ],
//     address: {
//       street: "Ruta 3",
//       neighborhood: "Este",
//       city: "Pueblo",
//       state: "Estado",
//     },
//     phone: { number: "1122334455", type: "Móvil" as const },
//     customer: {
//       name: "Pedro López",
//       businessName: "Tienda Pequeña",
//       type: "NEGOCIO" as const,
//     },
//     assignedTo: { id: 1, name: "Chofer 1" },
//   },
// ];

export default function OrdersHistoryModal({
  isOpen,
  onClose,
}: OrdersHistoryModalProps) {
  return (
    <Modal
      title="Historial de pedidos"
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
    >
      <Modal.Body>
        {/* <Table
          isLoading={false}
          minRows={customerOrdersMockData.length}
          columns={orderHistoryTableColumns}
          keyExtractor={(order) => order.trackingCode}
        /> */}
        <p>hola</p>
      </Modal.Body>
    </Modal>
  );
}
