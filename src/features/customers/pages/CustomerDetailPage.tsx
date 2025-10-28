import { useNavigate, useParams } from "react-router-dom";
import { useCustomerById } from "../hooks/useCustomer";
import { Button, ErrorState } from "@/shared/components";
import SectionLoader from "@/shared/components/SectionLoader";
import { formatDate, formatRNC } from "@/shared/utils";
import AsideMenu from "../components/AsideMenu";
import CreateAddressModal from "../components/CreateAddressModal";
import CreatePhoneModal from "../components/CreatePhoneModal";
import CustomerAddressList from "../components/CustomerAddressList";
import CustomerPhoneList from "../components/CustomerPhoneList";
import CustomerActivitySection from "../components/CustomerActivitySection";
import CustomerHistoryModal from "../components/CustomerHistoryModal";
import { useModal, useHeaderConfig } from "@/shared/hooks";

export default function CustomerDetailPage() {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error, refetch, isError } = useCustomerById(
    customerId ?? ""
  );

  const addressModal = useModal();
  const phoneModal = useModal();
  const historyModal = useModal();

  useHeaderConfig({
    title: data?.data.businessName || "Cargando...",
    description: data?.data.representativeName
      ? `Representante: ${data.data.representativeName}`
      : undefined,
    actions: (
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Volver
        </Button>
        <Button variant="danger">Eliminar</Button>
      </div>
    ),
  });

  if (!customerId) {
    return (
      <ErrorState
        variant="error"
        title="ID de cliente no encontrado"
        message="No se proporcionó un ID de cliente válido"
        onRetry={() => navigate(-1)}
        retryLabel="Volver"
      />
    );
  }

  const ErrorStateComp = () => {
    return (
      <ErrorState
        title="Ocurrió un problema"
        message="No se pudo cargar la información del cliente"
        error={error}
        onRetry={() => refetch()}
        retryLabel="Reintentar"
      />
    );
  };

  return (
    <div className="p-6">
      <section>
        {isLoading ? (
          <SectionLoader placeholder="Cargando información del cliente..." />
        ) : isError ? (
          <ErrorStateComp />
        ) : (
          <div className="flex gap-4">
            <section className="flex-1 space-y-4 relative">
              {/* Información General */}
              <div className="bg-background border border-border-light rounded-lg shadow-sm overflow-hidden">
                <div className="bg-background-secondary px-6 py-4 border-b border-border-light">
                  <h3 className="text-lg font-semibold text-text-primary">
                    Información General
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    <InfoItem
                      label="Nombre comercial"
                      value={data!.data.businessName}
                    />
                    <InfoItem
                      label="Representante"
                      value={data!.data.representativeName}
                    />

                    {data!.data.rnc && (
                      <InfoItem label="RNC" value={formatRNC(data!.data.rnc)} />
                    )}

                    {data!.data.email && (
                      <InfoItem
                        label="Correo electrónico"
                        value={data!.data.email}
                      />
                    )}

                    <InfoItem
                      label="Registrado"
                      value={formatDate(data!.data.createdAt)}
                    />
                  </div>
                </div>
              </div>

              {/* Actividad Reciente → Equipos + Último Pedido */}
              <CustomerActivitySection
                onViewEquipmentHistory={historyModal.open}
                onViewOrderHistory={historyModal.open}
              />

              <div className="flex flex-col xl:flex-row gap-4">
                {/* Direcciones */}
                <div className="bg-background border border-border-light rounded-lg shadow-sm overflow-hidden xl:w-1/2">
                  <div className="bg-background-secondary px-6 py-4 border-b border-border-light">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-text-primary">
                        Direcciones
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <CustomerAddressList addresses={data!.data.addresses} />
                  </div>
                </div>

                {/* Teléfonos */}
                <div className="bg-background border border-border-light rounded-lg shadow-sm overflow-hidden xl:w-1/2">
                  <div className="bg-background-secondary px-6 py-4 border-b border-border-light">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-text-primary">
                        Teléfonos
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <CustomerPhoneList phones={data!.data.phones} />
                  </div>
                </div>
              </div>
            </section>

            <AsideMenu
              onOpenCreatePhoneModal={phoneModal.open}
              onOpenCreateAddressModal={addressModal.open}
            />
          </div>
        )}
      </section>
      <CreateAddressModal
        isOpen={addressModal.isOpen}
        onClose={addressModal.close}
        customerId={customerId}
      />
      <CreatePhoneModal
        isOpen={phoneModal.isOpen}
        onClose={phoneModal.close}
        customerId={customerId}
      />
      <CustomerHistoryModal
        isOpen={historyModal.isOpen}
        onClose={historyModal.close}
        customerId={customerId}
      />
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-text-muted text-xs font-medium uppercase tracking-wide">
        {label}
      </span>
      <p className="text-text-primary font-medium text-sm">{value}</p>
    </div>
  );
}
