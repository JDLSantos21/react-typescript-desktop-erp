import { Badge, Button, Input, Modal, Table } from "@/shared/components";
import { useGetCustomers } from "../hooks/useCustomer";
import { formatPhoneNumber } from "@/shared/utils";
import { Customer } from "@/shared/types/entities/customer.types";
import { Column } from "@/shared/components/core/Table";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { PiUserPlusLight } from "react-icons/pi";
import { useState } from "react";

export function CustomerPage() {
  const { data: customers, isLoading } = useGetCustomers();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: Column<Customer>[] = [
    { key: "businessName", label: "Nombre del negocio" },
    { key: "representativeName", label: "Representante" },
    {
      key: "address",
      label: "Dirección",
      render: (customer: Customer) => {
        const primaryAddress = customer.addresses.find(
          (addr) => addr.isPrimary
        );
        return primaryAddress ? primaryAddress.direction : "N/A";
      },
    },
    {
      key: "phones",
      label: "Contacto",
      render: (customer: Customer) => {
        const primaryPhone = customer.phones.find((phone) => phone.isPrimary);
        return primaryPhone ? (
          <div className="flex items-center gap-1">
            {primaryPhone.hasWhatsapp ? (
              <FaWhatsapp className="text-green-500" />
            ) : (
              <FaPhoneAlt className="text-blue-500" />
            )}
            {formatPhoneNumber(primaryPhone.phoneNumber)}
          </div>
        ) : (
          "N/A"
        );
      },
    },
    {
      key: "isActive",
      label: "Estado",
      render: (customer: Customer) => (
        <Badge variant={customer.isActive ? "success" : "danger"}>
          {customer.isActive ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <section className="flex justify-end gap-3 items-center">
        {/* acciones */}
        <Button variant="outline">Modificar</Button>
        <Button onClick={() => setIsModalOpen(true)} icon={PiUserPlusLight}>
          Nuevo cliente
        </Button>
      </section>
      <section>
        {/* buscador y filtros */}
        <Input placeholder="Nombre, teléfono, correo..." />
      </section>
      <section>
        {/* lista de clientes */}
        <Table
          columns={columns}
          data={customers!}
          keyExtractor={(customer) => customer.id}
          isLoading={isLoading}
          emptyMessage="Mensaje vacio personalizado"
          onRowClick={() => console.log("asd")}
        />
      </section>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="xl"
      >
        <Modal.Header>
          <h3 className="text-lg font-semibold">Nuevo cliente</h3>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <Input label="Nombre del negocio" placeholder="Ej. Tienda ABC" />
            <Input
              label="Nombre del representante"
              placeholder="Ej. Juan Pérez"
            />
            <Input label="Teléfono" placeholder="Ej. +57 300 123 4567" />
            <Input label="Dirección" placeholder="Ej. Calle 123 #45-67" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline">Cancelar</Button>
          <Button variant="primary">Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
