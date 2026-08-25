import { useEffect, useState, type FormEvent } from "react";
import { Edit3, Plus, Power } from "lucide-react";
import { sileo } from "sileo";
import { Button } from "@/shared/components/core/Button";
import { Input } from "@/shared/components/core/Input";
import { Modal } from "@/shared/components/core/Modal";
import { Select } from "@/shared/components/core/Select";
import { ErrorState } from "@/shared/components/ErrorState";
import SectionLoader from "@/shared/components/SectionLoader";
import { extractApiError } from "@/shared/utils/error-handler";
import {
  useCreateMaintenanceProcedure,
  useDeactivateMaintenanceProcedure,
  useMaintenanceProcedures,
  useUpdateMaintenanceProcedure,
} from "@/features/maintenance/hooks/useMaintenance";
import type {
  MaintenanceProcedure,
  MaintenanceProcedureCategory,
} from "@/features/maintenance/types/maintenance";
import { SettingsPageHeader } from "../components/SettingsPageHeader";

const categoryOptions: Array<{
  value: MaintenanceProcedureCategory;
  label: string;
}> = [
  { value: "MOTOR", label: "Motor" },
  { value: "DIFERENCIAL", label: "Diferencial" },
  { value: "FRENOS", label: "Frenos" },
  { value: "FILTROS", label: "Filtros" },
  { value: "ACEITE", label: "Aceite" },
  { value: "LLANTAS", label: "Llantas y neumáticos" },
  { value: "ELECTRICO", label: "Eléctrico" },
  { value: "CARROCERIA", label: "Carrocería" },
  { value: "PREVENTIVO", label: "Preventivo" },
];

const categoryLabel = (category: string) =>
  categoryOptions.find((option) => option.value === category)?.label ?? category;

export default function MaintenanceProceduresSettingsPage() {
  const procedures = useMaintenanceProcedures(true);
  const deactivate = useDeactivateMaintenanceProcedure();
  const [editing, setEditing] = useState<MaintenanceProcedure | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const openEdit = (procedure: MaintenanceProcedure) => {
    setEditing(procedure);
    setIsFormOpen(true);
  };

  const changeAvailability = async (procedure: MaintenanceProcedure) => {
    try {
      if (procedure.isActive) await deactivate.mutateAsync(procedure.id);
      else {
        await updateProcedure.mutateAsync({
          id: procedure.id,
          data: { isActive: true },
        });
      }
      sileo.success({
        title: procedure.isActive
          ? "Procedimiento desactivado"
          : "Procedimiento activado",
      });
    } catch (error) {
      sileo.error({
        title: "No se pudo actualizar el procedimiento",
        description: extractApiError(error).message,
      });
    }
  };

  const updateProcedure = useUpdateMaintenanceProcedure();

  return (
    <>
      <SettingsPageHeader
        title="Procedimientos de mantenimiento"
        description="Catálogo de trabajos que se asigna a cada mantenimiento nuevo"
        actions={
          <Button variant="outline" size="sm" icon={Plus} onClick={openCreate}>
            Nuevo procedimiento
          </Button>
        }
      />
      <div className="p-8">
        <div className="max-w-5xl">
          {procedures.isLoading ? (
            <SectionLoader placeholder="Cargando procedimientos" />
          ) : procedures.isError ? (
            <ErrorState
              title="No se pudieron cargar los procedimientos"
              error={procedures.error}
              onRetry={procedures.refetch}
            />
          ) : (
            <div className="overflow-x-auto border-y border-slate-200">
              <table className="w-full min-w-180 text-left text-sm">
                <thead className="text-xs text-slate-500">
                  <tr>
                    <th className="py-3 font-medium">Procedimiento</th>
                    <th className="py-3 font-medium">Categoría</th>
                    <th className="py-3 font-medium">Descripción</th>
                    <th className="py-3 font-medium">Estado</th>
                    <th className="py-3 text-right font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(procedures.data?.data ?? []).map((procedure) => (
                    <tr key={procedure.id}>
                      <td className="py-4 font-medium text-slate-900">
                        {procedure.name}
                      </td>
                      <td className="py-4 text-slate-600">
                        {categoryLabel(procedure.category)}
                      </td>
                      <td className="max-w-sm py-4 text-slate-600">
                        <span className="line-clamp-2">
                          {procedure.description || "—"}
                        </span>
                      </td>
                      <td className="py-4">
                        <span
                          className={
                            procedure.isActive
                              ? "text-emerald-700"
                              : "text-slate-500"
                          }
                        >
                          {procedure.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Edit3}
                            onClick={() => openEdit(procedure)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Power}
                            isLoading={deactivate.isPending || updateProcedure.isPending}
                            onClick={() => void changeAvailability(procedure)}
                          >
                            {procedure.isActive ? "Desactivar" : "Activar"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(procedures.data?.data ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-500">
                        Crea el primer procedimiento para que se incluya en los
                        mantenimientos nuevos.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <MaintenanceProcedureFormModal
        procedure={editing}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </>
  );
}

function MaintenanceProcedureFormModal({
  procedure,
  isOpen,
  onClose,
}: {
  procedure: MaintenanceProcedure | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const create = useCreateMaintenanceProcedure();
  const update = useUpdateMaintenanceProcedure();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<MaintenanceProcedureCategory>("PREVENTIVO");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setName(procedure?.name ?? "");
    setCategory(procedure?.category ?? "PREVENTIVO");
    setDescription(procedure?.description ?? "");
  }, [isOpen, procedure]);

  const pending = create.isPending || update.isPending;
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    const data = {
      name: name.trim(),
      category,
      description: description.trim() || undefined,
    };
    try {
      if (procedure) await update.mutateAsync({ id: procedure.id, data });
      else await create.mutateAsync(data);
      sileo.success({ title: procedure ? "Procedimiento actualizado" : "Procedimiento creado" });
      onClose();
    } catch (error) {
      sileo.error({
        title: "No se pudo guardar el procedimiento",
        description: extractApiError(error).message,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={procedure ? "Editar procedimiento" : "Nuevo procedimiento"}
      size="md"
      closeOnOverlayClick={!pending}
    >
      <Modal.Body>
        <form id="maintenance-procedure-form" onSubmit={submit} className="grid gap-4">
          <Input
            label="Nombre"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej. Cambio de aceite"
            autoFocus
          />
          <Select
            label="Categoría"
            value={category}
            onValueChange={(value) => setCategory(value as MaintenanceProcedureCategory)}
            options={categoryOptions}
          />
          <Input
            label="Descripción (opcional)"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Indica cuándo aplica este procedimiento"
          />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose} disabled={pending}>
          Cancelar
        </Button>
        <Button type="submit" form="maintenance-procedure-form" isLoading={pending}>
          {procedure ? "Guardar cambios" : "Crear procedimiento"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
