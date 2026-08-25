import { ArrowLeftRight, Search } from "lucide-react";
import { Button } from "@/shared/components/core/Button";
import { Input } from "@/shared/components/core/Input";
import { Pagination } from "@/shared/components/core/Pagination";
import { SearchSelect } from "@/shared/components/core/SearchSelect";
import { ErrorState } from "@/shared/components/ErrorState";
import SectionLoader from "@/shared/components/SectionLoader";
import { PermissionGate } from "@/shared/authorization/PermissionGate";
import { PermissionLevel } from "@/shared/authorization/permissions";
import { useCanAccess } from "@/shared/authorization/usePermission";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { useListParams } from "@/shared/hooks/useListParams";
import { useModal } from "@/shared/hooks/useModal";
import { InventoryMovesTable } from "../components/InventoryTables";
import { StockMovementModal } from "../components/StockMovementModal";
import { useMaterials, useStockMoves } from "../hooks/useInventory";
import type { StockMoveType } from "../types/inventory";

const moveTypes: Array<{ value: StockMoveType; label: string }> = [
  { value: "ENTRADA", label: "Entradas" },
  { value: "SALIDA", label: "Salidas" },
  { value: "AJUSTE", label: "Ajustes" },
];

export default function InventoryMovementsPage() {
  const movementModal = useModal();
  const canRegisterMove = useCanAccess(PermissionLevel.ADVANCED_OPERATIONS);
  const { filters, queryParams, setFilter, setPage, setLimit, clearAll, hasActiveFilters } = useListParams({
    initialFilters: {
      search: "",
      materialId: undefined as number | undefined,
      type: undefined as StockMoveType | undefined,
    },
    defaultLimit: 15,
  });
  const moves = useStockMoves(queryParams);
  const materials = useMaterials({ page: 1, limit: 100 });

  useHeaderConfig({
    title: "Movimientos de inventario",
    description: "Consulta la trazabilidad de entradas, salidas y ajustes",
  });

  const pagination = moves.data?.meta.pagination;
  const materialOptions = (materials.data?.data ?? []).map((material) => ({
    value: String(material.id),
    label: material.name,
  }));

  return <>
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-gray-50/50">
      <div className="shrink-0 border-b border-gray-200 bg-white px-6 py-3">
        <div className="grid items-center gap-3 xl:grid-cols-[minmax(16rem,1.4fr)_minmax(13rem,1fr)_minmax(11rem,0.8fr)_auto_auto]">
          <Input aria-label="Buscar movimientos" value={filters.search} onChange={(event) => setFilter("search", event.target.value)} placeholder="Buscar por material o referencia" inputSize="sm" startIcon={<Search className="h-4 w-4" />} />
          <SearchSelect size="sm" options={materialOptions} value={filters.materialId ? String(filters.materialId) : ""} onValueChange={(value) => setFilter("materialId", value ? Number(value) : undefined)} allowClear clearLabel="Todos los materiales" placeholder="Todos los materiales" />
          <SearchSelect size="sm" options={moveTypes} value={filters.type ?? ""} onValueChange={(value) => setFilter("type", value ? value as StockMoveType : undefined)} allowClear clearLabel="Todos los tipos" placeholder="Todos los tipos" />
          <Button variant="outline" size="sm" onClick={clearAll} disabled={!hasActiveFilters}>Limpiar</Button>
          <PermissionGate minimumLevel={PermissionLevel.ADVANCED_OPERATIONS}>
            <Button size="sm" icon={ArrowLeftRight} onClick={movementModal.open}>Registrar movimiento</Button>
          </PermissionGate>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        {moves.isLoading ? <SectionLoader placeholder="Cargando movimientos" /> : moves.isError ? <ErrorState title="No se pudo cargar el historial de inventario" error={moves.error} onRetry={moves.refetch} /> : <InventoryMovesTable moves={moves.data?.data ?? []} />}
      </div>

      {pagination && pagination.total > 0 ? <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-2"><Pagination currentPage={pagination.page} totalPages={pagination.totalPages} limit={pagination.limit} totalItems={pagination.total} onPageChange={setPage} onLimitChange={setLimit} /></div> : null}
    </div>
    {canRegisterMove ? <StockMovementModal isOpen={movementModal.isOpen} onClose={movementModal.close} materials={materials.data?.data ?? []} /> : null}
  </>;
}
