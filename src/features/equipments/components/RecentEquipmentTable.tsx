import { Table } from "@/shared/components/core/Table";
import { equipmentColumns } from "../config/equipmentsTableConfig";
import { useGetEquipments } from "../hooks/useEquipments";

export default function RecentEquipmentTable() {
  const { data, isLoading } = useGetEquipments({ limit: 4, page: 1 });

  return (
    <div className="p-3 col-span-2 border border-border-light rounded-sm shadow">
      <h3 className="text-lg font-bold text-text-primary uppercase">
        Historial de equipos
      </h3>
      <div>
        <Table
          isLoading={isLoading}
          minRows={4}
          columns={equipmentColumns}
          data={data?.data ?? []}
          keyExtractor={(item) => item.id}
        />
      </div>
    </div>
  );
}
