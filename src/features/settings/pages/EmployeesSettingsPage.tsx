import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Edit3, Plus } from "lucide-react";
import { sileo } from "sileo";
import { Button } from "@/shared/components/core/Button";
import { Checkbox } from "@/shared/components/core/Checkbox";
import { Input } from "@/shared/components/core/Input";
import { Modal } from "@/shared/components/core/Modal";
import { Pagination } from "@/shared/components/core/Pagination";
import { Select } from "@/shared/components/core/Select";
import { ErrorState } from "@/shared/components/ErrorState";
import SectionLoader from "@/shared/components/SectionLoader";
import { usePagination } from "@/shared/hooks/usePagination";
import type {
  Employee,
  EmployeeInput,
  EmployeePosition,
} from "@/shared/types/entities/employee.types";
import { extractApiError } from "@/shared/utils/error-handler";
import {
  useCreateEmployee,
  useGetEmployees,
  useUpdateEmployee,
} from "@/features/employees/hooks/useEmployee";
import { SettingsPageHeader } from "../components/SettingsPageHeader";

const positionOptions: Array<{ value: EmployeePosition; label: string }> = [
  { value: "CHOFER", label: "Chofer" },
  { value: "CAJERO", label: "Cajero" },
  { value: "OPERADOR", label: "Operador" },
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "ADMINISTRACION", label: "Administración" },
];

const positionLabel = (position: EmployeePosition) =>
  positionOptions.find((option) => option.value === position)?.label ?? position;

const ALL_FILTER = "__all__";

