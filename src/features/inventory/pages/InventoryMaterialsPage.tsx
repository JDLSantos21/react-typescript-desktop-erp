import { useState } from "react";
import { Search } from "lucide-react";
import ConfirmDialog from "@/shared/components/core/ConfirmDialog";
import { Button } from "@/shared/components/core/Button";
import { Input } from "@/shared/components/core/Input";
import { Pagination } from "@/shared/components/core/Pagination";
import { SearchSelect } from "@/shared/components/core/SearchSelect";
import { ErrorState } from "@/shared/components/ErrorState";
import SectionLoader from "@/shared/components/SectionLoader";
import { PermissionLevel } from "@/shared/authorization/permissions";
import { useCanAccess } from "@/shared/authorization/usePermission";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { useListParams } from "@/shared/hooks/useListParams";
import { useModal } from "@/shared/hooks/useModal";
import { InventoryMaterialsTable } from "../components/InventoryTables";
import { MaterialFormModal } from "../components/MaterialFormModal";
import { StockMovementModal } from "../components/StockMovementModal";
import { useDeleteMaterial, useInventoryCategories, useInventoryUnits, useMaterials } from "../hooks/useInventory";
import type { InventoryMaterial } from "../types/inventory";

export default function InventoryMaterialsPage() {
  const materialModal = useModal();
  const movementModal = useModal();
  const [selectedMaterial, setSelectedMaterial] = useState<InventoryMaterial | null>(null);
  const [pendingDelete, setPendingDelete] = useState<InventoryMaterial | null>(null);
  const canManage = useCanAccess(PermissionLevel.SUPERVISION);
  const canMove = useCanAccess(PermissionLevel.ADVANCED_OPERATIONS);
  const canDelete = useCanAccess(PermissionLevel.ADMINISTRATION);
  const { filters, queryParams, setFilter, setPage, setLimit, clearAll, hasActiveFilters } = useListParams({
    initialFilters: { search: "", unitId: undefined as number | undefined },
    defaultLimit: 10,
  });
  const materials = useMaterials(queryParams);
  const materialOptions = useMaterials({ page: 1, limit: 100 });
  const categories = useInventoryCategories();
  const units = useInventoryUnits();
  const deleteMaterial = useDeleteMaterial();

  const openEdit = (material: InventoryMaterial) => { setSelectedMaterial(material); materialModal.open(); };
  const openMove = (material: InventoryMaterial) => { setSelectedMaterial(material); movementModal.open(); };
  useHeaderConfig({ title: "Materiales", description: "Catálogo, existencias y mínimos de inventario" });
  const pagination = materials.data?.meta.pagination;
  const confirmDelete = async () => {
    if (!pendingDelete || !canDelete) return;
    await deleteMaterial.mutateAsync(pendingDelete.id);
    setPendingDelete(null);
  };

  return <>
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-gray-50/50">
      <div className="shrink-0 border-b border-gray-200 bg-white px-6 py-3">
        <div className="grid items-center gap-3 md:grid-cols-[minmax(16rem,1.4fr)_minmax(13rem,1fr)_auto] xl:max-w-3xl">
          <Input aria-label="Buscar materiales" value={filters.search} onChange={(event) => setFilter("search", event.target.value)} placeholder="Buscar material o descripción" inputSize="sm" startIcon={<Search className="h-4 w-4" />} />
          <SearchSelect size="sm" options={(units.data?.data ?? []).map((unit) => ({ value: String(unit.id), label: unit.name }))} value={filters.unitId ? String(filters.unitId) : ""} onValueChange={(value) => setFilter("unitId", value ? Number(value) : undefined)} allowClear clearLabel="Todas las unidades" placeholder="Todas las unidades" />
          <Button variant="outline" size="sm" onClick={clearAll} disabled={!hasActiveFilters}>Limpiar</Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        {materials.isLoading ? <SectionLoader placeholder="Cargando materiales" /> : materials.isError ? <ErrorState title="No se pudieron cargar los materiales" error={materials.error} onRetry={materials.refetch} /> : <InventoryMaterialsTable materials={materials.data?.data ?? []} onEdit={openEdit} onMove={openMove} onDelete={setPendingDelete} canEdit={canManage} canMove={canMove} canDelete={canDelete} />}
      </div>

      {pagination ? <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-2"><Pagination currentPage={pagination.page} totalPages={pagination.totalPages} limit={pagination.limit} totalItems={pagination.total} onPageChange={setPage} onLimitChange={setLimit} /></div> : null}
    </div>
    {canManage ? <MaterialFormModal isOpen={materialModal.isOpen} onClose={materialModal.close} material={selectedMaterial} categories={categories.data?.data ?? []} units={units.data?.data ?? []} /> : null}
    {canMove ? <StockMovementModal isOpen={movementModal.isOpen} onClose={movementModal.close} materials={materialOptions.data?.data ?? []} initialMaterialId={selectedMaterial?.id} canAdjust={canManage} /> : null}
    {canDelete ? <ConfirmDialog isOpen={Boolean(pendingDelete)} onCancel={() => setPendingDelete(null)} onConfirm={confirmDelete} isLoading={deleteMaterial.isPending} variant="danger" title="Eliminar material" description={`Eliminarás “${pendingDelete?.name ?? ""}”. Solo se permitirá si no tiene movimientos asociados.`} confirmText="Eliminar material" /> : null}
  </>;
}
