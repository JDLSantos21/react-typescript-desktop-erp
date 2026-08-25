import { useState } from "react";
import { Trash2 } from "lucide-react";
import ConfirmDialog from "@/shared/components/core/ConfirmDialog";
import { Button } from "@/shared/components/core/Button";
import { Input } from "@/shared/components/core/Input";
import { PermissionLevel } from "@/shared/authorization/permissions";
import { useCanAccess } from "@/shared/authorization/usePermission";
import { useCreateCategory, useCreateUnit, useDeleteCategory, useDeleteUnit, useInventoryCategories, useInventoryUnits } from "../hooks/useInventory";

export function InventoryCatalogManager() {
  const [categoryName, setCategoryName] = useState("");
  const [unitName, setUnitName] = useState("");
  const [pendingDelete, setPendingDelete] = useState<{ kind: "category" | "unit"; id: number; name: string } | null>(null);
  const { data: categories } = useInventoryCategories();
  const { data: units } = useInventoryUnits();
  const createCategory = useCreateCategory();
  const createUnit = useCreateUnit();
  const deleteCategory = useDeleteCategory();
  const deleteUnit = useDeleteUnit();
  const canDeleteCatalogs = useCanAccess(PermissionLevel.ADMINISTRATION);

  const addCategory = async () => { if (!categoryName.trim()) return; await createCategory.mutateAsync(categoryName.trim()); setCategoryName(""); };
  const addUnit = async () => { if (!unitName.trim()) return; await createUnit.mutateAsync(unitName.trim()); setUnitName(""); };
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    if (pendingDelete.kind === "category") await deleteCategory.mutateAsync(pendingDelete.id);
    else await deleteUnit.mutateAsync(pendingDelete.id);
    setPendingDelete(null);
  };

  return <>
    <div className="grid gap-10 xl:grid-cols-2">
      <CatalogSection title="Categorías de material" description="Agrupan el catálogo y facilitan la consulta operativa." value={categoryName} onChange={setCategoryName} onAdd={addCategory} isAdding={createCategory.isPending} items={categories?.data ?? []} canDelete={canDeleteCatalogs} onDelete={(item) => setPendingDelete({ kind: "category", id: item.id, name: item.name })} />
      <CatalogSection title="Unidades de medida" description="Definen cómo se registra y muestra cada existencia." value={unitName} onChange={setUnitName} onAdd={addUnit} isAdding={createUnit.isPending} items={units?.data ?? []} canDelete={canDeleteCatalogs} onDelete={(item) => setPendingDelete({ kind: "unit", id: item.id, name: item.name })} />
    </div>
    <ConfirmDialog isOpen={Boolean(pendingDelete)} onCancel={() => setPendingDelete(null)} onConfirm={confirmDelete} isLoading={deleteCategory.isPending || deleteUnit.isPending} variant="danger" title={`Eliminar ${pendingDelete?.kind === "category" ? "categoría" : "unidad"}`} description={`Eliminarás “${pendingDelete?.name ?? ""}”. Solo es posible si no tiene materiales asociados.`} confirmText="Eliminar" />
  </>;
}

function CatalogSection({ title, description, value, onChange, onAdd, isAdding, items, canDelete, onDelete }: { title: string; description: string; value: string; onChange: (value: string) => void; onAdd: () => void; isAdding: boolean; items: Array<{ id: number; name: string }>; canDelete: boolean; onDelete: (item: { id: number; name: string }) => void; }) {
  return <section className="border-t border-gray-100 pt-5"><h2 className="text-base font-semibold text-text-primary">{title}</h2><p className="mt-1 text-sm text-text-secondary">{description}</p><div className="mt-5 flex gap-2"><Input aria-label={`Nueva ${title}`} value={value} onChange={(event) => onChange(event.target.value)} placeholder="Nuevo registro" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void onAdd(); } }} /><Button type="button" variant="outline" onClick={() => void onAdd()} isLoading={isAdding}>Añadir</Button></div><div className="mt-5 divide-y divide-gray-100 border-y border-gray-100">{items.map((item) => <div key={item.id} className="flex items-center justify-between py-3 text-sm"><span className="text-text-primary">{item.name}</span>{canDelete ? <button type="button" aria-label={`Eliminar ${item.name}`} className="rounded p-1.5 text-text-muted hover:bg-red-50 hover:text-danger" onClick={() => onDelete(item)}><Trash2 className="h-4 w-4" /></button> : null}</div>)}{items.length === 0 && <p className="py-5 text-sm text-text-muted">Aún no hay registros.</p>}</div></section>;
}
