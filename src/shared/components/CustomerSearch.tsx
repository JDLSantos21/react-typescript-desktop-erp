import { useState } from "react";
import { Input } from "@/shared/components";
import { SearchIcon } from "lucide-react";
import { useGetCustomers } from "@/features/customers/hooks/useCustomer";
import { useDebounce } from "@/shared/hooks";
import { Customer } from "@/shared/types/entities/customer.types";
import { Spinner } from "@/shared/components/core/Spinner";

interface CustomerSearchProps {
  onSelectCustomer: (customer: Customer) => void;
  selectedCustomerId?: string;
}

export default function CustomerSearch({
  onSelectCustomer,
  selectedCustomerId,
}: CustomerSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: customersData, isLoading } = useGetCustomers({
    search: debouncedSearch,
    page: 1,
    limit: 10,
  });

  const customers = customersData?.data || [];

  return (
    <div className="w-full space-y-4">
      {/* Search Input */}
      <Input
        placeholder="Buscar por nombre comercial, representante o RNC..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        startIcon={<SearchIcon className="w-5 h-5" />}
      />

      {/* Results */}
      <div className="overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm
              ? "No se encontraron clientes"
              : "Escribe para buscar clientes"}
          </div>
        ) : (
          <div className="divide-y divide-border max-h-[calc(100vh-342px)] overflow-y-auto">
            {customers.map((customer) => (
              <button
                key={customer.id}
                type="button"
                onClick={() => onSelectCustomer(customer)}
                className={`
                  w-full text-left p-4 hover:bg-gray-50 transition-colors cursor-pointer
                  ${
                    selectedCustomerId === customer.id
                      ? "bg-primary/5 border-l-4 border-primary"
                      : ""
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {customer.businessName}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {customer.representativeName}
                    </p>
                    {customer.rnc && (
                      <p className="text-xs text-gray-500 mt-1">
                        RNC: {customer.rnc}
                      </p>
                    )}
                  </div>
                  {selectedCustomerId === customer.id && (
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
        )}
      </div>
    </div>
  );
}
