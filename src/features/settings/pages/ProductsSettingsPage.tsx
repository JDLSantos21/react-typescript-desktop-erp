import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Edit3, Plus, Power, Trash2 } from "lucide-react";
import { sileo } from "sileo";
import {
  useCreateProduct,
  useDeleteProduct,
  useProductsForManagement,
  useUpdateProduct,
} from "@/features/orders/hooks/useProduct";
import { ErrorState } from "@/shared/components/ErrorState";
import SectionLoader from "@/shared/components/SectionLoader";
import { Button } from "@/shared/components/core/Button";
import ConfirmDialog from "@/shared/components/core/ConfirmDialog";
import { Input } from "@/shared/components/core/Input";
import { Modal } from "@/shared/components/core/Modal";
import { Pagination } from "@/shared/components/core/Pagination";
import { Select } from "@/shared/components/core/Select";
import { usePagination } from "@/shared/hooks/usePagination";
import type { Product, ProductInput } from "@/shared/types/entities/order.types";
import { extractApiError } from "@/shared/utils/error-handler";
import { SettingsPageHeader } from "../components/SettingsPageHeader";

const ALL_FILTER = "__all__";

export default function ProductsSettingsPage() {
  const { page, limit, setPage, setLimit } = usePagination({ defaultLimit: 10 });
  const products = useProductsForManagement();
  const update = useUpdateProduct();
  const remove = useDeleteProduct();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<typeof ALL_FILTER | "active" | "inactive">(
    ALL_FILTER,
  );
  const [editing, setEditing] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return (products.data?.data ?? []).filter((product) => {
      const matchesStatus =
        status === ALL_FILTER ||
        (status === "active" ? product.isActive : !product.isActive);
      const matchesSearch =
        !query ||
        [product.name, product.sku, product.unit, product.size]
          .filter(Boolean)
          .some((value) => value!.toLocaleLowerCase().includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [products.data?.data, search, status]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / limit));
  const visibleProducts = filteredProducts.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, setPage, totalPages]);

  const openCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus(ALL_FILTER);
    setPage(1);
  };

  const changeAvailability = async (product: Product) => {
    try {
      await update.mutateAsync({ id: product.id, data: { isActive: !product.isActive } });
      sileo.success({
        title: product.isActive ? "Producto desactivado" : "Producto activado",
      });
    } catch (error) {
      sileo.error({
        title: "No se pudo actualizar el producto",
        description: extractApiError(error).message,
      });
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await remove.mutateAsync(productToDelete.id);
      sileo.success({ title: "Producto eliminado" });
      setProductToDelete(null);
    } catch (error) {
      sileo.error({
        title: "No se pudo eliminar el producto",
        description: extractApiError(error).message,
      });
    }
  };

  return (
    <>
      <SettingsPageHeader
        title="Productos"
        description="Catálogo disponible para crear y gestionar pedidos"
        actions={
          <Button variant="outline" size="sm" icon={Plus} onClick={openCreate}>
            Nuevo producto
          </Button>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col p-8">
        <div className="flex min-h-0 max-w-6xl flex-1 flex-col">
          <div className="grid shrink-0 gap-3 border-b border-slate-200 pb-5 sm:grid-cols-2 lg:grid-cols-[minmax(16rem,1fr)_10rem_auto]">
            <Input
              label="Buscar"
              value={search}
              placeholder="Nombre, SKU, presentación o unidad"
              inputSize="sm"
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
            <Select
              label="Estado"
              size="sm"
              value={status}
              onValueChange={(value) => {
                setStatus(value as typeof status);
                setPage(1);
              }}
              options={[
                { value: ALL_FILTER, label: "Todos" },
                { value: "active", label: "Activos" },
                { value: "inactive", label: "Inactivos" },
              ]}
            />
            <Button variant="outline" className="self-end" onClick={clearFilters}>
              Limpiar
            </Button>
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            {products.isLoading ? (
              <SectionLoader placeholder="Cargando productos" />
            ) : products.isError ? (
              <ErrorState
                title="No se pudieron cargar los productos"
                error={products.error}
                onRetry={products.refetch}
              />
            ) : (
              <div className="min-w-0 overflow-x-auto">
                <table className="w-full min-w-220 text-left text-sm">
                  <thead className="border-b border-slate-200 text-xs text-slate-500">
                    <tr>
                      <th className="py-3 pr-4 font-medium">Producto</th>
                      <th className="py-3 pr-4 font-medium">SKU</th>
                      <th className="py-3 pr-4 font-medium">Presentación</th>
                      <th className="py-3 pr-4 font-medium">Estado</th>
                      <th className="py-3 text-right font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {visibleProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="py-4 pr-4">
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="mt-0.5 max-w-sm truncate text-xs text-slate-500">
                            {product.description || "Sin descripción"}
                          </p>
                        </td>
                        <td className="py-4 pr-4 text-slate-600">{product.sku || "—"}</td>
                        <td className="py-4 pr-4 text-slate-700">
                          {[product.size, product.unit].filter(Boolean).join(" ") || "—"}
                        </td>
                        <td className="py-4 pr-4">
                          <span className={product.isActive ? "text-emerald-700" : "text-slate-500"}>
                            {product.isActive ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              icon={Edit3}
                              onClick={() => {
                                setEditing(product);
                                setIsFormOpen(true);
                              }}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              icon={Power}
                              isLoading={update.isPending}
                              onClick={() => void changeAvailability(product)}
                            >
                              {product.isActive ? "Desactivar" : "Activar"}
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              icon={Trash2}
                              title="Eliminar producto"
                              aria-label={`Eliminar ${product.name}`}
                              onClick={() => setProductToDelete(product)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {visibleProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-500">
                          No hay productos que coincidan con los filtros.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="shrink-0 border-t border-slate-200 pt-3">
            <Pagination
              currentPage={Math.min(page, totalPages)}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </div>
        </div>
      </div>
      <ProductFormModal
        product={editing}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
      <ConfirmDialog
        isOpen={Boolean(productToDelete)}
        onCancel={() => setProductToDelete(null)}
        onConfirm={() => void confirmDelete()}
        isLoading={remove.isPending}
        title="Eliminar producto"
        description={`Eliminarás ${productToDelete?.name ?? "este producto"}. Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />
    </>
  );
}

function ProductFormModal({
  product,
  isOpen,
  onClose,
}: {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const [draft, setDraft] = useState<ProductInput>({
    name: "",
    unit: "",
    size: "",
    sku: "",
    description: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    setDraft({
      name: product?.name ?? "",
      unit: product?.unit ?? "",
      size: product?.size ?? "",
      sku: product?.sku ?? "",
      description: product?.description ?? "",
    });
  }, [isOpen, product]);

  const pending = create.isPending || update.isPending;
  const updateField = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.unit.trim()) return;
    const data: ProductInput = {
      name: draft.name.trim(),
      unit: draft.unit.trim(),
      size: draft.size?.trim() || undefined,
      sku: draft.sku?.trim() || undefined,
      description: draft.description?.trim() || undefined,
    };
    try {
      if (product) await update.mutateAsync({ id: product.id, data });
      else await create.mutateAsync(data);
      sileo.success({ title: product ? "Producto actualizado" : "Producto creado" });
      onClose();
    } catch (error) {
      sileo.error({
        title: "No se pudo guardar el producto",
        description: extractApiError(error).message,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? "Editar producto" : "Nuevo producto"}
      size="lg"
      closeOnOverlayClick={!pending}
    >
      <Modal.Body>
        <form id="product-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Nombre"
            value={draft.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Ej. Botellón de agua"
            required
            autoFocus
          />
          <Input
            label="SKU"
            value={draft.sku}
            onChange={(event) => updateField("sku", event.target.value)}
            placeholder="Ej. AGU-005"
          />
          <Input
            label="Presentación"
            value={draft.size}
            onChange={(event) => updateField("size", event.target.value)}
            placeholder="Ej. 5 galones"
          />
          <Input
            label="Unidad"
            value={draft.unit}
            onChange={(event) => updateField("unit", event.target.value)}
            placeholder="Ej. unidad"
            required
          />
          <div className="sm:col-span-2">
            <Input
              label="Descripción"
              value={draft.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="Información adicional para el personal que registra pedidos"
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose} disabled={pending}>
          Cancelar
        </Button>
        <Button type="submit" form="product-form" isLoading={pending}>
          {product ? "Guardar cambios" : "Crear producto"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
