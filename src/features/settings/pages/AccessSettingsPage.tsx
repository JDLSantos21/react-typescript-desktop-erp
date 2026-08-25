import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link2, UserPlus, UserRoundCog } from "lucide-react";
import { sileo } from "sileo";
import { Button } from "@/shared/components/core/Button";
import { Input } from "@/shared/components/core/Input";
import { Modal } from "@/shared/components/core/Modal";
import { Select } from "@/shared/components/core/Select";
import { ErrorState } from "@/shared/components/ErrorState";
import SectionLoader from "@/shared/components/SectionLoader";
import type {
  RegisterUserDto,
  User,
  UserRole,
} from "@/shared/types/entities/user.types";
import { extractApiError } from "@/shared/utils/error-handler";
import { useModal } from "@/shared/hooks/useModal";
import {
  useAssignSystemUserRoles,
  useRegisterSystemUser,
  useSystemRoles,
  useSystemUsers,
} from "@/features/auth/hooks/useAuth";
import {
  useGetEmployees,
  useLinkEmployeeAccount,
} from "@/features/employees/hooks/useEmployee";
import type { SystemRole } from "@/features/auth/api/auth.service";
import { SettingsPageHeader } from "../components/SettingsPageHeader";

const roleLabels: Record<UserRole, string> = {
  ADMIN: "Administrador",
  ADMINISTRATIVO: "Administrativo",
  SUPERVISOR: "Supervisor",
  OPERADOR: "Operador",
  CHOFER: "Chofer",
  USER: "Consulta",
};

