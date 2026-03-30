import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { useGetTankRefills } from "../hooks/useFuel";
import { APP_CONFIG } from "@/shared/constants/config";
import { useListParams } from "@/shared/hooks/useListParams";
import { Table } from "@/shared/components/core/Table";
import { FuelRefillTableColumns } from "../config/RefillTableConfig";
import { Pagination } from "@/shared/components/core/Pagination";
import { TableFilters } from "@/shared/components/core/TableFilters";
import DateRangeSelector from "@/shared/components/core/DateRangeSelector";
import RegisterRefillModal from "../components/RegisterRefillModal";
import { useModal } from "@/shared/hooks/useModal";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/core/Button";

export default function RefillsPage() {
  const refillModal = useModal();

  useHeaderConfig({
    title: "Reabastecimientos",
    description: "Historial de reabastecimientos de combustible",
    actions: (
      <Button onClick={() => refillModal.open()} variant="outline">
        Nuevo reabastecimiento
      </Button>
    ),
  });

  const { filters, setFilters, queryParams, setPage, setLimit } = useListParams(
    {
      initialFilters: {
        search: "",
        user_id: "",
        start_date: undefined as string | undefined,
        end_date: undefined as string | undefined,
      },
      defaultLimit: APP_CONFIG.PAGINATION.DEFAULT_LIMIT,
      syncWithUrl: true,
    },
  );

  const navigate = useNavigate();

  const { data: refills, isLoading } = useGetTankRefills(queryParams);

  const pagination = refills?.meta.pagination;

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-1 px-6 pt-6">
          <TableFilters className="mb-2">
            <div className="flex w-full justify-end">
              <DateRangeSelector
                className="w-75"
                value={{
                  start_date: filters.start_date,
                  end_date: filters.end_date,
                }}
                onChange={(range) =>
                  setFilters({
                    start_date: range.start_date,
                    end_date: range.end_date,
                  })
                }
              />
            </div>
          </TableFilters>
          <Table
            columns={FuelRefillTableColumns}
            data={refills?.data || []}
            keyExtractor={(item) => item.id.toString()}
            isLoading={isLoading}
            onRowClick={(item) => navigate(`/fuel/refills/${item.id}`)}
          />
        </div>

        {pagination ? (
          <div className="shrink-0 w-full left-0 px-3 bg-white py-1 border-t border-border">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              limit={pagination.limit}
              totalItems={pagination.total}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </div>
        ) : null}
      </div>
      <RegisterRefillModal
        isOpen={refillModal.isOpen}
        onClose={refillModal.close}
      />
    </>
  );
}
