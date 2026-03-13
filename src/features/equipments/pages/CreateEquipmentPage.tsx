import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import CreateEquipmentModel from "../components/CreateEquipmentModel";
import CreateEquipment from "../components/CreateEquipment";
import RecentEquipmentTable from "../components/RecentEquipmentTable";

export default function CreateEquipmentPage() {
  useHeaderConfig({
    showBackButton: true,
    title: "Crear nuevo equipo",
    description: "Crea modelos y genera equipos nuevos",
  });

  return (
    <div className="grid grid-cols-2 grid-rows-2 p-3 gap-2">
      <CreateEquipment />
      <CreateEquipmentModel />
      <RecentEquipmentTable />
    </div>
  );
}
