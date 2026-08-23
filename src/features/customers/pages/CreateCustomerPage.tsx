import { useForm } from "react-hook-form";
import {
  createCustomerSchema,
  CreateCustomerFormData,
} from "../schemas/customer.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/core/Button";
import { Input } from "@/shared/components/core/Input";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { useaddCustomer } from "../hooks/useCustomer";
import { extractApiError } from "@/shared/utils/error-handler";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Nuevas sub-secciones refactorizadas
import { CustomerPhonesSection } from "../components/CustomerPhonesSection";
import { CustomerAddressesSection } from "../components/CustomerAddressesSection";

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
      businessName: "",
      representativeName: "",
      rnc: "",
      email: "",
      notes: "",
      phones: [
        {
          description: "",
          phoneNumber: "",
          type: "MOVIL",
          hasWhatsapp: false,
          isPrimary: true,
        },
      ],
      addresses: [
        {
          branchName: "",
          direction: "",
          city: "",
          isPrimary: true,
        },
      ],
    },
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
              error={errors.businessName?.message}
              {...register("businessName")}
            />
            <Input
              label="Nombre del Representante"
              placeholder="Ej: Juan Pérez"
              error={errors.representativeName?.message}
              {...register("representativeName")}
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
              error={errors.notes?.message}
              {...register("notes")}
            />
          </div>
        </section>

        <div className="xl:flex">
          <CustomerPhonesSection
            control={control}
            register={register}
            errors={errors}
          />
          <CustomerAddressesSection
            control={control}
            register={register}
            errors={errors}
          />
        </div>
      </form>
    </div>
  );
}
