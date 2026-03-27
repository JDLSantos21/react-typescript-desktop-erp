import { useQuery } from "@tanstack/react-query";
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
