import { Modal } from "@/shared/components/core/Modal";
import { Table } from "@/shared/components/core/Table";
import { CloseIcon } from "@/shared/components/icons";
import {
  EquipmentAssignment,
  EquipmentDetail,
} from "@/shared/types/entities/equipment.types";
import { formatDate } from "@/shared/utils/formatters";
import { useState } from "react";

interface AssignmentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: EquipmentDetail;
}

export default function AssignmentHistoryModal({
  isOpen,
  onClose,
  equipment,
}: AssignmentHistoryModalProps) {
  const assignments = equipment.assignments;
  const [selectedAssignment, setSelectedAssignment] =
    useState<EquipmentAssignment | null>(null);

  const handleClose = () => {
    setSelectedAssignment(null);
    onClose();
  };

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      className="pb-4 h-full relative overflow-hidden"
      onClose={handleClose}
      title="Historial de asignaciones"
    >
      <div className="px-6">
        <Table
          emptyMessage="No hay asignaciones"
          columns={[
            {
              className: "w-15",
              label: "ID",
              key: "id",
            },
            {
              label: "Cliente",
              key: "customer.businessName",
              render: (a) => a.customer?.businessName,
            },
            {
              label: "Fecha de asignación",
              key: "createdAt",
              render: (a) => formatDate(a.createdAt),
            },
            {
              label: "Estado",
              key: "status",
            },
          ]}
          onRowClick={(a) => setSelectedAssignment(a)}
          data={assignments}
          keyExtractor={(item) => item.id}
        />
      </div>

      <div
        className={`absolute inset-0 bg-black/5 z-10 transition-opacity duration-300 ${
          selectedAssignment
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSelectedAssignment(null)}
      />

      <div
        className={`absolute inset-y-0 right-0 w-80 bg-white border-l border-gray-200 z-20 shadow-2xl transition-transform duration-300 ease-in-out transform ${
          selectedAssignment ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Detalles de asignación
            </h2>
            <button
              onClick={() => setSelectedAssignment(null)}
              className="text-text-primary hover:text-danger/70 transition-colors cursor-pointer p-2 rounded-md bg-gray-50 hover:bg-red-50"
            >
              <CloseIcon />
            </button>
          </div>

          {selectedAssignment && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                  ID de Asignación
                </p>
                <p className="text-sm text-gray-900 font-medium bg-gray-50 p-2 rounded-md border border-gray-100">
                  {selectedAssignment.id}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                  Cliente
                </p>
                <p className="text-sm text-gray-900">
                  {selectedAssignment.customer?.businessName}
                </p>
                {selectedAssignment.customer?.representativeName && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Repr: {selectedAssignment.customer.representativeName}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
                  Fechas
                </p>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Asignado</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {formatDate(selectedAssignment.assignedAt)}
                    </p>
                  </div>
                  {selectedAssignment.deliveredAt && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Entregado</p>
                      <p className="text-sm text-gray-900 font-medium">
                        {formatDate(selectedAssignment.deliveredAt)}
                      </p>
                    </div>
                  )}
                  {selectedAssignment.unassignedAt && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Removido</p>
                      <p className="text-sm text-gray-900 font-medium">
                        {formatDate(selectedAssignment.unassignedAt)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">
                      Registro (Sistema)
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {formatDate(selectedAssignment.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                  Estado
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {selectedAssignment.status}
                </span>
              </div>

              {selectedAssignment.notes && (
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                    Notas
                  </p>
                  <p className="text-sm text-gray-700 bg-yellow-50/50 p-3 rounded-lg border border-yellow-100/50">
                    {selectedAssignment.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
