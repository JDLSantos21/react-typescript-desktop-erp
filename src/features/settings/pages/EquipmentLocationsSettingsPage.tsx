import { useEffect, useState } from "react";
import { MapPin, Pencil, Plus } from "lucide-react";
import { sileo } from "sileo";
import { Button } from "@/shared/components/core/Button";
import { Input } from "@/shared/components/core/Input";
import { Modal } from "@/shared/components/core/Modal";
import { Select } from "@/shared/components/core/Select";
import { Checkbox } from "@/shared/components/core/Checkbox";
import { ErrorState } from "@/shared/components/ErrorState";
import SectionLoader from "@/shared/components/SectionLoader";
import { useCreateEquipmentSite, useEquipmentSites, useUpdateEquipmentSite } from "@/features/equipments/hooks/useEquipments";
import { EquipmentSite, EquipmentSiteType } from "@/shared/types/entities/equipment.types";
import { SettingsPageHeader } from "../components/SettingsPageHeader";

const emptyForm = { name: "", type: "ALMACEN" as EquipmentSiteType, address: "", latitude: "", longitude: "", isActive: true };

export default function EquipmentLocationsSettingsPage() {
  const sites = useEquipmentSites(true);
  const create = useCreateEquipmentSite();
  const update = useUpdateEquipmentSite();
  const [selected, setSelected] = useState<EquipmentSite | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!isOpen) return;
    setForm(selected ? {
      name: selected.name,
      type: selected.type,
      address: selected.address ?? "",
      latitude: selected.latitude?.toString() ?? "",
      longitude: selected.longitude?.toString() ?? "",
      isActive: selected.isActive,
    } : emptyForm);
  }, [isOpen, selected]);

  const openCreate = () => { setSelected(null); setIsOpen(true); };
  const openEdit = (site: EquipmentSite) => { setSelected(site); setIsOpen(true); };
  const save = async () => {
    const data = {
      name: form.name.trim(),
      type: form.type,
      address: form.address.trim() || null,
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
      isActive: form.isActive,
    };
    if (!data.name) return;
    try {
      if (selected) await update.mutateAsync({ id: selected.id, data });
      else await create.mutateAsync(data);
      sileo.success({ title: selected ? "Ubicación actualizada" : "Ubicación creada" });
      setIsOpen(false);
    } catch {
      sileo.error({ title: "No se pudo guardar la ubicación" });
    }
  };
  const pending = create.isPending || update.isPending;

  return <>
    <SettingsPageHeader title="Ubicaciones de equipos" description="Plantas, almacenes y lugares internos donde se custodian equipos" actions={<Button variant="outline" size="sm" icon={Plus} onClick={openCreate}>Nueva ubicación</Button>} />
    <div className="p-8"><div className="max-w-5xl">
      {sites.isLoading ? <SectionLoader placeholder="Cargando ubicaciones" /> : sites.isError ? <ErrorState title="No se pudieron cargar las ubicaciones" error={sites.error} onRetry={sites.refetch} /> : (
        <div className="space-y-2">{(sites.data?.data ?? []).map((site) => <button key={site.id} type="button" onClick={() => openEdit(site)} className="group flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 text-left transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><MapPin className="h-4 w-4" /></span>
          <span className="min-w-0 flex-1"><span className="flex items-center gap-2"><span className="font-semibold text-slate-900">{site.name}</span><span className="text-xs text-slate-500">{site.type}</span></span><span className="mt-1 block truncate text-sm text-slate-500">{site.address || "Sin dirección registrada"}</span></span>
          <span className={`text-xs font-medium ${site.isActive ? "text-emerald-700" : "text-slate-400"}`}>{site.isActive ? "Activa" : "Inactiva"}</span><Pencil className="h-4 w-4 text-slate-400" />
        </button>)}</div>
      )}
    </div></div>
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={selected ? "Editar ubicación" : "Nueva ubicación"} size="md">
      <Modal.Body><div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nombre" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <Select label="Tipo" value={form.type} onValueChange={(value) => setForm({ ...form, type: value as EquipmentSiteType })} options={[{ value: "PLANTA", label: "Planta" }, { value: "ALMACEN", label: "Almacén" }, { value: "OTRO", label: "Otro" }]} />
        <Input className="sm:col-span-2" label="Dirección" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
        <Input label="Latitud" type="number" step="any" value={form.latitude} onChange={(event) => setForm({ ...form, latitude: event.target.value })} />
        <Input label="Longitud" type="number" step="any" value={form.longitude} onChange={(event) => setForm({ ...form, longitude: event.target.value })} />
        <Checkbox label="Ubicación activa" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />
      </div></Modal.Body>
      <Modal.Footer><Button variant="outline" onClick={() => setIsOpen(false)} disabled={pending}>Cancelar</Button><Button onClick={save} isLoading={pending}>Guardar</Button></Modal.Footer>
    </Modal>
  </>;
}
