import { useNavigate, useParams } from "react-router-dom";
import { useCustomerById } from "../hooks/useCustomer";
import { ErrorState } from "@/shared/components/ErrorState";
import SectionLoader from "@/shared/components/SectionLoader";
import { formatDate } from "@/shared/utils/formatters";
import { formatRNC } from "@/shared/utils/formatters";
import AddressModal from "../components/AddressModal";
import CustomerAddressList from "../components/CustomerAddressList";
import CustomerPhoneList from "../components/CustomerPhoneList";
import CustomerActivitySection from "../components/CustomerActivitySection";
import { useModal } from "@/shared/hooks/useModal";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import EditCustomerModal from "../components/EditCustomerModal";
import PhoneModal from "../components/PhoneModal";
import { useState, useMemo } from "react";
import {
  CustomerAddress,
  CustomerPhone,
} from "@/shared/types/entities/customer.types";
import { useRefetchToast } from "@/shared/hooks/useRefetchToast";
import CustomerAsideMenu from "../components/CustomerAsideMenu";
import NearbyVehiclesMapModal from "../components/NearbyVehiclesMapModal";
import { FeatureErrorBoundary } from "@/shared/components/error-boundary/FeatureErrorBoundary";
import { CustomerEmailModal } from "@/features/email/components/CustomerEmailModal";
import { AddressDetailModal } from "../components/AddressDetailModal";
import { PhoneDetailModal } from "../components/PhoneDetailModal";
import { useDeleteCustomerAddress, useDeleteCustomerPhone } from "../hooks/useCustomer";
import { toast } from "sonner";
import { CustomerDocumentsModal } from "../components/CustomerDocumentsModal";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useEquipmentInactivityAlerts } from "@/features/equipments/hooks/useEquipments";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedPhone, setSelectedPhone] = useState<CustomerPhone>();
  const [selectedAddress, setSelectedAddress] = useState<CustomerAddress>();

  const { data, isLoading, error, refetch, isError, isRefetching } =
    useCustomerById(id ?? "");
  const equipmentAlerts = useEquipmentInactivityAlerts({ page: 1, limit: 3, customerId: id, state: "ALERTA" }, Boolean(id));
  useRefetchToast(isRefetching, "Actualizando información del cliente...");

  const addressModal = useModal();
  const phoneModal = useModal();
  const equipmentModal = useModal();
  const editModal = useModal();
  const mapModal = useModal();
  const emailModal = useModal();
  const documentsModal = useModal();
  const addressDetailModal = useModal();
  const phoneDetailModal = useModal();
  const deleteAddress = useDeleteCustomerAddress(id ?? "");
  const deletePhone = useDeleteCustomerPhone(id ?? "");

  const headerConfig = useMemo(
    () => ({
      title: "",
      showBackButton: true,
      customContent: data?.data ? (
        <div className="flex items-center px-3 py-1 w-full gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">
              {data.data.businessName}
            </h2>
            <div className="flex gap-2 items-center text-sm text-text-secondary h-8">
              <p>{data.data.representativeName}</p>
              {data.data.rnc && (
                <>
                  <div className="border-l border-gray-200 h-3 mx-2" />
                  <p className="font-mono text-xs">
                    {formatRNC(data.data.rnc)}
                  </p>
                </>
              )}
              <div className="border-l border-gray-200 h-3 mx-2" />
              <p className="text-xs text-gray-400">
                Registrado el {formatDate(data.data.createdAt)}
              </p>
            </div>
          </div>
        </div>
      ) : undefined,
    }),
    [data?.data, navigate],
  );

  useHeaderConfig(headerConfig);

  if (!id) {
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

  return (
    <div className="h-full">
      <section className="h-full">
        {isLoading ? (
          <SectionLoader
            className="h-full"
            placeholder="Cargando información"
          />
        ) : isError ? (
          <ErrorState
            title="Ocurrió un problema"
            message="No se pudo cargar la información del cliente"
            error={error}
            onRetry={() => refetch()}
            retryLabel="Reintentar"
          />
        ) : (
          <div className="flex h-full">
            <div className="flex-1 max-w-5xl overflow-y-auto px-8 py-7 show-scrollbar">
              <div className="space-y-8 pb-8">
                {equipmentAlerts.data?.meta.pagination.total ? <button type="button" onClick={() => navigate(`/equipments/alerts?search=${encodeURIComponent(data!.data.businessName)}`)} className="flex w-full items-center gap-4 rounded-2xl bg-amber-50 px-5 py-4 text-left text-amber-950 transition-colors hover:bg-amber-100/80"><span className="rounded-xl bg-white p-2.5 text-amber-600"><AlertTriangle className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">Este cliente requiere seguimiento de consumo</span><span className="mt-1 block text-xs text-amber-800/75">{equipmentAlerts.data.meta.pagination.total} {equipmentAlerts.data.meta.pagination.total === 1 ? "equipo superó" : "equipos superaron"} el plazo configurado sin pedidos relacionados.</span></span><ArrowRight className="h-4 w-4 text-amber-600" /></button> : null}
                <section>
                  <h2 className="text-sm font-semibold text-slate-900">Perfil del cliente</h2>
                  <dl className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
                    <Detail label="Nombre comercial" value={data!.data.businessName} />
                    <Detail label="Representante" value={data!.data.representativeName} />
                    <Detail label="Correo electrónico" value={data!.data.email || "Sin correo registrado"} />
                    <Detail label="RNC" value={data!.data.rnc ? formatRNC(data!.data.rnc) : "Sin RNC registrado"} mono />
                  </dl>
                </section>

                <div className="grid gap-8 xl:grid-cols-2">
                  <section>
                    <h2 className="text-sm font-semibold text-slate-900">Direcciones</h2>
                    <div className="mt-4">
                      <CustomerAddressList
                        addresses={data!.data.addresses}
                        onSelect={(address) => {
                          setSelectedAddress(address);
                          addressDetailModal.open();
                        }}
                      />
                    </div>
                  </section>
                  <section>
                    <h2 className="text-sm font-semibold text-slate-900">Teléfonos</h2>
                    <div className="mt-4">
                      <CustomerPhoneList
                        phones={data!.data.phones}
                        onSelect={(phone) => {
                          setSelectedPhone(phone);
                          phoneDetailModal.open();
                        }}
                      />
                    </div>
                  </section>
                </div>

                <FeatureErrorBoundary featureName="Actividad reciente">
                  <CustomerActivitySection
                    customerId={id}
                    onViewEquipmentHistory={equipmentModal.open}
                  />
                </FeatureErrorBoundary>
              </div>
            </div>

            <CustomerAsideMenu
              onOpenCreatePhoneModal={() => {
                setSelectedPhone(undefined);
                phoneModal.open();
              }}
              onOpenCreateAddressModal={addressModal.open}
              onOpenEditModal={editModal.open}
              onOpenNearbyVehiclesMapModal={mapModal.open}
              onOpenEmailModal={emailModal.open}
              onOpenDocumentsModal={documentsModal.open}
            />
          </div>
        )}
      </section>
      <AddressModal
        isOpen={addressModal.isOpen}
        onClose={() => {
          setSelectedAddress(undefined);
          addressModal.close();
        }}
        customerId={id}
        address={selectedAddress}
      />
      <AddressDetailModal
        address={selectedAddress}
        isOpen={addressDetailModal.isOpen}
        onClose={addressDetailModal.close}
        onEdit={() => { addressDetailModal.close(); addressModal.open(); }}
        onDelete={() => { if (!selectedAddress) return; deleteAddress.mutate(selectedAddress.id, { onSuccess: () => { toast.success("Dirección eliminada"); addressDetailModal.close(); setSelectedAddress(undefined); }, onError: () => toast.error("No se pudo eliminar la dirección") }); }}
      />
      <PhoneModal
        isOpen={phoneModal.isOpen}
        onClose={phoneModal.close}
        customerId={id}
        phone={selectedPhone}
      />
      <PhoneDetailModal
        phone={selectedPhone}
        isOpen={phoneDetailModal.isOpen}
        onClose={phoneDetailModal.close}
        onEdit={() => { phoneDetailModal.close(); phoneModal.open(); }}
        onDelete={() => { if (!selectedPhone) return; deletePhone.mutate(selectedPhone.id, { onSuccess: () => { toast.success("Teléfono eliminado"); phoneDetailModal.close(); setSelectedPhone(undefined); }, onError: () => toast.error("No se pudo eliminar el teléfono") }); }}
      />
      {data?.data ? (
        <EditCustomerModal
          customer={data.data}
          isOpen={editModal.isOpen}
          onClose={editModal.close}
        />
      ) : null}
      {data?.data.addresses ? (
        <NearbyVehiclesMapModal
          isOpen={mapModal.isOpen}
          onClose={mapModal.close}
          addreses={data?.data.addresses}
        />
      ) : null}
      {data?.data ? (
        <CustomerEmailModal
          customerId={id}
          email={data.data.email}
          isOpen={emailModal.isOpen}
          onClose={emailModal.close}
        />
      ) : null}
      <CustomerDocumentsModal customerId={id} isOpen={documentsModal.isOpen} onClose={documentsModal.close} />
    </div>
  );
}

function Detail({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd
        className={`mt-1.5 break-words text-sm text-slate-800 ${mono ? "font-mono" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
