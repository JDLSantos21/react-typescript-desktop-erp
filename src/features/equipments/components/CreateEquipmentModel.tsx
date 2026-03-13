import { zodResolver } from "@hookform/resolvers/zod";
import {
  ModelFormData,
  ModelFormInput,
  modelSchema,
} from "../schemas/equipments.schema";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateModel } from "../hooks/useEquipments";
import { Input } from "@/shared/components/core/Input";
import { Select } from "@/shared/components/core/Select";
import { Button } from "@/shared/components/core/Button";
import { PlusIcon } from "@/shared/components/icons";

export default function CreateEquipmentModel() {
  const {
    register,
    handleSubmit,
    control,
    reset: resetModelForm,
    formState: { errors },
  } = useForm<ModelFormInput, unknown, ModelFormData>({
    resolver: zodResolver(modelSchema),
  });

  const { mutate: createModelMutation, isPending: isCreatingModel } =
    useCreateModel();

  const onSubmit = async (data: ModelFormData) => {
    createModelMutation(data);
    toast.success("Modelo creado exitosamente");
    resetModelForm();
  };

  return (
    <section className="p-3 border border-border-light rounded-sm shadow flex flex-col">
      <h3 className="text-lg font-bold text-text-primary mb-4 uppercase">
        Crear nuevo modelo
      </h3>

      <form
        id="create-model-form"
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Input
          label="Descripción"
          error={errors.name?.message}
          {...register("name")}
          placeholder="Ej: ANQ-18"
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
          placeholder="Ej: LILY"
        />
        <Input
          type="number"
          label="Capacidad"
          error={errors.capacity?.message}
          {...register("capacity")}
          placeholder="Ej: 18"
        />
      </form>

      <Button
        isLoading={isCreatingModel}
        icon={PlusIcon}
        type="submit"
        form="create-model-form"
        className="w-full mt-auto"
      >
        Crear modelo
      </Button>
    </section>
  );
}
