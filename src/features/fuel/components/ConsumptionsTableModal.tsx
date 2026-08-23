import { Modal } from "@/shared/components/core/Modal";
import { useGetFuelConsumptions } from "../hooks/useFuel";
import { Table } from "@/shared/components/core/Table";
import { FuelConsumptionTableColumns } from "../config/FuelTableConfig";
import { Button } from "@/shared/components/core/Button";
import { useListParams } from "@/shared/hooks/useListParams";
import { Pagination } from "@/shared/components/core/Pagination";
import { APP_CONFIG } from "@/shared/constants/config";

export interface ConsumptionsTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  tankRefillId: number;
}

export default function ConsumptionsTableModal({
  isOpen,
  onClose,
  tankRefillId,
}: ConsumptionsTableModalProps) {
  const { queryParams, setPage, setLimit } = useListParams({
    initialFilters: {
      search: "",
      vehicleId: "",
      driverId: "",
    },
    defaultLimit: APP_CONFIG.PAGINATION.DEFAULT_LIMIT,
    syncWithUrl: false,
  });

  const { data: consumptions, isLoading } = useGetFuelConsumptions(
    {
      ...queryParams,
      tankRefillId: tankRefillId,
    },
    isOpen,
  );

  const pagination = consumptions?.meta.pagination;

  return (
    <Modal
      title="Consumos asociados al reabastecimiento"
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      className="h-[85vh] flex flex-col"
    >
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Top Actions */}
        <div className="shrink-0 p-6 flex justify-end">
          <Button variant="outline" size="sm">
            Imprimir reporte
          </Button>
        </div>

        {/* Scrolling Table */}
        <div className="flex-1 min-h-0 px-6 pb-6">
          <Table
            data={consumptions?.data || []}
            columns={FuelConsumptionTableColumns}
            keyExtractor={(c) => c.id.toString()}
            isLoading={isLoading}
          />
        </div>

        {/* Fixed Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="shrink-0 bg-white border-t border-gray-100 px-6 py-4 mt-auto w-full">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              limit={pagination.limit}
              totalItems={pagination.total}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
