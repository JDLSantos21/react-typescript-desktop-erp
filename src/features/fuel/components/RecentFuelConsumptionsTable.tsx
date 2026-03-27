import { Table } from "@/shared/components/core/Table";
import { useGetFuelConsumptions } from "../hooks/useFuel";
import { EmptyState } from "@/shared/components/EmptyState";
import { FuelConsumptionTableColumns } from "../config/FuelTableConfig";

export default function RecentFuelConsumptionsTable() {
  const { data, isLoading } = useGetFuelConsumptions({
    limit: 10,
    page: 1,
  });

  const tableData = data?.data || [];

  if (tableData.length === 0) {
    return (
      <EmptyState
        title="No hay consumos registrados"
        description="No se han registrado consumos de combustible"
      />
    );
  }

  return (
    <Table
      columns={FuelConsumptionTableColumns}
      data={tableData}
      keyExtractor={(item) => item.id.toString()}
      isLoading={isLoading}
      minRows={4}
    />
  );
}
