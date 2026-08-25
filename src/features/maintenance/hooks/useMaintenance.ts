import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/query-client";
import { MaintenanceService } from "../api/maintenance.service";
import { AuthorizeMaintenanceInput, CreateMaintenanceInput, MaintenanceProcedureInput, MaintenanceQuery, MaintenanceScheduleInput, MaintenanceStatus, ProcessMaintenanceInput } from "../types/maintenance";

const keys = {
  all: ["maintenance"],
  list: (params: MaintenanceQuery) => ["maintenance", "list", params],
  dashboard: ["maintenance", "dashboard"],
  detail: (id: string) => ["maintenance", "detail", id],
  drivers: ["maintenance", "drivers"],
  procedures: ["maintenance", "procedures"],
  vehicleSchedule: (vehicleId: string) => ["maintenance", "schedule", vehicleId],
};
const invalidate = () => queryClient.invalidateQueries({ queryKey: keys.all });

export const useMaintenances = (params: MaintenanceQuery) => useQuery({ queryKey: keys.list(params), queryFn: () => MaintenanceService.list(params) });
export const useCreateMaintenance = () => useMutation({ mutationFn: (data: CreateMaintenanceInput) => MaintenanceService.create(data), onSuccess: invalidate });
export const useUpdateMaintenanceStatus = () => useMutation({ mutationFn: ({ id, status }: { id: string; status: MaintenanceStatus }) => MaintenanceService.updateStatus(id, status), onSuccess: invalidate });
export const useMaintenanceDetail = (id?: string) => useQuery({ queryKey: keys.detail(id ?? ""), queryFn: () => MaintenanceService.get(id ?? ""), enabled: Boolean(id) });
export const useAuthorizeMaintenance = () => useMutation({ mutationFn: ({ id, data }: { id: string; data: AuthorizeMaintenanceInput }) => MaintenanceService.authorize(id, data), onSuccess: invalidate });
export const useProcessMaintenance = () => useMutation({ mutationFn: (data: ProcessMaintenanceInput) => MaintenanceService.process(data), onSuccess: invalidate });
export const useMaintenanceDrivers = () => useQuery({ queryKey: keys.drivers, queryFn: () => MaintenanceService.drivers() });
export const useMaintenanceProcedures = (includeInactive = false) => useQuery({ queryKey: [...keys.procedures, includeInactive], queryFn: () => MaintenanceService.procedures(includeInactive) });
export const useCreateMaintenanceProcedure = () => useMutation({ mutationFn: (data: MaintenanceProcedureInput) => MaintenanceService.createProcedure(data), onSuccess: invalidate });
export const useUpdateMaintenanceProcedure = () => useMutation({ mutationFn: ({ id, data }: { id: number; data: Partial<MaintenanceProcedureInput> }) => MaintenanceService.updateProcedure(id, data), onSuccess: invalidate });
export const useDeactivateMaintenanceProcedure = () => useMutation({ mutationFn: (id: number) => MaintenanceService.deactivateProcedure(id), onSuccess: invalidate });
export const useMaintenanceDashboard = () => useQuery({ queryKey: keys.dashboard, queryFn: MaintenanceService.dashboard });
export const useVehicleMaintenanceSchedule = (vehicleId: string, enabled = true) => useQuery({ queryKey: keys.vehicleSchedule(vehicleId), queryFn: () => MaintenanceService.getVehicleSchedule(vehicleId), enabled: Boolean(vehicleId) && enabled });
export const useUpdateVehicleMaintenanceSchedule = () => useMutation({
  mutationFn: ({ vehicleId, data }: { vehicleId: string; data: MaintenanceScheduleInput }) => MaintenanceService.updateVehicleSchedule(vehicleId, data),
  onSuccess: invalidate,
});
