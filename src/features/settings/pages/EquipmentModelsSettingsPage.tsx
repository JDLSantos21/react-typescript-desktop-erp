import { useEffect, useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { sileo } from "sileo";
import { Button } from "@/shared/components/core/Button";
import ConfirmDialog from "@/shared/components/core/ConfirmDialog";
import { Input } from "@/shared/components/core/Input";
import { Modal } from "@/shared/components/core/Modal";
import { Select } from "@/shared/components/core/Select";
import { ErrorState } from "@/shared/components/ErrorState";
import SectionLoader from "@/shared/components/SectionLoader";
import {
  useCreateModel,
  useDeleteModel,
  useGetModels,
  useUpdateModel,
} from "@/features/equipments/hooks/useEquipments";
import {
  modelSchema,
  type ModelFormData,
  type ModelFormInput,
} from "@/features/equipments/schemas/equipments.schema";
import { useModal } from "@/shared/hooks/useModal";
import type { EquipmentModel } from "@/shared/types/entities/equipment.types";
import { extractApiError } from "@/shared/utils/error-handler";
import { SettingsPageHeader } from "../components/SettingsPageHeader";

export default function EquipmentModelsSettingsPage() {
  const formModal = useModal();
  const deleteModal = useModal();
  const [selected, setSelected] = useState<EquipmentModel | null>(null);
  const models = useGetModels();
  const remove = useDeleteModel();

  const openCreate = () => {
    setSelected(null);
    formModal.open();
  };

  const openEdit = (model: EquipmentModel) => {
    setSelected(model);
    formModal.open();
  };

  const openDelete = (model: EquipmentModel) => {
    setSelected(model);
    deleteModal.open();
  };

  const confirmDelete = async () => {
    if (!selected) return;

    try {
      await remove.mutateAsync(selected.id);
      sileo.success({ title: "Modelo eliminado" });
      deleteModal.close();
    } catch (error) {
      sileo.error({
        title: "No se pudo eliminar el modelo",
        description: extractApiError(error).message,
      });
    }
  };

  return (
    <>
      <SettingsPageHeader
        title="Modelos de equipo"
        description="Datos maestros reutilizables para generar unidades de equipo"
        actions={
          <Button variant="outline" size="sm" icon={Plus} onClick={openCreate}>
            Nuevo modelo
          </Button>
        }
      />

      <div className="p-8">
        <div className="max-w-5xl">
          {models.isLoading ? (
            <SectionLoader placeholder="Cargando modelos" />
          ) : models.isError ? (
            <ErrorState
              title="No se pudieron cargar los modelos"
              error={models.error}
              onRetry={models.refetch}
            />
          ) : (
            <div className="overflow-x-auto border-y border-slate-200">
              <table className="w-full min-w-170 text-left text-sm">
                <thead className="text-xs text-slate-500">
                  <tr>
                    <th className="py-3 font-medium">Modelo</th>
                    <th className="py-3 font-medium">Tipo</th>
                    <th className="py-3 font-medium">Marca</th>
                    <th className="py-3 font-medium">Capacidad</th>
                    <th className="py-3 text-right font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(models.data?.data ?? []).map((model) => (
                    <tr key={model.id}>
                      <td className="py-4 font-medium text-slate-900">
                        {model.name}
                      </td>
                      <td className="py-4 text-slate-600">{model.type}</td>
                      <td className="py-4 text-slate-600">
                        {model.brand ?? "—"}
                      </td>
                      <td className="py-4 text-slate-600">
                        {model.capacity ?? "—"}
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end gap-1">
                          <IconButton
                            label="Editar modelo"
                            onClick={() => openEdit(model)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </IconButton>
                          <IconButton
                            label="Eliminar modelo"
                            danger
                            onClick={() => openDelete(model)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <EquipmentModelFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        model={selected}
      />
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onCancel={deleteModal.close}
        onConfirm={confirmDelete}
        isLoading={remove.isPending}
        title="Eliminar modelo"
        description={`Eliminarás “${selected?.name ?? ""}”. Solo será posible si no tiene equipos asociados.`}
        variant="danger"
        confirmText="Eliminar modelo"
      />
    </>
  );
}

function EquipmentModelFormModal({
  isOpen,
  onClose,
  model,
}: {
  isOpen: boolean;
  onClose: () => void;
  model: EquipmentModel | null;
}) {
  const create = useCreateModel();
  const update = useUpdateModel();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ModelFormInput, unknown, ModelFormData>({
    resolver: zodResolver(modelSchema),
    defaultValues: { name: "", type: "ANAQUEL", brand: "", capacity: 1 },
  });

  useEffect(() => {
    if (!isOpen) return;

    reset(
      model
        ? {
            name: model.name,
            type: model.type as ModelFormInput["type"],
            brand: model.brand ?? "",
            capacity: model.capacity ?? 1,
          }
        : { name: "", type: "ANAQUEL", brand: "", capacity: 1 },
    );
  }, [isOpen, model, reset]);

  const pending = create.isPending || update.isPending;

  const submit = async (data: ModelFormData) => {
    try {
      if (model) await update.mutateAsync({ id: model.id, model: data });
      else await create.mutateAsync(data);

      sileo.success({ title: model ? "Modelo actualizado" : "Modelo creado" });
      onClose();
    } catch (error) {
      sileo.error({
        title: "No se pudo guardar el modelo",
        description: extractApiError(error).message,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={model ? "Editar modelo" : "Nuevo modelo"}
      size="md"
      closeOnOverlayClick={!pending}
    >
      <Modal.Body>
        <form
          id="equipment-model-form"
          onSubmit={handleSubmit(submit)}
          className="grid gap-4 sm:grid-cols-2"
        >
          <Input
            label="Nombre"
            error={errors.name?.message}
            {...register("name")}
          />
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                label="Tipo"
                error={errors.type?.message}
                value={field.value}
                onValueChange={field.onChange}
                options={[
                  { value: "ANAQUEL", label: "Anaquel" },
                  { value: "NEVERA", label: "Nevera" },
                  { value: "OTROS", label: "Otros" },
                ]}
              />
            )}
          />
          <Input
            label="Marca"
            error={errors.brand?.message}
            {...register("brand")}
          />
          <Input
            label="Capacidad"
            type="number"
            error={errors.capacity?.message}
            {...register("capacity")}
          />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose} disabled={pending}>
          Cancelar
        </Button>
        <Button type="submit" form="equipment-model-form" isLoading={pending}>
          {model ? "Guardar cambios" : "Crear modelo"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function IconButton({
  label,
  onClick,
  children,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={
        danger
          ? "rounded p-2 text-danger hover:bg-red-50 hover:text-red-700"
          : "rounded p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }
    >
      {children}
    </button>
  );
}
