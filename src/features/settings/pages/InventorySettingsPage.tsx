import { InventoryCatalogManager } from "@/features/inventory/components/InventoryCatalogManager";
import { SettingsPageHeader } from "../components/SettingsPageHeader";

export default function InventorySettingsPage() {
  return (
    <>
      <SettingsPageHeader
        title="Inventario"
        description="Categorías y unidades de medida que estructuran el catálogo de materiales"
      />
      <div className="p-8">
        <div className="max-w-5xl">
          <InventoryCatalogManager />
        </div>
      </div>
    </>
  );
}
