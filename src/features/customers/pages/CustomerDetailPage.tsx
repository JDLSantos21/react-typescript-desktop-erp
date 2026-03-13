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
import CustomerHistoryModal from "../components/CustomerHistoryModal";
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

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedPhone, setSelectedPhone] = useState<CustomerPhone>();
  const [selectedAddress, setSelectedAddress] = useState<CustomerAddress>();

  const { data, isLoading, error, refetch, isError, isRefetching } =
    useCustomerById(id ?? "");
  useRefetchToast(isRefetching, "Actualizando información del cliente...");

  const addressModal = useModal();
  const phoneModal = useModal();
  const equipmentModal = useModal();
  const ordersHistoryModal = useModal();
  const editModal = useModal();
  const mapModal = useModal();

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
            <div className="flex-1 p-8 space-y-8 max-w-4xl overflow-y-auto">
              {/* Información General */}
              <section>
                <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-4">
                  Información General
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <p className="text-xs text-gray-400 mb-1.5">
                        Nombre comercial
                      </p>
                      <p className="text-gray-900">{data!.data.businessName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1.5">
                        Representante
                      </p>
                      <p className="text-gray-900">
                        {data!.data.representativeName}
                      </p>
                    </div>
                    {data!.data.email && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1.5">
                          Correo electrónico
                        </p>
                        <p className="text-gray-900">{data!.data.email}</p>
                      </div>
                    )}
                    {data!.data.rnc && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1.5">RNC</p>
                        <p className="font-mono text-gray-900">
                          {formatRNC(data!.data.rnc)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Direcciones y Teléfonos */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
                {/* Direcciones */}
                <section>
                  <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-4">
                    Direcciones
                  </h2>
                  <CustomerAddressList
                    addresses={data!.data.addresses}
                    onSelect={(address) => {
                      setSelectedAddress(address);
                      addressModal.open();
                    }}
                  />
                </section>

                {/* Teléfonos */}
                <section>
                  <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-4">
                    Teléfonos
                  </h2>
                  <CustomerPhoneList
                    phones={data!.data.phones}
                    onSelect={(phone) => {
                      setSelectedPhone(phone);
                      phoneModal.open();
                    }}
                  />
                </section>
              </div>

              {/* Actividad Reciente */}
              <section className="border-t border-gray-100 pt-8">
                <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-4">
                  Actividad Reciente
                </h2>
                <FeatureErrorBoundary featureName="Actividad Reciente">
                  <CustomerActivitySection
                    onViewEquipmentHistory={equipmentModal.open}
                    onViewOrderHistory={ordersHistoryModal.open}
                  />
                </FeatureErrorBoundary>
              </section>
            </div>

            <CustomerAsideMenu
              onOpenCreatePhoneModal={() => {
                setSelectedPhone(undefined);
                phoneModal.open();
              }}
              onOpenCreateAddressModal={addressModal.open}
              onOpenEditModal={editModal.open}
              onOpenNearbyVehiclesMapModal={mapModal.open}
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
      <PhoneModal
        isOpen={phoneModal.isOpen}
        onClose={phoneModal.close}
        customerId={id}
        phone={selectedPhone}
      />
      <CustomerHistoryModal
        isOpen={equipmentModal.isOpen}
        onClose={equipmentModal.close}
        customerId={id}
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
    </div>
  );
}
