import { useEffect, useState } from "react";
import { Select } from "@/shared/components/core/Select";
import CustomerSearch from "@/shared/components/CustomerSearch";
import { Customer } from "@/shared/types/entities/customer.types";
import { useCustomerById } from "@/features/customers/hooks/useCustomer";
import { OrderStepData } from "../../hooks/useOrderSteps";
import SectionLoader from "@/shared/components/SectionLoader";

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

  // Fetch customer details if we have a customerId
  const { data: customerData, isLoading: isLoadingCustomer } = useCustomerById(
    orderData.customerId || ""
  );

  // Set customer from URL param on mount
  useEffect(() => {
    if (initialCustomerId && !orderData.customerId) {
      updateOrderData({ customerId: initialCustomerId });
    }
  }, [initialCustomerId]);

  // Update selected customer when data loads
  useEffect(() => {
    if (customerData?.data) {
      setSelectedCustomer(customerData.data);

      // Auto-select primary address if not already selected
      if (!orderData.customerAddressId) {
        const primaryAddress = customerData.data.addresses.find(
          (a) => a.isPrimary
        );
        if (primaryAddress) {
          updateOrderData({ customerAddressId: primaryAddress.id });
        }
      }
    }
  }, [customerData]);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    updateOrderData({
      customerId: customer.id,
      // Reset address when changing customer
      customerAddressId: undefined,
    });
  };

  const addressOptions =
    selectedCustomer?.addresses.map((addr) => ({
      value: addr.id.toString(),
      label: `${addr.direction}, ${addr.city}${
        addr.isPrimary ? " (Principal)" : ""
      }`,
    })) || [];

  // const hasRequiredData = !!(
  //   orderData.customerId && orderData.customerAddressId
  // );

  return (
    <div className="space-y-6">
      {/* Customer Search */}
      {!selectedCustomer ? (
        <CustomerSearch
          onSelectCustomer={handleSelectCustomer}
          selectedCustomerId={orderData.customerId}
        />
      ) : (
        <div>
          {/* Selected Customer Card */}
          <div className="p-4">
            <div className="flex items-start justify-between space-y-4">
              <div>
                <p className="font-semibold text-gray-900 text-lg">
                  {selectedCustomer.businessName}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedCustomer.representativeName}
                </p>
                {selectedCustomer.rnc && (
                  <p className="text-xs text-gray-500 mt-1">
                    RNC: {selectedCustomer.rnc}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCustomer(null);
                  updateOrderData({
                    customerId: undefined,
                    customerAddressId: undefined,
                  });
                }}
                className="text-sm text-primary hover:text-primary/80 font-medium cursor-pointer"
              >
                Cambiar cliente
              </button>
            </div>
          </div>

          {/* Address Selection */}
          {isLoadingCustomer ? (
            <SectionLoader placeholder="Cargando direcciones" />
          ) : (
            <Select
              label="Dirección de entrega *"
              helperText="Selecciona la dirección de entrega del cliente entre su lista de direcciones."
              options={addressOptions}
              value={orderData.customerAddressId?.toString()}
              onValueChange={(value) =>
                updateOrderData({ customerAddressId: parseInt(value) })
              }
              className="w-xl"
              placeholder="Seleccionar dirección"
            />
          )}
        </div>
      )}
    </div>
  );
}
