import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/core/Button";
import { Input } from "@/shared/components/core/Input";
import { Modal } from "@/shared/components/core/Modal";
import { SearchSelect } from "@/shared/components/core/SearchSelect";
import { Textarea } from "@/shared/components/core/Textarea";
import { useCreateStockMove } from "../hooks/useInventory";
import {
  stockMoveSchema,
  type StockMoveFormData,
  type StockMoveFormInput,
} from "../schemas/inventory.schema";
import type { InventoryMaterial, StockMoveType } from "../types/inventory";

interface StockMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  materials: InventoryMaterial[];
  initialMaterialId?: number;
  canAdjust?: boolean;
}

const moveLabels: Record<StockMoveType, string> = {
  ENTRADA: "Entrada",
  SALIDA: "Salida",
  AJUSTE: "Ajuste de existencia",
};

export function StockMovementModal({ isOpen, onClose, materials, initialMaterialId, canAdjust = false }: StockMovementModalProps) {
  const createMove = useCreateStockMove();
  const { control, register, watch, handleSubmit, reset, formState: { errors } } = useForm<StockMoveFormInput, unknown, StockMoveFormData>({
    resolver: zodResolver(stockMoveSchema),
    defaultValues: { materialId: initialMaterialId ?? 0, type: "ENTRADA", quantity: 0, description: null, date: null },
  });
  const type = watch("type");

  useEffect(() => {
    if (!isOpen) return;
    reset({
      materialId: initialMaterialId ?? 0,
      type: "ENTRADA",
      quantity: 0,
      description: null,
      date: null,
    });
  }, [initialMaterialId, isOpen, reset]);

  const onSubmit = async (data: StockMoveFormData) => {
    await createMove.mutateAsync({ ...data, description: data.description || null, date: data.date || null });
    reset({ materialId: initialMaterialId ?? 0, type: "ENTRADA", quantity: 0, description: null, date: null });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar movimiento" size="lg">
      <Modal.Body>
        <form id="stock-movement-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Controller name="materialId" control={control} render={({ field }) => (
            <SearchSelect label="Material" options={materials.map((material) => ({ value: String(material.id), label: `${material.name} · ${material.stock} ${material.unit.name}` }))} value={field.value ? String(field.value) : ""} onValueChange={(value) => field.onChange(Number(value))} error={errors.materialId?.message} placeholder="Seleccione el material" />
          )} />
          <Controller name="type" control={control} render={({ field }) => (
            <div>
              <p className="mb-1.5 text-xs font-medium text-input-label">Tipo de movimiento</p>
              <div className={`grid gap-2 ${canAdjust ? "grid-cols-3" : "grid-cols-2"}`}>
                {(Object.keys(moveLabels) as StockMoveType[]).filter((moveType) => moveType !== "AJUSTE" || canAdjust).map((moveType) => <Button key={moveType} type="button" variant={field.value === moveType ? "primary" : "outline"} onClick={() => field.onChange(moveType)} className="h-auto min-h-10 px-2">{moveLabels[moveType]}</Button>)}
              </div>
            </div>
          )} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={type === "AJUSTE" ? "Nueva existencia" : "Cantidad"} type="number" min="0" max="50" step="any" helperText={type === "AJUSTE" ? "El sistema registrará la diferencia como ajuste." : "Máximo 50 unidades por movimiento."} error={errors.quantity?.message} {...register("quantity")} />
            <Input label="Fecha y hora" type="datetime-local" error={errors.date?.message} {...register("date")} />
          </div>
          <Textarea label="Motivo o referencia" placeholder="Opcional, pero recomendado para la trazabilidad" error={errors.description?.message} {...register("description")} />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose} disabled={createMove.isPending}>Cancelar</Button>
        <Button type="submit" form="stock-movement-form" isLoading={createMove.isPending}>Registrar movimiento</Button>
      </Modal.Footer>
    </Modal>
  );
}
