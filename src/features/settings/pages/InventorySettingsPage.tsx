import { InventoryCatalogManager } from "@/features/inventory/components/InventoryCatalogManager";
import { MaterialFormModal } from "@/features/inventory/components/MaterialFormModal";
import { useInventoryCategories, useInventoryUnits } from "@/features/inventory/hooks/useInventory";
import { Button } from "@/shared/components/core/Button";
import { useModal } from "@/shared/hooks/useModal";
import { PackagePlus } from "lucide-react";
import { SettingsPageHeader } from "../components/SettingsPageHeader";

export default function InventorySettingsPage() {
  const materialModal = useModal();
  const categories = useInventoryCategories();
  const units = useInventoryUnits();

  return (
    <>
      <SettingsPageHeader
        title="Inventario"
        description="Materiales, categorías y unidades de medida del catálogo"
        actions={<Button variant="outline" size="sm" icon={PackagePlus} onClick={materialModal.open}>Nuevo material</Button>}
      />
      <div className="p-8">
        <div className="max-w-5xl">
          <InventoryCatalogManager />
        </div>
      </div>
      <MaterialFormModal isOpen={materialModal.isOpen} onClose={materialModal.close} material={null} categories={categories.data?.data ?? []} units={units.data?.data ?? []} />
    </>
  );
}
