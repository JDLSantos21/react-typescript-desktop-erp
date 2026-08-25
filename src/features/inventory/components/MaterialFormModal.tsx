import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/core/Button";
import { Input } from "@/shared/components/core/Input";
import { Modal } from "@/shared/components/core/Modal";
import { SearchSelect } from "@/shared/components/core/SearchSelect";
import { Textarea } from "@/shared/components/core/Textarea";
import {
  materialSchema,
  type MaterialFormData,
  type MaterialFormInput,
} from "../schemas/inventory.schema";
import { useCreateMaterial, useUpdateMaterial } from "../hooks/useInventory";
import type { InventoryCategory, InventoryMaterial, InventoryUnit } from "../types/inventory";

interface MaterialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  material?: InventoryMaterial | null;
  categories: InventoryCategory[];
  units: InventoryUnit[];
}

export function MaterialFormModal({
  isOpen,
  onClose,
  material,
  categories,
  units,
}: MaterialFormModalProps) {
  const createMaterial = useCreateMaterial();
  const updateMaterial = useUpdateMaterial();
  const isEditing = Boolean(material);
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<MaterialFormInput, unknown, MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: "",
      description: null,
      categoryId: 0,
      unitId: 0,
      stock: 0,
      minimumStock: 0,
    },
  });

  useEffect(() => {
    reset({
      name: material?.name ?? "",
      description: material?.description ?? null,
      categoryId: material?.categoryId ?? 0,
      unitId: material?.unitId ?? 0,
      stock: material?.stock ?? 0,
      minimumStock: material?.minimumStock ?? 0,
    });
  }, [material, reset]);

  const onSubmit = async (data: MaterialFormData) => {
    const input = { ...data, description: data.description || null };
    if (material) await updateMaterial.mutateAsync({ id: material.id, input });
    else await createMaterial.mutateAsync(input);
    onClose();
  };

  const categoryOptions = categories.map((category) => ({
    value: String(category.id),
    label: category.name,
  }));
  const unitOptions = units.map((unit) => ({ value: String(unit.id), label: unit.name }));
  const isPending = createMaterial.isPending || updateMaterial.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Editar material" : "Nuevo material"} size="lg">
      <Modal.Body>
        <form id="material-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input label="Nombre" placeholder="Ej. Tapas para botellón" error={errors.name?.message} {...register("name")} />
            </div>
            <Controller name="categoryId" control={control} render={({ field }) => (
              <SearchSelect label="Categoría" options={categoryOptions} value={field.value ? String(field.value) : ""} onValueChange={(value) => field.onChange(Number(value))} error={errors.categoryId?.message} placeholder="Seleccione una categoría" />
            )} />
            <Controller name="unitId" control={control} render={({ field }) => (
              <SearchSelect label="Unidad de medida" options={unitOptions} value={field.value ? String(field.value) : ""} onValueChange={(value) => field.onChange(Number(value))} error={errors.unitId?.message} placeholder="Seleccione una unidad" />
            )} />
            <Input label="Existencia inicial" type="number" min="0" step="any" helperText={isEditing ? "Modificar este valor genera un ajuste trazable." : undefined} error={errors.stock?.message} {...register("stock")} />
            <Input label="Stock mínimo" type="number" min="0" step="any" error={errors.minimumStock?.message} {...register("minimumStock")} />
          </div>
          <Textarea label="Descripción" placeholder="Referencia o detalle del material" error={errors.description?.message} {...register("description")} />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose} disabled={isPending}>Cancelar</Button>
        <Button type="submit" form="material-form" isLoading={isPending}>{isEditing ? "Guardar cambios" : "Crear material"}</Button>
      </Modal.Footer>
    </Modal>
  );
}
