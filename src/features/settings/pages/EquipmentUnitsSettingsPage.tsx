import CreateEquipment from "@/features/equipments/components/CreateEquipment";
import RecentEquipmentTable from "@/features/equipments/components/RecentEquipmentTable";
import { SettingsPageHeader } from "../components/SettingsPageHeader";

export default function EquipmentUnitsSettingsPage() {
  return (
    <>
      <SettingsPageHeader
        title="Unidades de equipo"
        description="Genera unidades serializadas a partir de un modelo registrado"
      />
      <div className="p-8">
        <div className="grid max-w-5xl gap-8 xl:grid-cols-[minmax(20rem,0.8fr)_minmax(0,1.2fr)]">
          <CreateEquipment />
          <RecentEquipmentTable />
        </div>
      </div>
    </>
  );
}
