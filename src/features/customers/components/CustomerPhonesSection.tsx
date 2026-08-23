import { useFieldArray, Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { CreateCustomerFormData } from "../schemas/customer.schema";
import { Button } from "@/shared/components/core/Button";
import { Input } from "@/shared/components/core/Input";
import { Select } from "@/shared/components/core/Select";
import { Checkbox } from "@/shared/components/core/Checkbox";
import { PlusIcon, DeleteIcon } from "@/shared/components/icons";

interface CustomerPhonesSectionProps {
  control: Control<CreateCustomerFormData>;
  register: UseFormRegister<CreateCustomerFormData>;
  errors: FieldErrors<CreateCustomerFormData>;
}

export function CustomerPhonesSection({ control, register, errors }: CustomerPhonesSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "phones",
  });

  return (
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
            append({
              description: "",
              phoneNumber: "",
              type: "MOVIL",
              hasWhatsapp: false,
              isPrimary: false,
            })
          }
        >
          Agregar teléfono
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="bg-background-secondary border border-border-light rounded-sm p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-sm font-medium text-text-primary">
                Teléfono {index + 1}
              </h4>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <DeleteIcon className="w-4 h-4" />
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
                error={errors.phones?.[index]?.phoneNumber?.message}
                {...register(`phones.${index}.phoneNumber`)}
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
                  {...register(`phones.${index}.hasWhatsapp`)}
                />
                <Checkbox
                  label="Principal"
                  {...register(`phones.${index}.isPrimary`)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
