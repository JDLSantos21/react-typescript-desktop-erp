import { useForm, useFieldArray } from "react-hook-form";
import {
  createCustomerSchema,
  CreateCustomerFormData,
} from "../schemas/customer.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, Checkbox } from "@/shared/components";
import { useHeaderConfig } from "@/shared/hooks";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useaddCustomer } from "../hooks/useCustomer";
import { extractApiError } from "@/shared/utils";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function CreateCustomerPage() {
  const navigate = useNavigate();

  const { mutate: addCustomer, isPending } = useaddCustomer();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateCustomerFormData>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      business_name: "",
      representative_name: "",
      rnc: "",
      email: "",
      note: "",
      phones: [
        {
          description: "",
          phone_number: "",
          type: "MOVIL",
          has_whatsapp: false,
          is_primary: true,
        },
      ],
      addresses: [
        {
          branch_name: "",
          direction: "",
          city: "",
          is_primary: true,
        },
      ],
    },
  });

  // Field Arrays para teléfonos y direcciones
  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    control,
    name: "phones",
  });

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray({
    control,
    name: "addresses",
  });

  const onSubmit = (data: CreateCustomerFormData) => {
    addCustomer(data, {
      onSuccess: () => {
        toast.success("Cliente creado con éxito", { position: "top-center" });
        navigate("/customers");
      },
      onError: (err) => {
        toast.error(extractApiError(err as AxiosError).message, {
          position: "top-center",
        });
      },
    });
  };

  useHeaderConfig({
    title: "Crear nuevo cliente",
    description: "Rellena el formulario para añadir un nuevo cliente.",
    actions: (
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => navigate("/customers")}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button onClick={handleSubmit(onSubmit)} isLoading={isPending}>
          Guardar cliente
        </Button>
      </div>
    ),
  });

  return (
    <div className="mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Información General */}
        <section className="p-3">
          <h3 className="text-lg font-bold text-text-primary mb-4 uppercase">
            Información General
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre del Negocio"
              placeholder="Ej: Ferretería El Martillo"
              error={errors.business_name?.message}
              {...register("business_name")}
            />
            <Input
              label="Nombre del Representante"
              placeholder="Ej: Juan Pérez"
              error={errors.representative_name?.message}
              {...register("representative_name")}
            />
            <Input
              label="RNC (Opcional)"
              placeholder="000-0000000-0"
              error={errors.rnc?.message}
              {...register("rnc")}
            />
            <Input
              label="Correo Electrónico (Opcional)"
              type="email"
              placeholder="ejemplo@correo.com"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
          <div className="mt-4">
            <Input
              label="Nota (Opcional)"
              placeholder="Información adicional sobre el cliente"
              error={errors.note?.message}
              {...register("note")}
            />
          </div>
        </section>

        <div className="xl:flex">
          {/* Teléfonos */}
          <section className="p-3 xl:w-1/2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-text-primary uppercase">
                  Teléfonos
                </h3>
                <p className="text-sm text-text-muted">
                  Agrega uno o más números de teléfono
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={PlusIcon}
                onClick={() =>
                  appendPhone({
                    description: "",
                    phone_number: "",
                    type: "MOVIL",
                    has_whatsapp: false,
                    is_primary: false,
                  })
                }
              >
                Agregar teléfono
              </Button>
            </div>

            <div className="space-y-4">
              {phoneFields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-background-secondary border border-border-light rounded-sm p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-sm font-medium text-text-primary">
                      Teléfono {index + 1}
                    </h4>
                    {phoneFields.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removePhone(index)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      label="Descripción"
                      placeholder="Ej: Oficina principal"
                      error={errors.phones?.[index]?.description?.message}
                      {...register(`phones.${index}.description`)}
                    />
                    <Input
                      label="Número"
                      placeholder="(809) 555-5555"
                      error={errors.phones?.[index]?.phone_number?.message}
                      {...register(`phones.${index}.phone_number`)}
                    />
                    <Select
                      label="Tipo"
                      options={[
                        { value: "MOVIL", label: "Móvil" },
                        { value: "FIJO", label: "Fijo" },
                        { value: "TRABAJO", label: "Trabajo" },
                        { value: "OTROS", label: "Otros" },
                      ]}
                      {...register(`phones.${index}.type`)}
                    />
                    <div className="flex items-center gap-4 pt-6">
                      <Checkbox
                        label="¿Tiene WhatsApp?"
                        {...register(`phones.${index}.has_whatsapp`)}
                      />
                      <Checkbox
                        label="Principal"
                        {...register(`phones.${index}.is_primary`)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Direcciones */}
          <section className="p-3 xl:w-1/2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold uppercase text-text-primary">
                  Direcciones
                </h3>
                <p className="text-sm text-text-muted">
                  Agrega una o más direcciones
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={PlusIcon}
                onClick={() =>
                  appendAddress({
                    branch_name: "",
                    direction: "",
                    city: "",
                    is_primary: false,
                  })
                }
              >
                Agregar dirección
              </Button>
            </div>

            <div className="space-y-4">
              {addressFields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-background-secondary border border-border-light rounded-sm p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-sm font-medium text-text-primary">
                      Dirección {index + 1}
                    </h4>
                    {addressFields.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeAddress(index)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      label="Nombre de Sucursal (Opcional)"
                      placeholder="Ej: Sucursal Centro"
                      error={errors.addresses?.[index]?.branch_name?.message}
                      {...register(`addresses.${index}.branch_name`)}
                    />
                    <Input
                      label="Ciudad"
                      placeholder="Ej: Santo Domingo"
                      error={errors.addresses?.[index]?.city?.message}
                      {...register(`addresses.${index}.city`)}
                    />
                    <div>
                      <Input
                        label="Dirección"
                        placeholder="Ej: Calle Principal #123, Sector Los Jardines"
                        error={errors.addresses?.[index]?.direction?.message}
                        {...register(`addresses.${index}.direction`)}
                      />
                    </div>
                    <div className="flex items-center pt-6">
                      <Checkbox
                        label="Dirección principal"
                        {...register(`addresses.${index}.is_primary`)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