export default function EmployeesSettingsPage() {
  const { page, limit, setPage, setLimit } = usePagination({ defaultLimit: 10 });
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<EmployeePosition | typeof ALL_FILTER>(
    ALL_FILTER,
  );
  const [active, setActive] = useState<typeof ALL_FILTER | "true" | "false">(
    ALL_FILTER,
  );
  const [editing, setEditing] = useState<Employee | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const filters = useMemo(
    () => ({
      page,
      limit,
      search: search.trim() || undefined,
      position: position === ALL_FILTER ? undefined : position,
      isActive: active === ALL_FILTER ? undefined : active === "true",
    }),
    [active, limit, page, position, search],
  );
  const employees = useGetEmployees(filters);
  const records = employees.data?.data ?? [];
  const pagination = employees.data?.meta.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const openCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
  };
  const clearFilters = () => {
    setSearch("");
    setPosition(ALL_FILTER);
    setActive(ALL_FILTER);
    setPage(1);
  };

  return (
    <>
      <SettingsPageHeader
        title="Empleados"
        description="Personal operativo y administrativo disponible para la operación y las cuentas móviles"
        actions={
          <Button variant="outline" size="sm" icon={Plus} onClick={openCreate}>
            Nuevo empleado
          </Button>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col p-8">
        <div className="flex min-h-0 max-w-6xl flex-1 flex-col">
          <div className="grid shrink-0 gap-3 border-b border-slate-200 pb-5 sm:grid-cols-2 lg:grid-cols-[minmax(14rem,1fr)_12rem_10rem_auto]">
            <Input
              label="Buscar"
              value={search}
              placeholder="Nombre, código, teléfono o cédula"
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              inputSize="sm"
            />
            <Select
              label="Puesto"
              size="sm"
              value={position}
              onValueChange={(value) => {
                setPosition(value as EmployeePosition | typeof ALL_FILTER);
                setPage(1);
              }}
              options={[{ value: ALL_FILTER, label: "Todos" }, ...positionOptions]}
            />
            <Select
              label="Estado"
              size="sm"
              value={active}
              onValueChange={(value) => {
                setActive(value as typeof ALL_FILTER | "true" | "false");
                setPage(1);
              }}
              options={[
                { value: ALL_FILTER, label: "Todos" },
                { value: "true", label: "Activos" },
                { value: "false", label: "Inactivos" },
              ]}
            />
            <Button variant="outline" className="self-end" onClick={clearFilters}>
              Limpiar
            </Button>
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            {employees.isLoading ? (
              <SectionLoader placeholder="Cargando empleados" />
            ) : employees.isError ? (
              <ErrorState
                title="No se pudieron cargar los empleados"
                error={employees.error}
                onRetry={employees.refetch}
              />
            ) : (
              <div className="min-w-0 overflow-x-auto">
                <table className="w-full min-w-220 text-left text-sm">
                  <thead className="border-b border-slate-200 text-xs text-slate-500">
                    <tr>
                      <th className="py-3 pr-4 font-medium">Empleado</th>
                      <th className="py-3 pr-4 font-medium">Puesto</th>
                      <th className="py-3 pr-4 font-medium">Contacto</th>
                      <th className="py-3 pr-4 font-medium">Cuenta</th>
                      <th className="py-3 pr-4 font-medium">Estado</th>
                      <th className="py-3 text-right font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {records.map((employee) => (
                      <tr key={employee.id}>
                        <td className="py-4 pr-4">
                          <p className="font-medium text-slate-900">
                            {employee.name} {employee.lastName}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            Código {employee.employeeCode}
                          </p>
                        </td>
                        <td className="py-4 pr-4 text-slate-700">
                          {positionLabel(employee.position)}
                        </td>
                        <td className="py-4 pr-4 text-slate-600">
                          <p>{employee.phoneNumber || "Sin teléfono"}</p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {employee.cedula || "Sin cédula"}
                          </p>
                        </td>
                        <td className="py-4 pr-4">
                          <span className={employee.userId ? "text-emerald-700" : "text-slate-500"}>
                            {employee.userId ? "Cuenta vinculada" : "Sin cuenta"}
                          </span>
                        </td>
                        <td className="py-4 pr-4">
                          <span className={employee.isActive ? "text-emerald-700" : "text-slate-500"}>
                            {employee.isActive ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Edit3}
                            onClick={() => {
                              setEditing(employee);
                              setIsFormOpen(true);
                            }}
                          >
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {records.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          No hay empleados que coincidan con los filtros.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="shrink-0 border-t border-slate-200 pt-3">
            <Pagination
              currentPage={Math.min(page, totalPages)}
              totalPages={totalPages}
              totalItems={pagination?.total ?? 0}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </div>
        </div>
      </div>
      <EmployeeFormModal
        employee={editing}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </>
  );
}

function EmployeeFormModal({
  employee,
  isOpen,
  onClose,
}: {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const create = useCreateEmployee();
  const update = useUpdateEmployee();
  const [draft, setDraft] = useState<EmployeeInput>({
    name: "",
    lastName: "",
    employeeCode: "",
    position: "CHOFER",
    phoneNumber: "",
    cedula: "",
    licenseExpirationDate: "",
    isActive: true,
  });

  useEffect(() => {
    if (!isOpen) return;
    setDraft({
      name: employee?.name ?? "",
      lastName: employee?.lastName ?? "",
      employeeCode: employee?.employeeCode ?? "",
      position: employee?.position ?? "CHOFER",
      phoneNumber: employee?.phoneNumber ?? "",
      cedula: employee?.cedula ?? "",
      licenseExpirationDate: employee?.licenseExpirationDate ?? "",
      isActive: employee?.isActive ?? true,
    });
  }, [employee, isOpen]);

  const pending = create.isPending || update.isPending;
  const updateField = <K extends keyof EmployeeInput>(key: K, value: EmployeeInput[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data: EmployeeInput = {
        ...draft,
        name: draft.name.trim(),
        lastName: draft.lastName.trim(),
        employeeCode: draft.employeeCode.trim(),
        phoneNumber: draft.phoneNumber?.trim() || undefined,
        cedula: draft.cedula?.trim() || undefined,
        licenseExpirationDate: draft.licenseExpirationDate || undefined,
      };
      if (employee) await update.mutateAsync({ id: employee.id, data });
      else await create.mutateAsync(data);
      sileo.success({ title: employee ? "Empleado actualizado" : "Empleado registrado" });
      onClose();
    } catch (error) {
      sileo.error({
        title: "No se pudo guardar el empleado",
        description: extractApiError(error).message,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee ? "Editar empleado" : "Nuevo empleado"}
      size="lg"
      closeOnOverlayClick={!pending}
    >
      <Modal.Body>
        <form id="employee-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <Input label="Nombre" value={draft.name} onChange={(event) => updateField("name", event.target.value)} required autoFocus />
          <Input label="Apellido" value={draft.lastName} onChange={(event) => updateField("lastName", event.target.value)} required />
          <Input label="Código de empleado" value={draft.employeeCode} onChange={(event) => updateField("employeeCode", event.target.value)} placeholder="Ej. 0042" required />
          <Select label="Puesto" value={draft.position} onValueChange={(value) => updateField("position", value as EmployeePosition)} options={positionOptions} />
          <Input label="Teléfono" value={draft.phoneNumber} onChange={(event) => updateField("phoneNumber", event.target.value)} placeholder="8091234567" />
          <Input label="Cédula" value={draft.cedula} onChange={(event) => updateField("cedula", event.target.value)} placeholder="000-0000000-0" />
          <Input label="Vencimiento de licencia" type="date" value={draft.licenseExpirationDate} onChange={(event) => updateField("licenseExpirationDate", event.target.value)} disabled={draft.position !== "CHOFER"} />
          <div className="flex items-end pb-1">
            <Checkbox
              label="Empleado activo"
              checked={Boolean(draft.isActive)}
              onChange={(event) => updateField("isActive", event.target.checked)}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose} disabled={pending}>Cancelar</Button>
        <Button type="submit" form="employee-form" isLoading={pending}>
          {employee ? "Guardar cambios" : "Registrar empleado"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
