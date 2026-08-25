import { Table } from "@/shared/components/core/Table";
import { equipmentColumns } from "../config/equipmentsTableConfig";
import { useGetEquipments } from "../hooks/useEquipments";

export default function RecentEquipmentTable() {
  const { data, isLoading } = useGetEquipments({ limit: 4, page: 1 });

  return (
    <section className="border-y border-slate-200 py-6">
      <h3 className="text-base font-semibold text-slate-900">Unidades recientes</h3>
      <div className="mt-4">
        <Table
          isLoading={isLoading}
          minRows={4}
          columns={equipmentColumns}
          data={data?.data ?? []}
          keyExtractor={(item) => item.id}
        />
      </div>
    </section>
  );
}
