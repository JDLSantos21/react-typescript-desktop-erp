import { useEffect, useMemo, useState } from "react";
import { Boxes, Check, Clock3, PackageSearch, Settings2 } from "lucide-react";
import { sileo } from "sileo";
import { Button } from "@/shared/components/core/Button";
import { Input } from "@/shared/components/core/Input";
import { Modal } from "@/shared/components/core/Modal";
import { ErrorState } from "@/shared/components/ErrorState";
import SectionLoader from "@/shared/components/SectionLoader";
import { PermissionLevel } from "@/shared/authorization/permissions";
import { useCanAccess } from "@/shared/authorization/usePermission";
import { useGetAllProducts } from "@/features/orders/hooks/useOrder";
import {
  useEquipmentMonitoringSettings,
  useGetModels,
  useModelMonitoringProducts,
  useUpdateEquipmentMonitoringSettings,
  useUpdateModelMonitoringProducts,
} from "@/features/equipments/hooks/useEquipments";
import type { EquipmentModel } from "@/shared/types/entities/equipment.types";
import { extractApiError } from "@/shared/utils/error-handler";
import { SettingsPageHeader } from "../components/SettingsPageHeader";

export default function EquipmentMonitoringSettingsPage() {
  const settings = useEquipmentMonitoringSettings();
  const models = useGetModels();
  const updateSettings = useUpdateEquipmentMonitoringSettings();
  const canAdminister = useCanAccess(PermissionLevel.ADMINISTRATION);
  const [days, setDays] = useState(30);
  const [selectedModel, setSelectedModel] = useState<EquipmentModel | null>(null);

  useEffect(() => {
    if (settings.data?.data.defaultOrderInactivityDays) setDays(settings.data.data.defaultOrderInactivityDays);
  }, [settings.data]);

  const saveDefault = async () => {
    if (!Number.isInteger(days) || days < 1 || days > 365) {
      sileo.error({ title: "Introduce un plazo entre 1 y 365 días" });
      return;
    }
    try {
      await updateSettings.mutateAsync(days);
      sileo.success({ title: "Plazo general actualizado" });
    } catch (error) {
      sileo.error({ title: "No se pudo guardar la configuración", description: extractApiError(error).message });
    }
  };

  return (
    <>
      <SettingsPageHeader
        title="Seguimiento de consumo"
        description="Define cuándo avisar si un cliente con equipos deja de pedir los productos relacionados"
      />
      <div className="w-full space-y-8 p-8 pb-12">
        {settings.isError || models.isError ? (
          <ErrorState title="No se pudo cargar la configuración" error={settings.error ?? models.error} onRetry={() => { settings.refetch(); models.refetch(); }} />
        ) : settings.isLoading || models.isLoading ? (
          <SectionLoader placeholder="Cargando seguimiento" />
        ) : (
          <>
            <section className="max-w-3xl rounded-2xl bg-white p-6 shadow-sm shadow-slate-200/50">
              <div className="flex items-start gap-4">
                <span className="rounded-xl bg-blue-50 p-2.5 text-blue-700"><Clock3 className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-slate-950">Plazo general sin pedidos</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">Se usa como respaldo cuando una asignación no tiene un plazo personalizado. El conteo inicia al entregar el equipo o desde el último pedido válido.</p>
                  <div className="mt-5 flex max-w-md items-end gap-3">
                    <Input label="Cantidad de días" type="number" min={1} max={365} value={days} onChange={(event) => setDays(Number(event.target.value))} disabled={!canAdminister} />
                    {canAdminister ? <Button onClick={saveDefault} isLoading={updateSettings.isPending}>Guardar</Button> : null}
                  </div>
                  {!canAdminister ? <p className="mt-3 text-xs text-slate-500">Solo un usuario administrativo puede cambiar el plazo general.</p> : null}
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-slate-950">Productos por modelo</h2>
                  <p className="mt-1 text-sm text-slate-500">Cualquier pedido que contenga al menos uno de estos productos reinicia el plazo.</p>
                </div>
                <span className="text-sm text-slate-500">{models.data?.data.length ?? 0} modelos</span>
              </div>
              <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                {(models.data?.data ?? []).map((model) => (
                  <ModelMonitoringCard key={model.id} model={model} onConfigure={() => setSelectedModel(model)} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
      <ProductsModal model={selectedModel} onClose={() => setSelectedModel(null)} />
    </>
  );
}

function ModelMonitoringCard({ model, onConfigure }: { model: EquipmentModel; onConfigure: () => void }) {
  const products = useModelMonitoringProducts(model.id);
  const items = products.data?.data ?? [];
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm shadow-slate-200/50">
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-xl bg-slate-100 p-2.5 text-slate-600"><Boxes className="h-5 w-5" /></span>
        <Button variant="ghost" size="sm" icon={Settings2} onClick={onConfigure}>Configurar</Button>
      </div>
      <p className="mt-5 font-semibold text-slate-950">{model.name}</p>
      <p className="mt-0.5 text-xs text-slate-500">{model.type === "NEVERA" ? "Nevera" : model.type === "ANAQUEL" ? "Anaquel" : "Otro equipo"}</p>
      <div className="mt-4 flex min-h-11 flex-wrap content-start gap-2">
        {products.isLoading ? <span className="text-sm text-slate-400">Cargando productos…</span> : items.length ? items.map((product) => <span key={product.id} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">{product.name}</span>) : <span className="text-sm text-amber-700">Sin productos: no genera alertas</span>}
      </div>
    </article>
  );
}

function ProductsModal({ model, onClose }: { model: EquipmentModel | null; onClose: () => void }) {
  const products = useGetAllProducts();
  const selectedProducts = useModelMonitoringProducts(model?.id);
  const update = useUpdateModelMonitoringProducts();
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    if (model && selectedProducts.data) setSelected(selectedProducts.data.data.map((product) => product.id));
  }, [model, selectedProducts.data]);

  const catalog = useMemo(() => products.data?.data ?? [], [products.data]);
  const toggle = (productId: number) => setSelected((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
  const save = async () => {
    if (!model) return;
    try {
      await update.mutateAsync({ modelId: model.id, productIds: selected });
      sileo.success({ title: "Productos de seguimiento actualizados" });
      onClose();
    } catch (error) {
      sileo.error({ title: "No se pudieron guardar los productos", description: extractApiError(error).message });
    }
  };

  return (
    <Modal isOpen={Boolean(model)} onClose={onClose} title={`Productos de ${model?.name ?? "equipo"}`} size="lg" closeOnOverlayClick={!update.isPending}>
      <Modal.Body>
        <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">Selecciona uno o varios productos. Un pedido con cualquiera de ellos cuenta como actividad válida del cliente.</div>
        {products.isLoading || selectedProducts.isLoading ? <SectionLoader placeholder="Cargando productos" /> : (
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {catalog.map((product) => {
              const checked = selected.includes(product.id);
              return <button key={product.id} type="button" onClick={() => toggle(product.id)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${checked ? "bg-blue-50 text-blue-900" : "bg-slate-50 text-slate-700 hover:bg-slate-100"}`}>
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${checked ? "bg-blue-600 text-white" : "bg-white text-transparent"}`}><Check className="h-3.5 w-3.5" /></span>
                <PackageSearch className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="min-w-0"><span className="block truncate text-sm font-medium">{product.name}</span><span className="block text-xs opacity-70">{[product.size, product.unit].filter(Boolean).join(" · ")}</span></span>
              </button>;
            })}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose} disabled={update.isPending}>Cancelar</Button>
        <Button onClick={save} isLoading={update.isPending}>Guardar selección</Button>
      </Modal.Footer>
    </Modal>
  );
}
