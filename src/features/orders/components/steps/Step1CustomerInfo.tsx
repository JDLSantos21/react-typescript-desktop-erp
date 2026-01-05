import { useEffect, useState } from "react";
import { Select, Button } from "@/shared/components"; // Asumo Button existe
import CustomerSearch from "@/shared/components/CustomerSearch";
import { Customer } from "@/shared/types/entities/customer.types";
import { useCustomerById } from "@/features/customers/hooks/useCustomer";
import { OrderStepData } from "../../hooks/useOrderSteps";
import SectionLoader from "@/shared/components/SectionLoader";
import { UserIcon, MapPinIcon, RefreshCwIcon } from "lucide-react";
import { motion } from "motion/react";

interface Step1CustomerInfoProps {
  orderData: OrderStepData;
  updateOrderData: (data: Partial<OrderStepData>) => void;
  initialCustomerId?: string;
}

export default function Step1CustomerInfo({
  orderData,
  updateOrderData,
  initialCustomerId,
}: Step1CustomerInfoProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const { data: customerData, isLoading: isLoadingCustomer } = useCustomerById(
    orderData.customerId || ""
  );

  useEffect(() => {
    if (initialCustomerId && !orderData.customerId) {
      updateOrderData({ customerId: initialCustomerId });
    }
  }, [initialCustomerId]);

  useEffect(() => {
    if (customerData?.data) {
      setSelectedCustomer(customerData.data);
      if (!orderData.customerAddressId) {
        const primaryAddress = customerData.data.addresses.find(
          (a) => a.isPrimary
        );
        if (primaryAddress)
          updateOrderData({ customerAddressId: primaryAddress.id });
      }
    }
  }, [customerData]);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    updateOrderData({ customerId: customer.id, customerAddressId: undefined });
  };

  const addressOptions =
    selectedCustomer?.addresses.map((addr) => ({
      value: addr.id.toString(),
      label: `${addr.direction}, ${addr.city}${
        addr.isPrimary ? " (Principal)" : ""
      }`,
    })) || [];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-slate-900">
          ¿Para quién es este pedido?
        </h2>
        <p className="text-slate-500 text-sm">
          Busca un cliente existente para comenzar.
        </p>
      </div>

      {!selectedCustomer ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50 p-8 rounded-2xl border border-dashed border-slate-300 text-center"
        >
          <CustomerSearch
            onSelectCustomer={handleSelectCustomer}
            selectedCustomerId={orderData.customerId}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Tarjeta de Cliente Seleccionado */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-900" />{" "}
            {/* Acento lateral */}
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    {selectedCustomer.businessName}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {selectedCustomer.representativeName}
                  </p>
                  {selectedCustomer.rnc && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 mt-2">
                      RNC: {selectedCustomer.rnc}
                    </span>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCustomer(null);
                  updateOrderData({
                    customerId: undefined,
                    customerAddressId: undefined,
                  });
                }}
                icon={RefreshCwIcon}
                className="text-slate-500 hover:text-slate-800"
              >
                Cambiar
              </Button>
            </div>
          </div>

          {/* Selección de Dirección */}
          <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold">
              <MapPinIcon className="w-5 h-5 text-slate-400" />
              <span>Destino de Entrega</span>
            </div>

            {isLoadingCustomer ? (
              <SectionLoader placeholder="Cargando direcciones..." />
            ) : (
              <Select
                options={addressOptions}
                value={orderData.customerAddressId?.toString()}
                onValueChange={(value) =>
                  updateOrderData({ customerAddressId: parseInt(value) })
                }
                placeholder="Selecciona una dirección..."
                className="bg-white"
              />
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
