import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/query-client";
import type { EmployeeInput } from "@/shared/types/entities/employee.types";
import { EmployeeService } from "../api/employee.service";
import { GetEmployeeParams } from "../types/employee.dto";

export const useGetAllDrivers = () => {
  return useQuery({
    queryKey: ["drivers"],
    queryFn: () => EmployeeService.getAllDrivers(),
  });
};

export const useGetEmployees = (params: GetEmployeeParams, enabled = true) => {
  return useQuery({
    queryKey: ["employees", params],
    queryFn: () => EmployeeService.getEmployees(params),
    enabled,
  });
};

const invalidateEmployees = () => {
  void queryClient.invalidateQueries({ queryKey: ["employees"] });
  void queryClient.invalidateQueries({ queryKey: ["auth", "users"] });
};

export const useCreateEmployee = () =>
  useMutation({ mutationFn: EmployeeService.create, onSuccess: invalidateEmployees });

export const useUpdateEmployee = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmployeeInput> }) =>
      EmployeeService.update(id, data),
    onSuccess: invalidateEmployees,
  });

export const useLinkEmployeeAccount = () =>
  useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string | null }) =>
      EmployeeService.linkAccount(id, userId),
    onSuccess: invalidateEmployees,
  });
