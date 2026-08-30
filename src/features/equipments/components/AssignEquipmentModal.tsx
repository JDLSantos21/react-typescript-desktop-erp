import { Modal } from "@/shared/components/core/Modal";
import CustomerSearch from "@/shared/components/CustomerSearch";
import { useAssignEquipment, useAttachCustomerDocument, useCustomerDocumentStatus } from "../hooks/useEquipments";
import {
  Customer,
  CustomerAddress,
} from "@/shared/types/entities/customer.types";
import { useState } from "react";
import { Button } from "@/shared/components/core/Button";
import { Textarea } from "@/shared/components/core/Textarea";
import { FileText, Upload } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

interface assignmentModalProps {
  equipmentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AssignEquipmentModal({
  equipmentId,
  isOpen,
  onClose,
}: assignmentModalProps) {
  const { mutateAsync: assignEquipment, isPending } = useAssignEquipment();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [address, setAddress] = useState<CustomerAddress | null>(null);
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState(1);
  const identityStatus = useCustomerDocumentStatus(customer?.id);
  const attachIdentity = useAttachCustomerDocument();
  const identityInput = useRef<HTMLInputElement>(null);

  const handleSelectCustomer = (customer: Customer) => {
    setCustomer(customer);
    setAddress(null);
    setStep(2);
  };

  const handleSelectAddress = (address: CustomerAddress) => {
    setAddress(address);
    setStep(3);
  };

  const handleCancel = () => {
    setStep(1);
    setCustomer(null);
    setAddress(null);
    setNotes("");
    onClose();
  };

  const handleAssignEquipment = async () => {
    if (!customer || !address) return;

    try {
      await assignEquipment({
        equipmentId,
        customerId: customer.id,
        customerAddressId: address.id,
        notes,
      });
    } finally {
      handleCancel();
    }
  };

  const uploadIdentity = async (file?: File) => {
    if (!file || !customer) return;
    try {
      await attachIdentity.mutateAsync({ customerId: customer.id, file });
      toast.success("Cédula agregada al expediente");
    } catch {
      toast.error("No se pudo cargar la cédula. Puedes continuar con la asignación.");
    }
  };

  const steps = [
    {
      id: 1,
      title: "Seleccionar cliente",
      content: (
        <>
          <p className="text-sm text-gray-600 mb-1">
            Busca el cliente al que deseas asignarle el equipo
          </p>
          <CustomerSearch
            selectedCustomerId={customer?.id}
            onSelectCustomer={handleSelectCustomer}
          />
        </>
      ),
    },
    {
      id: 2,
      title: "Seleccionar dirección",
      content: (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-600">Cliente seleccionado</p>
              <p className="font-semibold  text-text-primary">
                {customer?.businessName}
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setStep(1)}>
              Cambiar cliente
            </Button>
          </div>
          <div className="space-y-2">
            {customer?.addresses.map((addr) => (
              <button
                type="button"
                key={addr.id}
                onClick={() => handleSelectAddress(addr)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  address?.id === addr.id
                    ? "bg-primary/5 border-l-4 border-primary"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">{addr.branchName}</p>
                    <p className="text-sm text-gray-600">{addr.city}</p>
                    <p className="text-sm text-gray-600">{addr.direction}</p>
                  </div>
                  {address?.id === addr.id && (
                    <div className="ml-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                        Seleccionado
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Notas",
      content: (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-600">Cliente seleccionado</p>
              <p className="font-semibold  text-text-primary">
                {customer?.businessName}
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setStep(1)}>
              Cambiar cliente
            </Button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-600">Dirección seleccionada</p>
              <p className="font-semibold  text-text-primary">
                {address?.branchName}
              </p>
              <p className="text-sm text-gray-600">{address?.direction}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setStep(2)}>
              Cambiar dirección
            </Button>
          </div>
          <Textarea
            onChange={(e) => setNotes(e.target.value)}
            label="Notas"
            placeholder="Este campo es opcional"
          />
          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-slate-400" />
              <div className="min-w-0 flex-1"><p className="text-sm font-medium text-slate-900">Cédula del cliente</p><p className="text-xs text-slate-500">{identityStatus.data?.data.hasIdentity ? "Documento registrado" : "Pendiente; no bloquea la asignación ni la entrega"}</p></div>
              {!identityStatus.data?.data.hasIdentity ? <><input ref={identityInput} type="file" accept="application/pdf,image/jpeg,image/png" className="hidden" onChange={(event) => uploadIdentity(event.target.files?.[0])} /><Button type="button" size="sm" variant="outline" icon={Upload} isLoading={attachIdentity.isPending} onClick={() => identityInput.current?.click()}>Agregar</Button></> : null}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Asignar equipo" size="lg">
      <div className="p-6">{steps[step - 1].content}</div>

      <Modal.Footer>
        <Button variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        {step === 3 ? (
          <Button
            isLoading={isPending}
            onClick={handleAssignEquipment}
            disabled={isPending}
          >
            {isPending ? "Asignando equipo..." : "Asignar equipo"}
          </Button>
        ) : null}
      </Modal.Footer>
    </Modal>
  );
}