export default function AccessSettingsPage() {
  const createModal = useModal();
  const rolesModal = useModal();
  const accountModal = useModal();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const users = useSystemUsers();
  const roles = useSystemRoles();
  const openRoles = (user: User) => {
    setSelectedUser(user);
    rolesModal.open();
  };
  const openAccount = (user: User) => {
    setSelectedUser(user);
    accountModal.open();
  };
  return (
    <>
      <SettingsPageHeader
        title="Usuarios y roles"
        description="Cuentas de acceso y asignación de permisos dentro del ERP"
        actions={
          <Button
            variant="outline"
            size="sm"
            icon={UserPlus}
            onClick={createModal.open}
          >
            Nuevo usuario
          </Button>
        }
      />
      <div className="p-8">
        <div className="max-w-6xl">
          {users.isLoading || roles.isLoading ? (
            <SectionLoader placeholder="Cargando usuarios y roles" />
          ) : users.isError || roles.isError ? (
            <ErrorState
              title="No se pudo cargar la administración de acceso"
              error={users.error ?? roles.error}
              onRetry={() => {
                void users.refetch();
                void roles.refetch();
              }}
            />
          ) : (
            <div className="overflow-x-auto border-y border-slate-200">
              <table className="w-full min-w-170 text-left text-sm">
                <thead className="text-xs text-slate-500">
                  <tr>
                    <th className="py-3 font-medium">Usuario</th>
                    <th className="py-3 font-medium">Nombre</th>
                    <th className="py-3 font-medium">Empleado</th>
                    <th className="py-3 font-medium">Roles asignados</th>
                    <th className="py-3 text-right font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(users.data?.data ?? []).map((user) => (
                    <tr key={user.id}>
                      <td className="py-4 font-medium text-slate-900">
                        {user.username}
                      </td>
                      <td className="py-4 text-slate-600">
                        {user.name} {user.lastName}
                      </td>
                      <td className="py-4">
                        <span className={user.employeeId ? "text-emerald-700" : "text-slate-500"}>
                          {user.employeeId ? "Vinculado" : "Sin vincular"}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {user.roles.map((role) => (
                            <span
                              key={role}
                              className="rounded-sm bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                            >
                              {roleLabels[role]}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={UserRoundCog}
                          onClick={() => openRoles(user)}
                        >
                          Asignar roles
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Link2}
                          onClick={() => openAccount(user)}
                        >
                          Vincular empleado
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <CreateUserModal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        roles={roles.data?.data ?? []}
      />
      <AssignRolesModal
        isOpen={rolesModal.isOpen}
        onClose={rolesModal.close}
        user={selectedUser}
        roles={roles.data?.data ?? []}
      />
      <EmployeeAccountLinkModal
        isOpen={accountModal.isOpen}
        onClose={accountModal.close}
        user={selectedUser}
      />
    </>
  );
}

function CreateUserModal({
  isOpen,
  onClose,
  roles,
}: {
  isOpen: boolean;
  onClose: () => void;
  roles: SystemRole[];
}) {
  const create = useRegisterSystemUser();
  const employees = useGetEmployees({ page: 1, limit: 100, isActive: true }, isOpen);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegisterUserDto>({
    defaultValues: {
      username: "",
      password: "",
      name: "",
      lastName: "",
      roleIds: [],
      employeeId: undefined,
    },
  });
  const selected = watch("roleIds");
  const employeeId = watch("employeeId");
  const selectedEmployee = (employees.data?.data ?? []).find(
    (employee) => employee.id === employeeId,
  );

  useEffect(() => {
    if (!selectedEmployee) return;
    setValue("name", selectedEmployee.name, { shouldValidate: true });
    setValue("lastName", selectedEmployee.lastName, { shouldValidate: true });
  }, [selectedEmployee, setValue]);
  const submit = async (data: RegisterUserDto) => {
    try {
      await create.mutateAsync(data);
      sileo.success({ title: "Usuario creado" });
      reset();
      onClose();
    } catch (error) {
      sileo.error({
        title: "No se pudo crear el usuario",
        description: extractApiError(error).message,
      });
    }
  };
  const toggleRole = (id: number) =>
    setValue(
      "roleIds",
      selected.includes(id)
        ? selected.filter((roleId) => roleId !== id)
        : [...selected, id],
      { shouldValidate: true },
    );
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo usuario"
      size="lg"
      closeOnOverlayClick={!create.isPending}
    >
      <Modal.Body>
        <form
          id="create-system-user"
          onSubmit={handleSubmit(submit)}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <Select
              label="Empleado (opcional)"
              placeholder="Crear una cuenta independiente"
              value={employeeId ?? ""}
              onValueChange={(value) => setValue("employeeId", value || undefined, { shouldValidate: true })}
              options={(employees.data?.data ?? [])
                .filter((employee) => !employee.userId)
                .map((employee) => ({
                  value: employee.id,
                  label: `${employee.name} ${employee.lastName} · ${employee.employeeCode}`,
                }))}
              disabled={employees.isLoading}
            />
            <p className="mt-1 text-xs text-slate-500">
              Al vincularlo, el nombre de la cuenta se toma del empleado y queda disponible para su app móvil.
            </p>
          </div>
          <Input
            label="Nombre"
            error={errors.name?.message}
            disabled={Boolean(employeeId)}
            {...register("name", { required: "El nombre es obligatorio" })}
          />
          <Input
            label="Apellido"
            error={errors.lastName?.message}
            disabled={Boolean(employeeId)}
            {...register("lastName", {
              required: "El apellido es obligatorio",
            })}
          />
          <Input
            label="Usuario"
            error={errors.username?.message}
            {...register("username", {
              required: "El usuario es obligatorio",
              minLength: { value: 4, message: "Mínimo 4 caracteres" },
            })}
          />
          <Input
            label="Contraseña temporal"
            type="password"
            error={errors.password?.message}
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: { value: 6, message: "Mínimo 6 caracteres" },
            })}
          />
          <input
            type="hidden"
            {...register("roleIds", {
              validate: (value) =>
                value.length > 0 || "Selecciona al menos un rol",
            })}
          />
          <RoleChecklist
            roles={roles}
            selectedIds={selected}
            onToggle={toggleRole}
            error={errors.roleIds?.message}
          />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose} disabled={create.isPending}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form="create-system-user"
          isLoading={create.isPending}
        >
          Crear usuario
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function AssignRolesModal({
  isOpen,
  onClose,
  user,
  roles,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  roles: SystemRole[];
}) {
  const assign = useAssignSystemUserRoles();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  useEffect(() => {
    if (isOpen)
      setSelectedIds(
        roles
          .filter((role) => user?.roles.includes(role.name))
          .map((role) => role.id),
      );
  }, [isOpen, roles, user]);
  const toggle = (id: number) =>
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((roleId) => roleId !== id)
        : [...current, id],
    );
  const submit = async () => {
    if (!user || !selectedIds.length) return;
    try {
      await assign.mutateAsync({ userId: user.id, roleIds: selectedIds });
      sileo.success({ title: "Roles actualizados" });
      onClose();
    } catch (error) {
      sileo.error({
        title: "No se pudieron actualizar los roles",
        description: extractApiError(error).message,
      });
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Roles de ${user?.username ?? ""}`}
      size="md"
      closeOnOverlayClick={!assign.isPending}
    >
      <Modal.Body>
        <p className="mb-5 text-sm text-slate-600">
          Los cambios toman efecto en la próxima validación de la sesión del
          usuario.
        </p>
        <RoleChecklist
          roles={roles}
          selectedIds={selectedIds}
          onToggle={toggle}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose} disabled={assign.isPending}>
          Cancelar
        </Button>
        <Button
          onClick={submit}
          isLoading={assign.isPending}
          disabled={!selectedIds.length}
        >
          Guardar roles
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function RoleChecklist({
  roles,
  selectedIds,
  onToggle,
  error,
}: {
  roles: SystemRole[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  error?: string;
}) {
  return (
    <fieldset className="sm:col-span-2">
      <legend className="text-sm font-medium text-slate-800">Roles</legend>
      <div className="mt-2 divide-y divide-slate-200 border-y border-slate-200">
        {roles.map((role) => (
          <label
            key={role.id}
            className="flex cursor-pointer items-center gap-3 py-3 text-sm"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(role.id)}
              onChange={() => onToggle(role.id)}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="font-medium text-slate-800">
              {roleLabels[role.name]}
            </span>
            <span className="text-slate-500">Nivel {role.hierarchyLevel}</span>
          </label>
        ))}
      </div>
      {error ? <p className="mt-1 text-xs text-danger">{error}</p> : null}
    </fieldset>
  );
}

function EmployeeAccountLinkModal({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}) {
  const employees = useGetEmployees({ page: 1, limit: 100 }, isOpen);
  const link = useLinkEmployeeAccount();
  const records = employees.data?.data ?? [];
  const linkedEmployee = records.find((employee) => employee.userId === user?.id);
  const [employeeId, setEmployeeId] = useState("");

  useEffect(() => {
    if (isOpen) setEmployeeId(linkedEmployee?.id ?? "");
  }, [isOpen, linkedEmployee?.id]);

  const submit = async () => {
    if (!user) return;
    try {
      if (employeeId) {
        await link.mutateAsync({ id: employeeId, userId: user.id });
      } else if (linkedEmployee) {
        await link.mutateAsync({ id: linkedEmployee.id, userId: null });
      }
      sileo.success({ title: employeeId ? "Empleado vinculado" : "Empleado desvinculado" });
      onClose();
    } catch (error) {
      sileo.error({
        title: "No se pudo actualizar la vinculación",
        description: extractApiError(error).message,
      });
    }
  };

  const options = [
    { value: "__none__", label: "Sin empleado vinculado" },
    ...records
      .filter(
        (employee) =>
          (!employee.userId && employee.isActive) || employee.userId === user?.id,
      )
      .map((employee) => ({
        value: employee.id,
        label: `${employee.name} ${employee.lastName} · ${employee.employeeCode}`,
      })),
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Empleado de ${user?.username ?? ""}`} size="md" closeOnOverlayClick={!link.isPending}>
      <Modal.Body>
        <Select
          label="Empleado"
          placeholder="Sin empleado vinculado"
          value={employeeId || "__none__"}
          onValueChange={(value) => setEmployeeId(value === "__none__" ? "" : value)}
          options={options}
          disabled={employees.isLoading}
        />
        <p className="mt-3 text-sm text-slate-600">
          Una cuenta solo puede estar asociada a un empleado. Puedes dejar la selección vacía para desvincularla.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose} disabled={link.isPending}>Cancelar</Button>
        <Button onClick={submit} isLoading={link.isPending} disabled={employees.isLoading}>
          Guardar vinculación
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
