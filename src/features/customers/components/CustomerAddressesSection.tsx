import { useFieldArray, Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { CreateCustomerFormData } from "../schemas/customer.schema";
import { Button } from "@/shared/components/core/Button";
import { Input } from "@/shared/components/core/Input";
import { Checkbox } from "@/shared/components/core/Checkbox";
import { PlusIcon, DeleteIcon } from "@/shared/components/icons";

interface CustomerAddressesSectionProps {
  control: Control<CreateCustomerFormData>;
  register: UseFormRegister<CreateCustomerFormData>;
  errors: FieldErrors<CreateCustomerFormData>;
}

export function CustomerAddressesSection({ control, register, errors }: CustomerAddressesSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  return (
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
            append({
              branchName: "",
              direction: "",
              city: "",
              isPrimary: false,
            })
          }
        >
          Agregar dirección
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
                Dirección {index + 1}
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
                label="Nombre de Sucursal (Opcional)"
                placeholder="Ej: Sucursal Centro"
                error={errors.addresses?.[index]?.branchName?.message}
                {...register(`addresses.${index}.branchName`)}
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
                  {...register(`addresses.${index}.isPrimary`)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
